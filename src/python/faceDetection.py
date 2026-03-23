import face_recognition as fr
import cv2

imagen_desconocida = fr.load_image_file("alejandro.png")
vector_conocido = fr.face_encodings(imagen_desconocida)[0]
cap = cv2.VideoCapture(1)

if not cap.isOpened():
    print("no se pudo abrir la camara todo tibio")
    exit()

# Creamos una bandera para procesar solo fotogramas alternos
procesar_este_frame = True

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Reducir el tamaño a 1/4 para acelerar el procesamiento
    frame_pequeno = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

    #  Convertir de BGR (OpenCV) a RGB (face_recognition) para presicion
    rgb_frame_pequeno = cv2.cvtColor(frame_pequeno, cv2.COLOR_BGR2RGB)

    # si cara esta en frame procesamos
    if procesar_este_frame:
        # Le pasamos la imagen pequeña y convertida
        vectores_en_camara = fr.face_encodings(rgb_frame_pequeno)

        if len(vectores_en_camara) > 0:
            vector_desconocido = vectores_en_camara[0]
            coincidencia = fr.compare_faces(
                [vector_conocido], vector_desconocido, tolerance=0.5
            )
            if coincidencia[0]:
                print("Cara conocida, Acceso concedido")
            else:
                print("Persona desconocida, Sin Acceso")
        else:
            print("sin imagen")

    # Invertimos la bandera
    procesar_este_frame = not procesar_este_frame

    # Mostramos el frame original
    cv2.imshow("Reconocimiento Facial", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
