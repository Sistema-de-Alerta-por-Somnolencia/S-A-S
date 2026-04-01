let mapa;

// Esta función es llamada automáticamente por Google Maps cuando el script termina de cargar
async function initMap() {
    // 1. Opciones iniciales del mapa (centrado en la CDMX)
    const opcionesMapa = {
        zoom: 11,
        center: { lat: 19.4326, lng: -99.1332 },
        mapId: "TU_MAP_ID_OPCIONAL" // Útil si usas estilos personalizados en la nube
    };

    // 2. Instanciar el mapa en el div
    mapa = new google.maps.Map(document.getElementById("mapa-flota"), opcionesMapa);

    // 3. Obtener los datos de tu API
    try {
        const respuesta = await fetch('/api/camiones');
        const camiones = await respuesta.json();

        // 4. Recorrer los camiones y poner un marcador por cada uno
        camiones.forEach(camion => {
            const posicion = { lat: camion.lat, lng: camion.lng };

            // Puedes cambiar el color del pin según el estado (activo, advertencia, etc.)
            let colorPin = camion.estado === 'activo' ? 'green' : (camion.estado === 'advertencia' ? 'orange' : 'red');

            const marcador = new google.maps.Marker({
                position: posicion,
                map: mapa,
                title: `Unidad: ${camion.id} - Chofer: ${camion.chofer}`
                // icon: `http://maps.google.com/mapfiles/ms/icons/${colorPin}-dot.png` // Pin clásico de colores
            });

            // Opcional: Agregar un popup (InfoWindow) al hacer clic en el camión
            const infoWindow = new google.maps.InfoWindow({
                content: `<b>${camion.id}</b><br>Chofer: ${camion.chofer}<br>Estado: ${camion.estado}`
            });

            marcador.addListener("click", () => {
                infoWindow.open(mapa, marcador);
            });
        });

    } catch (error) {
        console.error("Error al cargar las unidades en el mapa:", error);
    }
}

// Le pedimos la llave a nuestro propio servidor Node
<<<<<<< HEAD
fetch('/CargarMapa')
=======
fetch('/api/config/maps')
>>>>>>> a74f9f2 (mapas protegidos)
    .then(response => response.json())
    .then(data => {
        // Creamos la etiqueta <script> dinámicamente
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&callback=initMap`;
        script.async = true;
        script.defer = true;

        // La pegamos en el HTML para que cargue el mapa
        document.head.appendChild(script);
    })
    .catch(error => console.error("Error cargando la llave de Maps:", error));