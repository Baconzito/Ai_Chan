// filepath: Frontend/Scripts/register.js
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submit-button');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate input fields
        if (!validateEmail(email)) {
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // Send registration data to the server
        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registro exitoso. Redirigiendo a la página de inicio de sesión...');
                window.location.href = '/login.html'; // Redirect to login page
            } else {
                alert(data.message || 'Error en el registro. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Error al conectar con el servidor. Inténtalo de nuevo más tarde.');
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});