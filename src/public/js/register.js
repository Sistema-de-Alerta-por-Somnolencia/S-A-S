document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Asegúrate de crear este elemento en tu HTML
    const messageElement = document.getElementById('responseMessage');

    // Extraemos los valores usando los IDs reales de tu newCuenta.html
    const name = document.getElementById('firstname-input').value;
    const lastname = document.getElementById('lastname-input').value; // Falta crearlo en el HTML
    const email = document.getElementById('email-input').value;

    // Corregí el cruce de nombres basado en tu HTML actual
    const password = document.getElementById('password-input-again').value;
    const passwordAgain = document.getElementById('password-input').value;

    // Validación simplificada
    if (password !== passwordAgain) {
        alert('Las contraseñas no son iguales.');
        return; // Detiene el envío
    }

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, lastname: lastname, email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = `Éxito: ${data.message}`;
            messageElement.style.color = 'green';

            localStorage.setItem('userID', data.userID);
            localStorage.setItem('username', data.username);

            // Te sugiero corregir el nombre del archivo si es necesario, 
            // en tu HTML mencionaste "cuentaExistente.html" sin el guión bajo
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