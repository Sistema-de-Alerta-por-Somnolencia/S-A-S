import smtplib
import csv
import os  # Importamos OS para manejar rutas de carpetas
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

# ==========================================
#              CONFIGURACIÓN
# ==========================================

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_REMITENTE = "alejandrovaca585@gmail.com"
PASSWORD = "weol orfm wool ldjh"

ARCHIVO_CSV = "contactos.csv" # de aqui salen los datos de los correos a los que se envia la alerta
# quiero que se queda la logica de enviar el correo a mas de un correo por si el 'cliente'
# quiere que se le notifique a n numero de personas



datos_camion = {
                            "id_unidad": "TRK-001", 
                            "id_tipo_alerta": "dormido",  
                            "chofer": "Erick Alejandro",
                            "timestamp": time.time(),
}

ASUNTO = "Alerta por Incidencia"

MENSAJE_PRINCIPAL = """
    El equipo de SAS envia este correo con la finalidad de alertar por una señal en la 
    Unidad {},
    de Tipo {}
    Hora {},
    Conductor {},
    Cordenadas: Longitud{{},Latitud{}}

"""

LIMITE_DIARIO = 400


def enviar_correos_dinamicos(String datos_camion):
    contador_envios = 0
    lista_actualizada = []

    # 1. Conexión al servidor
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_REMITENTE, PASSWORD)
        print("✅ Conectado al servidor.")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return

    # 2. Leer CSV
    try:
        with open(ARCHIVO_CSV, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            fieldnames = reader.fieldnames
            filas = list(reader)
    except FileNotFoundError:
        print(f"❌ No se encuentra '{ARCHIVO_CSV}'")
        return

    print(f"📂 Procesando {len(filas)} contactos...")

    # 3. Bucle de envío
    for fila in filas:
        # Validaciones de límite y estado
        if contador_envios >= LIMITE_DIARIO:
            lista_actualizada.append(fila)
            continue

        if fila.get("Estado") == "ENVIADO":
            lista_actualizada.append(fila)
            continue

        # --- Lógica del PDF Único ---
        nombre_archivo = fila["Archivo"]  # Leemos el nombre de la columna 'Archivo'
        ruta_completa = os.path.join(CARPETA_PDFS, nombre_archivo)

        # Verificamos si el archivo existe antes de intentar enviar
        if not os.path.isfile(ruta_completa):
            print(
                f"⚠️  ARCHIVO NO ENCONTRADO: {nombre_archivo} (Para {fila['Nombre']}). Se saltará este correo."
            )
            # No marcamos como enviado, se queda pendiente para cuando arregles el archivo
            lista_actualizada.append(fila)
            continue

        # Intento de envío
        try:
            msg = MIMEMultipart()
            msg["From"] = EMAIL_REMITENTE
            msg["To"] = fila["Email"]
            msg["Subject"] = ASUNTO

            cuerpo_final = f"Estimado {fila['Nombre']},\n\n{MENSAJE_PRINCIPAL}"
            msg.attach(MIMEText(cuerpo_final, "plain"))

            # Adjuntar el PDF específico
            with open(ruta_completa, "rb") as f:
                adjunto = MIMEApplication(f.read(), _subtype="pdf")
                adjunto.add_header(
                    "Content-Disposition", "attachment", filename=nombre_archivo
                )
                msg.attach(adjunto)

            server.send_message(msg)
            print(
                f"📤 [{contador_envios + 1}/{LIMITE_DIARIO}] Enviado a {fila['Email']} | Archivo: {nombre_archivo}"
            )

            fila["Estado"] = "ENVIADO"
            contador_envios += 1

        except Exception as e:
            print(f"⚠️ Error enviando a {fila['Email']}: {e}")

        lista_actualizada.append(fila)

    server.quit()

    # 4. Guardar CSV
    with open(ARCHIVO_CSV, "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(lista_actualizada)

    print(f"\n🏁 Sesión terminada. Enviados hoy: {contador_envios}")


if __name__ == "__main__":
    enviar_correos_dinamicos()
