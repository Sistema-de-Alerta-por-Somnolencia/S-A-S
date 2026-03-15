document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const messageElement = document.getElementById('responseMessage');

    // 1. Extraemos los valores usando los IDs EXACTOS de tu HTML
    const name = document.getElementById('firstname-input').value;
    const lastname = document.getElementById('lastname-input').value;
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const passwordAgain = document.getElementById('password-input-again').value;

    // Validación
    if (password !== passwordAgain) {
        alert('Las contraseñas no son iguales.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ 
                name: name, 
                lastname: lastname, // Se enviará como apellido_paterno
                email: email, 
                password: password 
            })
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = `Éxito: ${data.message}`;
            messageElement.style.color = 'green';

            localStorage.setItem('userID', data.userID);
            localStorage.setItem('username', data.username);

            window.location.href = 'cuentaExistente.html';
        } else {
            messageElement.textContent = `Error: ${data.error}`;
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error en la conexion', error);
        messageElement.textContent = 'Error conectando con el servidor.';
        messageElement.style.color = 'red';
    }
});