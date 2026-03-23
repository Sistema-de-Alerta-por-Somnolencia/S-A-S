
const tablaAlertas = document.getElementById('tabla_alertas');

async function obtenerAlertas() {
    try {
        // Hacemos una petición GET a la API
        console.log("Consultando a DB por alertas")
        const respuesta = await fetch('/api/alertas');

        if (!respuesta.ok) {
            console.error("Error al consultar alertas");
            throw new Error('Error al obtener alertas');

        }

        const alertas = await respuesta.json();

        // Limpiamos la tabla
        tablaAlertas.innerHTML = '';

        // Si no hay alertas, mostramos un mensaje
        if (alertas.length === 0) {
            tablaAlertas.innerHTML = '<tr><td colspan="3">No hay alertas recientes</td></tr>';
            return;
        }

        // Recorremos las alertas de la base de datos y creamos las filas
        alertas.forEach(alerta => {
            // Elegimos el color del ícono dependiendo de si es "dormido", "bostezando", etc.
            let colorIcono = 'icon-orange';
            if (alerta.id_tipo_alerta === 'dormido') {
                colorIcono = 'icon-red';
            }

            // Formateamos la fecha si viene de PostgreSQL
            const fecha = new Date(alerta.fecha_creacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const fila = document.createElement('tr');
            fila.innerHTML = `
    <td><i class="fas fa-circle ${colorIcono}"></i> ${fecha}</td>
    <td>${alerta.id_unidad}</td>
    <td>${alerta.id_tipo_alerta.toUpperCase()}</td>
    `;
            tablaAlertas.appendChild(fila);
        });

    } catch (error) {
        console.error("Error cargando alertas:", error);
    }
}

// Ejecutamos la funcion en cuanto se carga la pagina
obtenerAlertas();

// Este es el cronometro que pregunta cada 5 segundos si una nueva alerta ha ocurrido
setInterval(obtenerAlertas, 5000);
