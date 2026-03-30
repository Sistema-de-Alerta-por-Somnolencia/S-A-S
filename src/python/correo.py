import smtplib
import csv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

# ==========================================
#              CONFIGURACIÓN
# ==========================================

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_REMITENTE = os.getenv("EMAIL_REMITENTE")
PASSWORD_MAIL = os.getenv("PASSWORD_MAIL")

DIRECTORIO_BASE = os.path.dirname(os.path.abspath(__file__))
ARCHIVO_CSV = os.path.join(DIRECTORIO_BASE, "contactos.csv")


def enviar_correos_dinamicos(datos_camion):
    """
    Función que lee el CSV de contactos y envía una alerta a todos.
    Recibe el diccionario 'datos_camion' con la info en tiempo real.
    """
    # 1. Conexión al servidor SMTP
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_REMITENTE, PASSWORD_MAIL)  # type: ignore
        print("✅ Conectado al servidor SMTP de Gmail.", flush=True)
    except Exception as e:
        print(f"❌ Error de conexión: {e}", flush=True)
        return

    # 2. Leer CSV de contactos
    try:
        with open(ARCHIVO_CSV, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            filas = list(reader)
    except FileNotFoundError:
        print(f"❌ No se encuentra '{ARCHIVO_CSV}'", flush=True)
        return

    print(f"📂 Procesando {len(filas)} contactos para enviar alerta...", flush=True)

    # 3. Bucle de envío a todos los contactos del CSV
    for fila in filas:
        try:
            msg = MIMEMultipart()
            msg["From"] = EMAIL_REMITENTE  # type: ignore
            msg["To"] = fila["Email"]

            # Personalizamos el asunto con el ID de la unidad
            msg["Subject"] = (
                f"🚨 ALERTA CRÍTICA: Unidad {datos_camion.get('id_unidad', 'Desconocida')}"
            )

            nombre_monitorista = fila.get("Nombre", "Monitorista").strip()
            lat = datos_camion.get("latitud", "N/A")
            lon = datos_camion.get("longitud", "N/A")

            # Generamos un enlace para que el monitorista abra el mapa directo
            enlace_mapa = (
                f"https://www.google.com/maps?q={lat},{lon}"
                if lat != "N/A"
                else "Ubicación no disponible"
            )

            cuerpo_final = f""" Hola {nombre_monitorista},

            El equipo de SAS envía este correo para alertar sobre una incidencia crítica detectada en tiempo real:

            - Unidad: {datos_camion.get("id_unidad", "N/A")}
            - Chofer: {datos_camion.get("chofer", "N/A")}
            - Tipo de Alerta: {datos_camion.get("id_tipo_alerta", "N/A").upper()}
            - Timestamp: {datos_camion.get("timestamp", "N/A")}
            - Coordenadas: {datos_camion.get("latitud", "N/A")}, {datos_camion.get("longitud", "N/A")}
            - Ver en el mapa: {enlace_mapa}

            Por favor, comuníquese con el conductor inmediatamente.
            """
            msg.attach(MIMEText(cuerpo_final, "plain"))

            # Enviar el correo
            server.send_message(msg)
            print(f"📤 Alerta enviada exitosamente a {fila['Email']}", flush=True)

        except Exception as e:
            print(f"⚠️ Error enviando correo a {fila['Email']}: {e}", flush=True)

    # Cerrar conexión
    server.quit()
    print("🏁 Envío de correos de emergencia finalizado.", flush=True)


# Para probar el script de forma individual
if __name__ == "__main__":
    import time

    datos_prueba = {
        "id_unidad": "TRK-001",
        "id_tipo_alerta": "dormido",
        "chofer": "Erick Alejandro",
        "timestamp": time.time(),
    }
    enviar_correos_dinamicos(datos_prueba)
