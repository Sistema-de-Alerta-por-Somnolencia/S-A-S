import cv2
import mediapipe as mp
import numpy as np
import time
from mediapipe.framework.formats import landmark_pb2
import requests
import time # con esta biblioteca sabre cuanto tiempo tuvo los ojos cerrados la persona





# Acceder a solutions via mp.solutions (funciona en 0.10.x)
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh

# --- 1. CONFIGURACIÓN DEL MODELO ---
# Asegúrate de que 'face_landmarker.task' esté en la carpeta
model_path = "face_landmarker.task"

BaseOptions = mp.tasks.BaseOptions
FaceLandmarker = mp.tasks.vision.FaceLandmarker
FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

# Configurar opciones: MODO VIDEO es vital para webcam
options = FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    running_mode=VisionRunningMode.VIDEO,  # le decimos que no seran fotos, si no video en vivo
    output_face_blendshapes=True,  # ¡Importante para detectar sueño!
    output_facial_transformation_matrixes=True,
    num_faces=1,
)


def draw_landmarks_on_image(rgb_image, detection_result):
    face_landmarks_list = detection_result.face_landmarks
    annotated_image = np.copy(rgb_image)

    for face_landmarks in face_landmarks_list:
        # --- ARREGLO 1: Conversión de Formato (Evita que se cierre al detectar cara) ---
        face_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
        face_landmarks_proto.landmark.extend(
            [
                landmark_pb2.NormalizedLandmark(
                    x=landmark.x, y=landmark.y, z=landmark.z
                )
                for landmark in face_landmarks
            ]
        )

        # Dibujar malla facial
        mp_drawing.draw_landmarks(
            image=annotated_image,
            landmark_list=face_landmarks_proto,
            connections=mp_face_mesh.FACEMESH_TESSELATION,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style(),
        )

        # Dibujar contornos
        mp_drawing.draw_landmarks(
            image=annotated_image,
            landmark_list=face_landmarks_proto,
            connections=mp_face_mesh.FACEMESH_CONTOURS,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_contours_style(),
        )

    return annotated_image


# --- 3. BUCLE PRINCIPAL (MAIN LOOP) ---
def main():
    # voy a usar estas variables para el tiempo 
    tiempo_inicio_ojos_cerrados = None
    TIEMPO_LIMITE_SEGUNDOS = 2.0  # Si pasan 4 segundos, mandamos la alerta
    alerta_ya_enviada = False
    # Definimos las variables para ambos ojos
    ojo_cerrado_Izquierdo = 0.0
    ojo_cerrado_Derecho = 0.0
    boca_abierta = 0.0
    ojosCerrados = False
    
                
    
    # Inicializar la cámara (0 suele ser la webcam por defecto)
    cap = cv2.VideoCapture(1)

    # Crear el detector dentro de un bloque 'with' para asegurar que se cierre bien
    with FaceLandmarker.create_from_options(options) as landmarker:
        print("Iniciando cámara... presiona 'q' para salir.",flush=True)

        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                print("Ignorando frame vacío.")
                continue
            """
            Dimenciones del frame
            Definire las dimensiones para centrar texto
            """

            height, width, _ = frame.shape

            font = cv2.FONT_HERSHEY_COMPLEX
            font_scale = 5.5
            ancho_font = 3
            color_text = (0, 255, 0)  # verde al inicio
            texto_en_pantalla = "Conduccion Segura"
            text_size = cv2.getTextSize(
                texto_en_pantalla, font, font_scale, ancho_font
            )[0]
            text_width, text_height = text_size

            # Calculamos x,y
            x = (width - text_width) // 2
            y = (
                height - text_height
            ) // 4  # cambia el numero entre que se divide para subir o bajar el texto

            # A. PREPARAR LA IMAGEN
            # OpenCV usa BGR, MediaPipe necesita RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

            # B. CALCULAR TIMESTAMP (Requerido para modo VIDEO)
            # Usamos el tiempo actual en milisegundos
            frame_timestamp_ms = int(time.time() * 1000)

            # C. DETECTAR
            detection_result = landmarker.detect_for_video(mp_image, frame_timestamp_ms)

            # D. VISUALIZAR RESULTADOS
            # Convertimos de vuelta a BGR para mostrarlo en OpenCV
            annotated_image = draw_landmarks_on_image(rgb_frame, detection_result)
            bgr_annotated_image = cv2.cvtColor(annotated_image, cv2.COLOR_RGB2BGR)

            # Logica de mimir
            if detection_result.face_blendshapes:
                # Accedemos a la primera cara detectada ([0])
                face_blendshapes = detection_result.face_blendshapes[0]  # izquierdo

                """ Imprimimos todos los blendshapes para ver sus nombres y valores 
                for blendshape in face_blendshapes:
                    print(f"{blendshape.category_name}: {blendshape.score:.3f}")
                """
                
                

                for blendshape in face_blendshapes:
                    if blendshape.category_name == "eyeBlinkLeft":
                        ojo_cerrado_Izquierdo = blendshape.score
                    elif blendshape.category_name == "eyeBlinkRight":
                        ojo_cerrado_Derecho = blendshape.score
                    if blendshape.category_name == "jawOpen":
                        boca_abierta = blendshape.score

                if ojo_cerrado_Izquierdo > 0.500 and ojo_cerrado_Derecho > 0.500:
                    ojosCerrados = True
                    texto_en_pantalla = "       Zzzzz.."
                    color_text = (0, 0, 255)  # color rojo
                    
                    # Usamos flush=True para que Node lo vea al instante
                    #print(f"Alerta de ojos Cerrados {ojo_cerrado_Derecho:.3f} {ojo_cerrado_Izquierdo:.3f}", flush=True)
                    
                    #  Iniciar el cronometro si es la primera vez que cierra los ojos
                    if tiempo_inicio_ojos_cerrados is None:
                        tiempo_inicio_ojos_cerrados = time.time()
                        
                    #  Calcular cuanto lleva dormido
                    tiempo_trascurrido = time.time() - tiempo_inicio_ojos_cerrados
                    
                    #  Revisar si ya pasaron los 4 segundos 
                    if tiempo_trascurrido >= TIEMPO_LIMITE_SEGUNDOS and not alerta_ya_enviada:
                        print("Alerta por Conductor mimido", flush=True)
                        datos_camion = {
                            "id": "TRK-001", 
                            "chofer": "Erick Alejandro", 
                            "estado": "dormido",
                            "timestamp": time.time()
                        }
                        enviar_json_camiones(datos_camion)
                        alerta_ya_enviada = True
                        
                else:
                    # Si los ojos NO están cerrados (es decir, los abrió), reiniciamos todo
                    tiempo_inicio_ojos_cerrados = None
                    alerta_ya_enviada = False

                if boca_abierta > 0.500:
                    texto_en_pantalla = "Bostezando"
                    color_text = (255, 0, 0)  # color azul?
                    print(f"Conductor con Boca abierta {boca_abierta:3f}")

                

                cv2.putText(
                    frame,
                    texto_en_pantalla,
                    (x, y),
                    font,
                    font_scale,
                    color_text,
                    ancho_font,
                    cv2.LINE_AA,
                )

            # Mostrar en ventana
            # cambiar bgr por 'frame' cuando quiera dejar de mostrar la malla y solo el texto
            cv2.imshow("Detector de Sueño UAM", frame)

            # Salir con 'q'
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    cap.release()
    cv2.destroyAllWindows()



def enviar_json_camiones( datos_camion):
    """
    Envía un JSON mediante POST si el booleano es True.
    """
    
        # Asegúrate de usar la URL completa, incluyendo el dominio/localhost
    url = 'http://localhost:3000/api/alertas'
        
    try:
            # El parámetro 'json=' automáticamente convierte el diccionario a JSON 
            # y añade el header 'Content-Type: application/json'
            response = requests.post(url, json=datos_camion)
            
            # Esto lanza una excepción si el servidor responde con un error (ej. 404, 500)
            response.raise_for_status() 
            
            print("Petición enviada con éxito:", response.status_code, flush=True)
            return response.json() # Retorna la respuesta del servidor si es necesario
            
    except requests.exceptions.RequestException as e:
            print(f"Error al conectar con la API: {e}", flush=True)
            return None


#flag = True
#mi_payload = {"id": 45, "ruta": "Norte", "activo": True}
#enviar_json_camiones(flag, mi_payload)


if __name__ == "__main__":
    main()
