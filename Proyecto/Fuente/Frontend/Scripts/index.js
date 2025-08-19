import { Usuario } from './Clases/Usuario.js';
import { Sesion } from './Clases/Sesion.js';

// Instancia de sesión (singleton)
const sesion = new Sesion();

// Referencias del DOM
const userPhoto = document.getElementById('user-photo');
const userEmail = document.getElementById('user-email');
const userButtonContainer = document.getElementById('user-button-container');
const chatContainer = document.getElementById('chat-container');
const promptInput = document.getElementById('prompt');
const sendButton = document.getElementById('send-button');
const menuButton = document.getElementById('menu-button');
const menuDropdown = document.getElementById('menu-dropdown');
const mainContent = document.getElementById('main-content');
const logoutBtn = document.getElementById('logout-btn');

// Funciones de manejo de sesión
function actualizarSesion() {
    if (sesion.estaLogeado()) {
        mostrarUsuarioLogeado();
    } else {
        mostrarBotonLogin();
    }
}

function mostrarUsuarioLogeado() {
    const usuario = sesion.obtenerUsuario();
    userEmail.textContent = usuario.email;
    userPhoto.style.backgroundImage = `url("${usuario.foto}")`;
    userButtonContainer.innerHTML = `
        <div id="user-photo" style="background-image: url('${usuario.foto}'); background-size: cover; width: 50px; height: 50px; border-radius: 50%;"></div>
    `;
    agregarBotonLogout();
}

function mostrarBotonLogin() {
    userButtonContainer.innerHTML = '';
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Iniciar sesión';
    loginButton.addEventListener('click', redirigirLogin);
    userButtonContainer.appendChild(loginButton);
}

function redirigirLogin() {
    fetch('/login/')
        .then(response => response.json())
        .then(data => window.location.href = data.url)
        .catch(error => console.error('Error:', error));
}

function agregarBotonLogout() {
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Cerrar sesión';
    logoutButton.addEventListener('click', () => {
        sesion.cerrarSesion();
        window.location.reload();
    });
    userButtonContainer.appendChild(logoutButton);
}

// Funciones de manejo de mensajes
function crearElementoMensaje(nombre, mensaje, tipo) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.classList.add('mensaje', tipo);

    const mensajeHeader = document.createElement('div');
    mensajeHeader.classList.add('message-header');

    const avatarContainer = document.createElement('div');
    avatarContainer.classList.add('avatar-container');

    const foto = document.createElement('div');
    foto.classList.add('avatar');
    avatarContainer.appendChild(foto);

    const nombreDiv = document.createElement('div');
    nombreDiv.classList.add('message-name');
    nombreDiv.textContent = nombre;
    avatarContainer.appendChild(nombreDiv);

    mensajeHeader.appendChild(avatarContainer);

    const mensajeContent = document.createElement('div');
    mensajeContent.classList.add('message-content');

    const mensajeTextoDiv = document.createElement('div');
    mensajeTextoDiv.classList.add('message-text');
    mensajeTextoDiv.textContent = mensaje;
    mensajeContent.appendChild(mensajeTextoDiv);

    mensajeDiv.appendChild(mensajeHeader);
    mensajeDiv.appendChild(mensajeContent);

    return mensajeDiv;
}

function agregarMensaje(nombre, mensaje, tipo) {
    const mensajeElemento = crearElementoMensaje(nombre, mensaje, tipo);
    chatContainer.appendChild(mensajeElemento);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function enviarMensajeAlServidor(nombre, mensaje) {
    try {
        const response = await fetch('http://localhost:8000/api/mensaje', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, mensaje })
        });
        return await response.json();
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

function procesarMensaje() {
    const mensaje = promptInput.value;
    if (mensaje) {
        agregarMensaje('Usuario', mensaje, 'user');
        setTimeout(async () => {
            const respuesta = await enviarMensajeAlServidor('Usuario', mensaje);
            agregarMensaje('Ai-chan', respuesta, 'ai-chan');
        }, 500);
        promptInput.value = '';
    }
}

// Event Listeners
menuButton.addEventListener('click', function(e) {
    e.stopPropagation();
    menuDropdown.classList.toggle('show');
    mainContent.classList.toggle('menu-open');
});

document.addEventListener('click', function(event) {
    if (!menuDropdown.contains(event.target) && !menuButton.contains(event.target)) {
        menuDropdown.classList.remove('show');
        mainContent.classList.remove('menu-open');
    }
});

logoutBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
});

sendButton.addEventListener('click', procesarMensaje);

promptInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        procesarMensaje();
    }
});

document.addEventListener('DOMContentLoaded', actualizarSesion);

