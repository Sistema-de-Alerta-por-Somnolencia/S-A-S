document.getElementById("login-form").addEventListener('submit', async function (event) {
    event.preventDefault();

    const messageElement = document.getElementById('responseMessage');

    // con value sacamos el valor que contiene
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem('userID', data.userID);
            localStorage.setItem('username', data.username);

            window.location.href = 'principal.html';
        } else {
            messageElement.textContent = `Error: ${data.error}`;
            messageElement.style.color = 'red';
        }
    }
    catch (error) {
        console.error('Error en la conexion', error);
        messageElement.textContent = 'Error conectando con el servidor.';
        messageElement.style.color = 'red';
    }
});