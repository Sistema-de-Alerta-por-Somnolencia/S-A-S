const tablaUnidades = document.getElementById('tablaUnidades');
const tablaMarcas = document.getElementById('tablaMarcas');
const tablaModelos = document.getElementById('tablaModelos');

const marcaSelect = document.getElementById('u_marca_select');
const modeloSelect = document.getElementById('u_modelo_select');
const modIdMarcaSelect = document.getElementById('mod_id_marca');

let todosLosModelos = [];

// --- CARGAR DATOS ---

async function cargarUnidades() {
    const res = await fetch('/api/unidades');
    const unidades = await res.json();
    tablaUnidades.innerHTML = unidades.map(u => `
        <tr>
            <td>${u.placa}</td>
            <td>${u.nombre_marca} - ${u.nombre_modelo}</td>
            <td>
                <button onclick="prepararEdicion(${u.id_unidad}, '${u.placa}', ${u.id_modelo})" class="btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="eliminarUnidad(${u.id_unidad})" class="btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function cargarMarcas() {
    const res = await fetch('/api/unidades/marcas');
    const marcas = await res.json();
    
    const options = '<option value="">Seleccione marca...</option>' + 
        marcas.map(m => `<option value="${m.id_marca}">${m.nombre_marca}</option>`).join('');
    
    marcaSelect.innerHTML = options;
    modIdMarcaSelect.innerHTML = options;

    tablaMarcas.innerHTML = marcas.map(m => `
        <tr><td>${m.nombre_marca}</td><td>---</td></tr>
    `).join('');
}

async function cargarModelos() {
    const res = await fetch('/api/unidades/modelos');
    todosLosModelos = await res.json();
    
    tablaModelos.innerHTML = todosLosModelos.map(m => `
        <tr><td>${m.nombre_modelo}</td><td>${m.nombre_marca}</td><td>---</td></tr>
    `).join('');
}

// --- EVENTOS Y LOGICA ---

// Filtrado de modelos por marca
marcaSelect.addEventListener('change', (e) => {
    const idMarca = e.target.value;
    if (!idMarca) {
        modeloSelect.disabled = true;
        modeloSelect.innerHTML = '<option value="">Seleccione marca primero...</option>';
        return;
    }
    const filtrados = todosLosModelos.filter(m => m.id_marca == idMarca);
    modeloSelect.innerHTML = '<option value="">Seleccione modelo...</option>' + 
        filtrados.map(m => `<option value="${m.id_modelo}">${m.nombre_modelo}</option>`).join('');
    modeloSelect.disabled = false;
});

// Guardar Unidad (Principal)
document.getElementById('formRegistroUnidad').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('u_id').value;
    const datos = {
        placa: document.getElementById('u_placa').value,
        id_modelo: modeloSelect.value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/unidades/${id}` : '/api/unidades';

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    e.target.reset();
    document.getElementById('u_id').value = '';
    cargarUnidades();
});

// Guardar Marca
document.getElementById('formMarca').addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputMarca = document.getElementById('m_nombre');
    const nombre = inputMarca.value.trim();

    if (!nombre) return;

    try {
        const res = await fetch('/api/unidades/marcas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_marca: nombre }) // Enviamos el nombre exacto que espera el controlador
        });

        if (res.ok) {
            inputMarca.value = ''; // Limpiar el input
            alert("Marca añadida con éxito");
            await cargarMarcas(); // Recargar los selects y la tabla de marcas
        } else {
            const errorData = await res.json();
            alert("Error: " + errorData.error);
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("No se pudo conectar con el servidor");
    }
});

// Guardar Modelo
document.getElementById('formModelo').addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        id_marca: modIdMarcaSelect.value,
        nombre_modelo: document.getElementById('mod_nombre').value
    };
    await fetch('/api/unidades/modelos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    e.target.reset();
    cargarModelos();
});

async function eliminarUnidad(id) {
    if(confirm('¿Eliminar unidad?')) {
        await fetch(`/api/unidades/${id}`, { method: 'DELETE' });
        cargarUnidades();
    }
}

// Función para cargar datos en el formulario para editar
window.prepararEdicion = (id, placa, idModelo) => {
    document.getElementById('u_id').value = id;
    document.getElementById('u_placa').value = placa;
    document.getElementById('form-title').innerHTML = '<i class="fas fa-edit"></i> Editando Unidad';
    document.getElementById('btn-cancelar').style.display = 'inline-block';
    // Aquí el usuario deberá re-seleccionar marca/modelo para asegurar consistencia
};

document.addEventListener('DOMContentLoaded', () => {
    cargarUnidades();
    cargarMarcas();
    cargarModelos();
});