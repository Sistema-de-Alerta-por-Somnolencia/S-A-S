import requests
import platform
import subprocess
import os


def hacer_sonar_alarma(archivo_wav):
    """
    Detecta el sistema operativo y reproduce el sonido en segundo plano.
    """
    sistema = platform.system()

    try:
        if sistema == "Darwin":  # macOS
            subprocess.Popen(["afplay", archivo_wav])
        elif sistema == "Windows":  # Windows
            import winsound

            winsound.PlaySound(archivo_wav, winsound.SND_FILENAME | winsound.SND_ASYNC)
        elif sistema == "Linux":  # Linux / Docker
            subprocess.Popen(["aplay", archivo_wav])
        else:
            print(f"Sistema {sistema} no soportado para audio nativo.")

    except Exception as e:
        print(f"Silencio en la sala, error de audio: {e}")


def enviar_json_camiones(datos_camion):
    url_alerta = "http://localhost:3000/api/alertas"

    # Usamos el middleware
    headers = {"x-api-key": "clave_secreta_camion_123"}

    try:
        # Hacemos el POST directo con los headers, sin necesidad de login previo
        response = requests.post(url_alerta, json=datos_camion, headers=headers)
        response.raise_for_status()

        print("Petición enviada con éxito:", response.status_code, flush=True)
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Error al conectar con la API: {e}", flush=True)
        return None
