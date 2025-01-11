import { Sesion } from './Sesion.js';
import { Usuario } from './Usuario.js';

// Instancia de sesión (singleton)
const sesion = new Sesion();

// Referencias del DOM
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('login-form');

// Función de validación básica
function validarFormulario(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert('Correo electrónico no válido');
        return false;
    }
    // Validar contraseña aquí si es necesario
    alert("Correo valido")
    return true;
}

// Manejo de envío de formulario
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar el envío del formulario

    const email = emailInput.value;
    const password = passwordInput.value;

    if (validarFormulario(email)) {
        // Intentar iniciar sesión
        usr = new Usuario(email,password)
        const loginExitoso = sesion.iniciarSesion(usr);
        alert("Logeo exitoso")
        if (loginExitoso) {
            alert('Login exitoso');
            window.location.href = 'index.html';  // Redirigir al inicio si el login es exitoso
        } else {
            alert('Correo o contraseña incorrectos');
        }
    }
});
