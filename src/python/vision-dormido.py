import os
import logging
import platform  # Para detectar el sistema operativo
import cv2
import mediapipe as mp
import numpy as np
from mediapipe.framework.formats import landmark_pb2
import time
import threading

from alertaFunction import hacer_sonar_alarma, enviar_json_camiones
from correo import enviar_correos_dinamicos

# --- DETECCIÓN AUTOMÁTICA DE SISTEMA ---
sistema_operativo = platform.system()

# 1. SILENCIADO TOTAL DE LOGS (Evita spam en terminal)
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["ABSL_LOGGING_LEVEL"] = "error"
os.environ["QT_LOGGING_RULES"] = "qt.qpa.*=false;*.debug=false"

# Solo aplicar prioridad MSMF si es Windows
if sistema_operativo == "Windows":
    os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"


# Acceder a solutions via mp.solutions
mp_drawing = mp.solutions.drawing_utils  # type: ignore
mp_drawing_styles = mp.solutions.drawing_styles  # type: ignore
mp_face_mesh = mp.solutions.face_mesh  # type: ignore

# CONFIGURACIÓN DEL MODELO
model_path = "face_landmarker.task"

BaseOptions = mp.tasks.BaseOptions
FaceLandmarker = mp.tasks.vision.FaceLandmarker
FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

options = FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    running_mode=VisionRunningMode.VIDEO,
    output_face_blendshapes=True,
    output_facial_transformation_matrixes=True,
    num_faces=1,
)


def draw_landmarks_on_image(rgb_image, detection_result):
    face_landmarks_list = detection_result.face_landmarks
    annotated_image = np.copy(rgb_image)
    for face_landmarks in face_landmarks_list:
        face_landmarks_proto = landmark_pb2.NormalizedLandmarkList()  # type: ignore
        face_landmarks_proto.landmark.extend(
            [
                landmark_pb2.NormalizedLandmark(  # type: ignore
                    x=landmark.x, y=landmark.y, z=landmark.z
                )
                for landmark in face_landmarks
            ]
        )
        mp_drawing.draw_landmarks(
            image=annotated_image,
            landmark_list=face_landmarks_proto,
            connections=mp_face_mesh.FACEMESH_TESSELATION,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style(),
        )
    return annotated_image


def main():
    tiempo_inicio_ojos_cerrados = None
    TIEMPO_LIMITE_SEGUNDOS = 3.0
    alerta_ya_enviada = False

    # 2. INICIALIZAR CÁMARA CON DETECCIÓN AUTOMÁTICA DE BACKEND
    if sistema_operativo == "Linux":
        cap = cv2.VideoCapture(0, cv2.CAP_V4L2)
    elif sistema_operativo == "Darwin":  # macOS
        cap = cv2.VideoCapture(1, cv2.CAP_AVFOUNDATION)
    else:  # Windows o genérico
        cap = cv2.VideoCapture(0)

    # 3. CREAR VENTANA UNA SOLA VEZ (Fuera del bucle)
    cv2.namedWindow("Detector de Sueno UAM", cv2.WINDOW_NORMAL)

    with FaceLandmarker.create_from_options(options) as landmarker:
        print(
            f"SISTEMA ACTIVO ({sistema_operativo}). Presiona 'q' para salir.",
            flush=True,
        )

        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                continue

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            frame_timestamp_ms = int(time.time() * 1000)

            detection_result = landmarker.detect_for_video(mp_image, frame_timestamp_ms)
            annotated_image = draw_landmarks_on_image(rgb_frame, detection_result)
            frame_final = cv2.cvtColor(annotated_image, cv2.COLOR_RGB2BGR)

            if detection_result.face_blendshapes:
                face_blendshapes = detection_result.face_blendshapes[0]

                # Extraer scores
                scores = {b.category_name: b.score for b in face_blendshapes}
                ojos_cerrados = (
                    scores.get("eyeBlinkLeft", 0) > 0.5
                    and scores.get("eyeBlinkRight", 0) > 0.5
                )

                if ojos_cerrados:
                    if tiempo_inicio_ojos_cerrados is None:
                        tiempo_inicio_ojos_cerrados = time.time()

                    if (
                        time.time() - tiempo_inicio_ojos_cerrados
                    ) >= TIEMPO_LIMITE_SEGUNDOS and not alerta_ya_enviada:
                        alerta_ya_enviada = True
                        print("!!! ALERTA: CONDUCTOR DORMIDO !!!", flush=True)

                        datos = {
                            "id_unidad": "TRK-001",
                            "id_tipo_alerta": "Dormido",
                            "chofer": "Erick Alejandro",
                            "latitud": 19.4326,
                            "longitud": -99.1332,
                        }

                        # 4. LANZAR HILOS COMO DAEMON (Evita duplicidad de ventanas)
                        threading.Thread(
                            target=enviar_json_camiones, args=(datos,), daemon=True
                        ).start()
                        threading.Thread(
                            target=enviar_correos_dinamicos, args=(datos,), daemon=True
                        ).start()
                        threading.Thread(
                            target=hacer_sonar_alarma,
                            args=("src/public/img/alerta.wav",),
                            daemon=True,
                        ).start()
                else:
                    tiempo_inicio_ojos_cerrados = None
                    alerta_ya_enviada = False

                # Texto en pantalla
                txt = "Zzzzz..." if ojos_cerrados else "Conduccion Segura"
                col = (0, 0, 255) if ojos_cerrados else (0, 255, 0)
                cv2.putText(
                    frame_final, txt, (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.5, col, 3
                )

            cv2.imshow("Detector de Sueno UAM", frame_final)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
