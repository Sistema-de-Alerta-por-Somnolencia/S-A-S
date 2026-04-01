import os
import cv2
import mediapipe as mp
import numpy as np
import time
import threading
from queue import Queue
from ultralytics import YOLO
import face_recognition as fr
from mediapipe.framework.formats import landmark_pb2

# Importaciones locales
from alertaFunction import hacer_sonar_alarma, enviar_json_camiones
from correo import enviar_correos_dinamicos

# Configuraciones de logs para limpieza en consola
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["ABSL_LOGGING_LEVEL"] = "error"


class VisionSystem:
    def __init__(self):
        # 1. Configuración de Modelos
        self.dir_actual = os.path.dirname(os.path.abspath(__file__))

        # YOLOv8
        ruta_yolo = os.path.join(self.dir_actual, "best.pt")
        self.model_yolo = YOLO(ruta_yolo)
        # Intentar usar MPS (Apple Silicon) si está disponible
        try:
            self.model_yolo.to("mps")
            print("🚀 YOLO usando MPS (Apple Silicon)")
        except:
            print("⚠️ YOLO usando CPU")

        # MediaPipe Face Mesh
        model_path = "face_landmarker.task"
        self.mp_drawing = mp.solutions.drawing_utils  # type:ignore
        self.mp_drawing_styles = mp.solutions.drawing_styles  # type:ignore
        self.mp_face_mesh = mp.solutions.face_mesh  # type:ignore

        BaseOptions = mp.tasks.BaseOptions
        FaceLandmarker = mp.tasks.vision.FaceLandmarker
        FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
        VisionRunningMode = mp.tasks.vision.RunningMode

        self.options_mp = FaceLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=model_path),
            running_mode=VisionRunningMode.VIDEO,
            output_face_blendshapes=True,
            num_faces=1,
        )

        # Face Recognition
        ruta_face = os.path.join(self.dir_actual, "alejandro.png")
        if os.path.exists(ruta_face):
            img_conocida = fr.load_image_file(ruta_face)
            self.vector_conocido = fr.face_encodings(img_conocida)[0]
            print("👤 Perfil facial cargado correctamente.")
        else:
            self.vector_conocido = None
            print("⚠️ No se encontró alejandro.png para reconocimiento facial.")

        # 2. Estado Compartido y Control
        self.frame_actual = None
        self.running = True
        self.lock = threading.Lock()

        # Resultados de los modelos
        self.yolo_results = None
        self.mp_results = None
        self.driver_name = "Escaneando..."
        self.alert_text = "Conducción Segura"
        self.alert_color = (0, 255, 0)

        # Lógica de Somnolencia
        self.tiempo_inicio_ojos_cerrados = None
        self.TIEMPO_LIMITE_SEGUNDOS = 3.0
        self.alerta_ya_enviada = False

    def draw_mp_landmarks(self, frame, detection_result):
        if not detection_result or not detection_result.face_landmarks:
            return frame

        annotated_image = np.copy(frame)
        for face_landmarks in detection_result.face_landmarks:
            face_landmarks_proto = landmark_pb2.NormalizedLandmarkList()  # type:ignore
            face_landmarks_proto.landmark.extend(
                [
                    landmark_pb2.NormalizedLandmark(x=l.x, y=l.y, z=l.z)  # type:ignore
                    for l in face_landmarks  # type:ignore
                ]
            )

            self.mp_drawing.draw_landmarks(
                image=annotated_image,
                landmark_list=face_landmarks_proto,
                connections=self.mp_face_mesh.FACEMESH_TESSELATION,
                landmark_drawing_spec=None,
                connection_drawing_spec=self.mp_drawing_styles.get_default_face_mesh_tesselation_style(),
            )
        return annotated_image

    def worker_drowsiness(self):
        """Hilo dedicado a MediaPipe Face Mesh"""
        with mp.tasks.vision.FaceLandmarker.create_from_options(
            self.options_mp
        ) as landmarker:
            while self.running:
                with self.lock:
                    if self.frame_actual is None:
                        continue
                    frame_copy = self.frame_actual.copy()

                rgb_frame = cv2.cvtColor(frame_copy, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
                timestamp = int(time.time() * 1000)

                results = landmarker.detect_for_video(mp_image, timestamp)
                self.mp_results = results

                # Procesar lógica de sueño
                if results.face_blendshapes:
                    face_blendshapes = results.face_blendshapes[0]
                    ojos_cerrados = False
                    blink_left = 0
                    blink_right = 0
                    boca_abierta = 0

                    for bs in face_blendshapes:
                        if bs.category_name == "eyeBlinkLeft":
                            blink_left = bs.score
                        elif bs.category_name == "eyeBlinkRight":
                            blink_right = bs.score
                        elif bs.category_name == "jawOpen":
                            boca_abierta = bs.score

                    if blink_left > 0.5 and blink_right > 0.5:
                        ojos_cerrados = True
                        self.alert_text = "ALERTA: Ojos Cerrados"
                        self.alert_color = (0, 0, 255)

                        if self.tiempo_inicio_ojos_cerrados is None:
                            self.tiempo_inicio_ojos_cerrados = time.time()

                        tiempo_transcurrido = (
                            time.time() - self.tiempo_inicio_ojos_cerrados
                        )
                        if (
                            tiempo_transcurrido >= self.TIEMPO_LIMITE_SEGUNDOS
                            and not self.alerta_ya_enviada
                        ):
                            print("🚨 CRÍTICO: Conductor dormido detectado")
                            self.trigger_emergency_alert("dormido")
                            self.alerta_ya_enviada = True
                    else:
                        self.tiempo_inicio_ojos_cerrados = None
                        self.alerta_ya_enviada = False
                        if boca_abierta > 0.5:
                            self.alert_text = "Bostezando..."
                            self.alert_color = (255, 165, 0)
                        else:
                            self.alert_text = "Conduccion Segura"
                            self.alert_color = (0, 255, 0)

                time.sleep(0.01)

    def worker_yolo(self):
        """Hilo dedicado a YOLOv8 para armas"""
        while self.running:
            with self.lock:
                if self.frame_actual is None:
                    continue
                frame_copy = self.frame_actual.copy()

            results = self.model_yolo(frame_copy, conf=0.25, verbose=False)
            self.yolo_results = results[0]

            # Si detecta algo sospechoso (clase de arma)
            if len(results[0].boxes) > 0:
                # Aquí podrías disparar una alerta de arma si el modelo está entrenado para ello
                pass

            time.sleep(0.05)

    def worker_face_rec(self):
        """Hilo de reconocimiento facial (cada 2 segundos)"""
        while self.running:
            if self.vector_conocido is None:
                break

            with self.lock:
                if self.frame_actual is None:
                    continue
                frame_copy = self.frame_actual.copy()

            # Reducir para velocidad
            small_frame = cv2.resize(frame_copy, (0, 0), fx=0.25, fy=0.25)
            rgb_small = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

            face_encodings = fr.face_encodings(rgb_small)
            if len(face_encodings) > 0:
                match = fr.compare_faces(
                    [self.vector_conocido], face_encodings[0], tolerance=0.5
                )
                self.driver_name = "Alejandro" if match[0] else "Desconocido"
            else:
                self.driver_name = "No detectado"

            time.sleep(2.0)

    def trigger_emergency_alert(self, tipo):
        datos_camion = {
            "id_unidad": "TRK-001",
            "id_tipo_alerta": tipo,
            "chofer": self.driver_name,
            "timestamp": time.time(),
            "latitud": 19.4326,
            "longitud": -99.1332,
        }
        # Audio inmediato
        hacer_sonar_alarma("src/public/img/alerta.wav")
        # API y Correo en hilos
        threading.Thread(target=enviar_json_camiones, args=(datos_camion,)).start()
        threading.Thread(target=enviar_correos_dinamicos, args=(datos_camion,)).start()

    def run(self):
        cap = cv2.VideoCapture(1)  # Cambiar a 0 si es webcam integrada
        if not cap.isOpened():
            print("❌ Error: No se pudo acceder a la cámara.")
            return

        # Iniciar hilos
        threading.Thread(target=self.worker_drowsiness, daemon=True).start()
        threading.Thread(target=self.worker_yolo, daemon=True).start()
        threading.Thread(target=self.worker_face_rec, daemon=True).start()

        print("🎬 Sistema de Visión SAS Iniciado. Presiona 'q' para salir.")

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            with self.lock:
                self.frame_actual = frame.copy()

            # --- DIBUJADO UNIFICADO ---
            display_frame = frame.copy()

            # 1. Dibujar YOLO (Boxes)
            if self.yolo_results is not None:
                # Dibujamos manualmente o usamos .plot() pero con cuidado de no sobreescribir todo
                for box in self.yolo_results.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    conf = box.conf[0]
                    cls = int(box.cls[0])
                    label = f"{self.model_yolo.names[cls]} {conf:.2f}"
                    cv2.rectangle(display_frame, (x1, y1), (x2, y2), (255, 0, 255), 2)
                    cv2.putText(
                        display_frame,
                        label,
                        (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (255, 0, 255),
                        2,
                    )

            # 2. Dibujar MediaPipe (Landmarks)
            if self.mp_results is not None:
                display_frame = self.draw_mp_landmarks(display_frame, self.mp_results)

            # 3. Overlay de Información General
            h, w, _ = display_frame.shape
            # Fondo para el header
            cv2.rectangle(display_frame, (0, 0), (w, 60), (0, 0, 0), -1)

            # Texto de Alerta (Centro)
            text_size = cv2.getTextSize(
                self.alert_text, cv2.FONT_HERSHEY_SIMPLEX, 1, 2
            )[0]
            cv2.putText(
                display_frame,
                self.alert_text,
                ((w - text_size[0]) // 2, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                self.alert_color,
                2,
            )

            # Chofer (Izquierda)
            cv2.putText(
                display_frame,
                f"Chofer: {self.driver_name}",
                (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
            )

            # FPS o Status (Derecha)
            cv2.putText(
                display_frame,
                "SAS v1.0 | UAM",
                (w - 180, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (200, 200, 200),
                1,
            )

            cv2.imshow("Sistema de Seguridad SAS - Vista Unificada", display_frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                self.running = False
                break

        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    system = VisionSystem()
    system.run()
