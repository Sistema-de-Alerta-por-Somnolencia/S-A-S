const API_URL = "http://localhost:3000/api/choferes";

// 1. LLAMADA AL CONTROLADOR (GET) para listar
async function listarChoferes() {
    try {
        const res = await fetch(API_URL);
        const choferes = await res.json();
        const tbody = document.getElementById('tablaChoferes');
        tbody.innerHTML = "";

        choferes.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}</td>
                    <td>${c.licencia}</td>
                    <td>${c.telefono || 'Sin dato'}</td> <td>${c.email || 'N/A'}</td>
                </tr>`;
        });
    } catch (err) { console.error("Error al obtener datos:", err); }
}

// 2. LLAMADA AL CONTROLADOR (POST) para registrar
document.getElementById('formRegistroChofer').addEventListener('submit', async (e) => {
    e.preventDefault();

    // El objeto debe tener las llaves EXACTAS que espera el controlador
    const data = {
        nombre: document.getElementById('c_nombre').value,
        apellido_paterno: document.getElementById('c_paterno').value,
        apellido_materno: document.getElementById('c_materno').value,
        licencia: document.getElementById('c_licencia').value,
        telefono: document.getElementById('c_telefono').value,
        email: document.getElementById('c_email').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("¡Registro exitoso en PostgreSQL!");
            e.target.reset();
            listarChoferes(); // Recargar la tabla
        }
    } catch (err) { alert("Error de conexión con el controlador"); }
});

// Cargar datos al iniciar
listarChoferes();