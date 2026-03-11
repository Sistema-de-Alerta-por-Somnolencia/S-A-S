import face_recognition as fr
import cv2


imagen_desconocida = fr.load_image_file("alejandro.png")
vector_conocido = fr.face_encodings(imagen_desconocida)[0]
cap = cv2.VideoCapture(1)

if not cap.isOpened():
    print("no se pudo abrir la camara todo tibio")
    exit()
while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_recognition = frame
    vectores_en_camara = fr.face_encodings(frame_recognition)

    if len(vectores_en_camara) > 0:
        vector_desconocido = vectores_en_camara[0]
        coincidencia = fr.compare_faces(
            [vector_conocido], vector_desconocido, tolerance=0.6
        )
        if coincidencia[0]:
            print("Cara conocidad, Acceso concedido")
        else:
            print("Persona desconocida, Sin Acceso")
    else:
        print("sin imagen")

    cv2.imshow("Reconocimiento Facial", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
