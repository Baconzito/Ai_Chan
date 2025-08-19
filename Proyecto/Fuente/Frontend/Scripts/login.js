
import { Sesion } from './Clases/Sesion.js';
import { Usuario } from './Clases/Usuario.js';
import { validateEmail, showAlert } from './utils.js';

const sesion = new Sesion();
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validateEmail(email)) {
        showAlert('Correo electrónico no válido');
        return;
    }

    const usuario = new Usuario(email, password);
    const loginExitoso = sesion.iniciarSesion(usuario);
    
    if (loginExitoso) {
        window.location.href = 'index.html';
    } else {
        showAlert('Correo o contraseña incorrectos');
    }
});