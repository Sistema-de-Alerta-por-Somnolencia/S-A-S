# Sistema de Detección de Somnolencia y Alertas en Tiempo Real

## Descripción del Proyecto
Este proyecto es un sistema integral de monitoreo diseñado para detectar signos de fatiga y somnolencia en conductores, así como la presencia de objetos de riesgo en la cabina. Su objetivo principal es prevenir accidentes de tráfico mediante el análisis de video en tiempo real, emitiendo alertas automatizadas y mostrando la información en un panel de control web.

## Tecnologías Utilizadas
* **Backend:** Node.js con Express para la gestión de peticiones JSON y la API REST.
* **Frontend:** HTML, CSS, y JavaScript para el Dashboard interactivo de visualización.
* **Base de Datos:** PostgreSQL para el registro y gestión de choferes y unidades de transporte.
* **Geolocalización:** Integración de la API de Google Maps para el rastreo de las unidades en la interfaz.
* **Visión por Computadora e Inteligencia Artificial:** Python, OpenCV y MediaPipe.
* **Notificaciones:** Script de Python configurado con cliente SMTP para el envío automatizado de correos electrónicos de alerta.

## Modelos y Redes Neuronales
El sistema hace uso de **dos enfoques principales de redes neuronales** trabajando en conjunto:
1.  **Red de Detección de Puntos Faciales (MediaPipe):** Utilizada para mapear el rostro del conductor en tiempo real. Esta red permite calcular métricas clave para determinar el estado de alerta: la apertura de los ojos (para detectar si el conductor se está durmiendo) y la apertura de la boca (para identificar bostezos).
2.  **Red de Detección de Objetos:** Un modelo entrenado para identificar elementos de riesgo que violen las políticas de seguridad dentro del vehículo, identificando específicamente la presencia de armas y cigarros.

## Dependencias de Python
El módulo de visión por computadora requiere las siguientes librerías:
* absl-py==2.4.0
* attrs==25.4.0
* cffi==2.0.0
* contourpy==1.3.3
* cycler==0.12.1
* flatbuffers==25.12.19
* fonttools==4.61.1
* kiwisolver==1.4.9
* matplotlib==3.10.8
* mediapipe==0.10.9
* numpy==2.4.2
* opencv-contrib-python==4.13.0.92
* opencv-python==4.11.0.86
* packaging==26.0
* pillow==12.1.1
* protobuf==3.20.3
* pycparser==3.0
* pyparsing==3.3.2
* python-dateutil==2.9.0.post0
* six==1.17.0
* sounddevice==0.5.5

## Instrucciones de Ejecución

### 1. Requisitos Previos
* Python 3.11.
* Node.js instalado.
* PostgreSQL instalado y configurado en tu entorno local.

### 2. Configuración del Entorno de Visión por Computadora
1.  Clona este repositorio en tu máquina local.
2.  Abre una terminal y navega a la carpeta correspondiente al módulo de Python.
3.  Crea un entorno virtual para aislar las dependencias:
    ```bash
    python -m venv venv
    ```
4.  Activa el entorno virtual:
    * En Windows: `venv\Scripts\activate`
    * En macOS/Linux: `source venv/bin/activate`
5.  Instala las dependencias requeridas leyendo el archivo de requerimientos:
    ```bash
    pip install -r requirements.txt
    ```

### 3. Configuración del Servidor Web y Base de Datos
1.  Navega a la carpeta del servidor Node.js/Express.
2.  Instala las dependencias de Node:
    ```bash
    pnpm install
    ```
3.  Accede a tu gestor de PostgreSQL y ejecuta el script de base de datos incluido para crear las tablas de `Choferes`, `Unidades` y administradores.
4.  Configura tus variables de entorno (como los datos de conexión a la base de datos y puertos) según sea necesario.
5.  Inicia el servidor backend:
    ```bash
    pnpm start
    ```

### 4. Ejecución del Sistema Completo
1.  Asegúrate de que el servidor Express y PostgreSQL estén corriendo.
2.  Con el entorno virtual de Python activado, ejecuta el script principal para iniciar la captura de video y el análisis neuronal.
3.  Abre tu navegador y accede a la dirección local configurada (ej. `http://localhost:3000`) para visualizar el Dashboard interactivo, procesar los JSON en tiempo real y ver el posicionamiento en el mapa.