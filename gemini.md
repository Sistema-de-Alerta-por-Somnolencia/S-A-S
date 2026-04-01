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