

# Contexto del Proyecto: Sistema de Detección y Alerta de Somnolencia en Tiempo Real

## 📌 Descripción General
Este proyecto es un sistema de ingeniería de software diseñado para detectar signos de fatiga y somnolencia en conductores en tiempo real. Utiliza visión por computadora y modelos de Machine Learning (incluyendo MediaPipe) para analizar los gestos faciales y el estado de los ojos del conductor, emitiendo alertas críticas para prevenir accidentes.

## 👥 Equipo
Proyecto desarrollado colaborativamente por un equipo de 2 personas.

## 🛠️ Stack Tecnológico Principal
* **Lenguaje:** Python, js, nodejs
* **Visión por Computadora / ML:** MediaPipe (detección de landmarks faciales), modelos de clasificación.
* **Notificaciones:** Alertas visuales/sonoras locales y notificaciones remotas vía correo electrónico.

## 🚀 Estado Actual del Desarrollo
**Módulo Activo:** Sistema de Notificaciones Remotas (Script de Alertas por Correo).

Actualmente, se está desarrollando e integrando un script en Python encargado de automatizar el envío de correos electrónicos de emergencia. Este script se dispara como un evento secundario cuando el modelo de detección clasifica el estado del conductor como "dormido" o con "somnolencia severa" durante un umbral de tiempo crítico.

### Requerimientos del Script de Correo:
1.  **Integración:** Debe poder ser llamado desde el bucle principal de detección (visión por computadora) sin bloquear el procesamiento de video en tiempo real (considerar ejecución asíncrona o en hilos separados).
2.  **Contenido del Mensaje:** El correo debe incluir detalles de la alerta (hora, nivel de criticidad) y, de ser posible, una captura del momento de la detección.
3.  **Seguridad:** Manejo seguro de credenciales (SMTP) mediante variables de entorno (`.env`).

## 🧠 Instrucciones para el Asistente de IA (Gemini)
* **Contexto de Código:** Al generar código para este proyecto, asume que estamos priorizando la baja latencia (tiempo real).
* **Librerías:** Prioriza el uso de librerías estándar como `smtplib` y `email.message` para el envío de correos, o librerías modernas asíncronas si se especifica.
* **Colaboración:** Mantén el código modular y documentado, ya que el proyecto es mantenido por múltiples desarrolladores.

# Instrucciones para unificar modelos de Visión Computacional (Proyecto SAS)

Hola Gemini, necesito tu ayuda experto en Python para refactorizar y unificar tres scripts de visión computacional en un solo sistema utilizando **multithreading** (o `multiprocessing` / `queue` si lo consideras más óptimo para evadir el GIL de Python). 

El objetivo es que los tres modelos analicen el mismo feed de video en tiempo real y en paralelo, sin que uno retrase al otro.

Aquí tienes el contexto de los tres módulos que deben funcionar a la par:

1. **`vision-dormido.py`**: Utiliza MediaPipe Face Mesh para detectar si el conductor cierra los ojos o bosteza. Maneja contadores de tiempo y, si el chofer se duerme, dispara un hilo secundario para enviar correos y hace una petición POST a una API en Node.js.
2. **`Rn.py`**: Utiliza una red neuronal YOLOv8 (cargando un modelo custom `best.pt`) para detectar armas en la cabina. 
3. **`faceDetection.py`**: Realiza reconocimiento facial para identificar de forma constante qué chofer está al volante.

**Requerimientos Arquitectónicos:**
* **Una sola cámara:** Solo podemos inicializar `cv2.VideoCapture(1)` una vez. Necesito un patrón donde un hilo principal (o productor) capture los *frames* de la cámara y los distribuya a los tres hilos "consumidores" (los modelos) de forma segura.
* **Rendimiento:** Estoy ejecutando esto localmente en una MacBook Air (Apple Silicon). El código debe ser eficiente. Si un modelo (como YOLO) tarda un poco más en procesar un frame, no debe congelar la detección rápida de parpadeos de MediaPipe.
* **Salida Visual:** Idealmente, me gustaría que las anotaciones de los tres modelos (malla facial, bounding boxes de YOLO, nombre del chofer) se unan y se muestren en una sola ventana de `cv2.imshow`, o que me propongas la mejor forma de visualizarlo sin matar el rendimiento.

Por favor, analízalo y genérame el código del archivo principal (ej. `main_vision.py`) que orqueste estos tres scripts usando buenas prácticas de concurrencia.