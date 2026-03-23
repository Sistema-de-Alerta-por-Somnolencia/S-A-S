const tablaUnidades = document.getElementById('tabla_Camiones');

async function obtenerUnidades() {
    try {

        console.log("Consultando a DB por unidades...");
        const respuesta = await fetch('/api/flota/unidades-chofer');

        if (!respuesta.ok) {
            console.error("Error al consultar unidades con chofer");
            throw new Error('Error al obtener unidades, quien sabe que pedo');
        }

        const unidades = await respuesta.json();
        tablaUnidades.innerHTML = '';

        if (unidades.length === 0) {
            tablaUnidades.innerHTML = '<tr><td colspan="3">No hay Unidades añadidas recientemente </td></tr>';
            return;
        }

        unidades.forEach(unidad => {

            let colorIcono = 'icon-green';

            // Si el nombre del chofer es null, lo ponemos en rojo
            if (!unidad.nombre_chofer) {
                colorIcono = 'icon-red';
            }

            const fila = document.createElement('tr');


            const nombreMostrar = unidad.nombre_chofer ? unidad.nombre_chofer.toUpperCase() : '<span class="sin-chofer">SIN CHOFER</span>';

            fila.innerHTML = `
                <td><i class="fas fa-circle ${colorIcono}"></i> ${unidad.placa}</td>
                <td>${unidad.id_unidad}</td>
                <td>${nombreMostrar}</td>
            `;

            // lo agregamos
            tablaUnidades.appendChild(fila);
        });

    } catch (error) {
        console.error("Error cargando unidades:", error);
    }
}


obtenerUnidades();
setInterval(obtenerUnidades, 5000);