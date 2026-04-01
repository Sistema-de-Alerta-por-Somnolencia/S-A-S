import os
from ultralytics import YOLO
import cv2

# 1. Obtiene la ruta exacta de la carpeta donde está guardado Rn.py
directorio_actual = os.path.dirname(os.path.abspath(__file__))

# 2. Une esa ruta con el nombre de tu modelo
ruta_modelo = os.path.join(directorio_actual, "best.pt")

# 3. Carga el modelo con la ruta completa y segura
model = YOLO(ruta_modelo)

# Inicializar cámara (asegúrate de que el índice 1 sea tu webcam en la Mac)
cap = cv2.VideoCapture(1)

if not cap.isOpened():
    print("No se pudo abrir la cámara")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Ejecutar detección
    results = model(frame, conf=0.15)

    # Dibujar resultados
    annotated_frame = results[0].plot()

    cv2.imshow("Deteccion YOLO", annotated_frame)

    # Presiona Q para salir
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
