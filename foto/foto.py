from PIL import Image
import os


def comprimir_imagen(ruta_entrada, ruta_salida, calidad=85):
    # Abrir la imagen original
    img = Image.open(ruta_entrada)

    # Si la imagen está en formato PNG con transparencia,
    # la convertimos a RGB (fondo blanco) para guardarla como JPEG.
    # Los JPEG comprimen mucho mejor que los PNG.
    if img.mode in ("RGBA", "LA"):
        rgb_img = Image.new("RGB", img.size, (255, 255, 255))
        rgb_img.paste(img, mask=img.split()[3])  # 3 es el canal alpha
        img = rgb_img

    # Guardar con compresión. 'quality' va de 1 a 100.
    # Un valor de 85 suele ser perfecto: reduce mucho peso con pérdida imperceptible.
    img.save(ruta_salida, "JPEG", quality=calidad)

    # Mostrar la diferencia de peso
    peso_original = os.path.getsize(ruta_entrada) / (1024 * 1024)
    peso_final = os.path.getsize(ruta_salida) / (1024 * 1024)
    print(f"Completado, bakaa.")
    print(f"Peso original: {peso_original:.2f} MB")
    print(f"Peso final: {peso_final:.2f} MB")


# Reemplaza con los nombres reales de tus archivos
imagen_original = "foto1.png"  # O .jpg
imagen_comprimida = "logo_comprimido.jpg"

comprimir_imagen(imagen_original, imagen_comprimida)
