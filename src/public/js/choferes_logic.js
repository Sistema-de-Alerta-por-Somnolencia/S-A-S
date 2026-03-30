const API_URL = "http://localhost:3000/api/choferes";
let editandoId = null; 

// 1. Cargar y mostrar la tabla
async function listarChoferes() {
    try {
        const res = await fetch(API_URL);
        const choferes = await res.json();
        const tbody = document.getElementById('tablaChoferes');
        tbody.innerHTML = "";

        choferes.forEach(c => {
            // Creamos una fila y usamos dataset para guardar el objeto y no romper el HTML
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}</td>
                <td>${c.licencia}</td>
                <td>${c.telefono || 'Sin dato'}</td> 
                <td>${c.email || 'N/A'}</td>
                <td>
                    <button class="btn-edit" style="color: #007bff; border:none; background:none; cursor:pointer; font-size: 1.1rem;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" style="color: #dc3545; border:none; background:none; cursor:pointer; font-size: 1.1rem; margin-left: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            // Eventos para los botones
            tr.querySelector('.btn-edit').onclick = () => prepararEdicion(c);
            tr.querySelector('.btn-delete').onclick = () => eliminarChofer(c.id_chofer);

            tbody.appendChild(tr);
        });
    } catch (err) { 
        console.error("Error al obtener datos:", err); 
    }
}

// 2. Preparar el formulario para editar
window.prepararEdicion = (chofer) => {
    editandoId = chofer.id_chofer;
    document.getElementById('c_nombre').value = chofer.nombre;
    document.getElementById('c_paterno').value = chofer.apellido_paterno;
    document.getElementById('c_materno').value = chofer.apellido_materno;
    document.getElementById('c_licencia').value = chofer.licencia;
    document.getElementById('c_telefono').value = chofer.telefono;
    document.getElementById('c_email').value = chofer.email;
    
    // Cambiar visualmente el formulario
    document.getElementById('form-title').innerHTML = '<i class="fas fa-edit"></i> Editando Chofer';
    document.getElementById('btnSubmit').innerHTML = '<i class="fas fa-sync"></i> Actualizar Registro';
    document.getElementById('btnCancelar').style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 3. Función para cancelar edición
window.cancelarEdicion = () => {
    editandoId = null;
    document.getElementById('formRegistroChofer').reset();
    document.getElementById('form-title').innerHTML = '<i class="fas fa-user-plus"></i> Registrar Nuevo Chofer';
    document.getElementById('btnSubmit').innerHTML = '<i class="fas fa-save"></i> Guardar en Base de Datos';
    document.getElementById('btnCancelar').style.display = 'none';
};

// 4. Guardar (POST) o Actualizar (PUT)
document.getElementById('formRegistroChofer').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        nombre: document.getElementById('c_nombre').value,
        apellido_paterno: document.getElementById('c_paterno').value,
        apellido_materno: document.getElementById('c_materno').value,
        licencia: document.getElementById('c_licencia').value,
        telefono: document.getElementById('c_telefono').value,
        email: document.getElementById('c_email').value
    };

    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;
    const method = editandoId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert(editandoId ? "¡Datos actualizados!" : "¡Chofer registrado!");
            cancelarEdicion();
            listarChoferes();
        }
    } catch (err) { 
        alert("Error de conexión con el servidor"); 
    }
});

window.eliminarChofer = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este registro?")) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE' 
            });

            if (res.ok) {
                // Forzamos la actualización de la lista inmediatamente
                await listarChoferes(); 
                console.log("Registro eliminado y tabla actualizada");
            } else {
                const errorData = await res.json();
                alert("Error del servidor: " + errorData.error);
            }
        } catch (err) { 
            console.error("Error en la petición DELETE:", err);
            alert("No se pudo conectar con el servidor para eliminar"); 
        }
    }
};

// Iniciar carga
listarChoferes();