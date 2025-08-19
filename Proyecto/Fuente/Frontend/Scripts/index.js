import { Usuario } from './Clases/Usuario.js';
import { Sesion } from './Clases/Sesion.js';
import { API_BASE_URL } from './utils.js';

const sesion = new Sesion();

// DOM References
const elements = {
    userPhoto: document.getElementById('user-photo'),
    userEmail: document.getElementById('user-email'),
    userButtonContainer: document.getElementById('user-button-container'),
    chatContainer: document.getElementById('chat-container'),
    promptInput: document.getElementById('prompt'),
    sendButton: document.getElementById('send-button'),
    menuButton: document.getElementById('menu-button'),
    menuDropdown: document.getElementById('menu-dropdown')
};

function actualizarSesion() {
    elements.userButtonContainer.innerHTML = '';
    
    if (sesion.estaLogeado()) {
        const usuario = sesion.obtenerUsuario();
        elements.userEmail.textContent = usuario.email;
        
        // User photo
        const photoElement = `<div id="user-photo" style="background-image: url('${usuario.foto}'); background-size: cover; width: 50px; height: 50px; border-radius: 50%;"></div>`;
        elements.userButtonContainer.innerHTML = photoElement;
        
        // Logout button
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Cerrar sesión';
        logoutButton.onclick = () => {
            sesion.cerrarSesion();
            window.location.reload();
        };
        elements.userButtonContainer.appendChild(logoutButton);
    } else {
        const loginButton = document.createElement('button');
        loginButton.textContent = 'Iniciar sesión';
        loginButton.onclick = () => {
            fetch('/login/')
                .then(response => response.json())
                .then(data => window.location.href = data.url)
                .catch(console.error);
        };
        elements.userButtonContainer.appendChild(loginButton);
    }
}

function crearElementoMensaje(nombre, mensaje, tipo) {
    const template = `
        <div class="mensaje ${tipo}">
            <div class="message-header">
                <div class="avatar-container">
                    <div class="avatar"></div>
                    <div class="message-name">${nombre}</div>
                </div>
            </div>
            <div class="message-content">
                <div class="message-text">${mensaje}</div>
            </div>
        </div>
    `;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;
    return wrapper.firstElementChild;
}

function agregarMensaje(nombre, mensaje, tipo) {
    const mensajeElemento = crearElementoMensaje(nombre, mensaje, tipo);
    elements.chatContainer.appendChild(mensajeElemento);
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
}

async function enviarMensajeAlServidor(nombre, mensaje) {
    try {
        const response = await fetch(`${API_BASE_URL}/mensaje`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, mensaje })
        });
        return await response.json();
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        return null;
    }
}

function handleMensajeEnvio(mensaje) {
    if (!mensaje) return;
    
    agregarMensaje('Usuario', mensaje, 'user');
    elements.promptInput.value = '';
    
    setTimeout(async () => {
        const respuesta = await enviarMensajeAlServidor('Usuario', mensaje);
        agregarMensaje('Ai-chan', respuesta || 'Error en la respuesta', 'ai-chan');
    }, 500);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', actualizarSesion);
elements.menuButton.onclick = () => elements.menuDropdown.classList.toggle('show');
elements.sendButton.onclick = () => handleMensajeEnvio(elements.promptInput.value);
elements.promptInput.onkeydown = (e) => e.key === 'Enter' && handleMensajeEnvio(e.target.value);
