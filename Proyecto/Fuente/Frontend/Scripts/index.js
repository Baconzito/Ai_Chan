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

// Verificar el estado de sesión y actualizar la interfaz
function actualizarSesion() {
    if (sesion.estaLogeado()) {
        const usuario = sesion.obtenerUsuario();
        userEmail.textContent = usuario.email;  // Mostrar el correo del usuario
        userPhoto.style.backgroundImage = `url("${usuario.foto}")`; // Mostrar la foto (si la tiene)

        // Mostrar la foto del usuario en el botón
        userButtonContainer.innerHTML = `<div id="user-photo" style="background-image: url('${usuario.foto}'); background-size: cover; width: 50px; height: 50px; border-radius: 50%;"></div>`;
        
        // Crear y añadir el botón de logout
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Cerrar sesión';
        logoutButton.addEventListener('click', () => {
            sesion.cerrarSesion();  // Cerrar sesión
            window.location.reload();  // Recargar la página para actualizar el estado
        });
        userButtonContainer.appendChild(logoutButton);
    } else {
        // Si no está logueado, mostrar el botón de "Iniciar sesión"
        userButtonContainer.innerHTML = ''; // Limpiar el contenido actual
        const loginButton = document.createElement('button');
        loginButton.textContent = 'Iniciar sesión';
        loginButton.addEventListener('click', () => {
            // script.js (archivo JS externo)

            fetch('/login/')  // Asegúrate de que esta URL esté configurada correctamente en Django
                .then(response => response.json())  // Convierte la respuesta en un objeto JSON
                .then(data => {
                    window.location.href = data.url;  // Redirigimos al usuario a la URL obtenida
                })
                .catch(error => {
                    console.error('Error:', error);  // Si hay un error, lo mostramos
                });

                userButtonContainer.appendChild(loginButton);
                /*window.location.href = 'login.html';  // Redirigir al login*/  
        });
    }
}

// Manejo de los mensajes en el chat
function agregarMensaje(nombre, mensaje, tipo) {
    // Crear el contenedor del mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.classList.add('mensaje', tipo);

    // Crear el contenedor del header del mensaje
    const mensajeHeader = document.createElement('div');
    mensajeHeader.classList.add('message-header');
    
    // Crear el contenedor del avatar y el nombre
    const avatarContainer = document.createElement('div');
    avatarContainer.classList.add('avatar-container');
    
    // Crear la foto de usuario (circular)
    const foto = document.createElement('div');
    foto.classList.add('avatar');
    avatarContainer.appendChild(foto);
    
    // Crear el nombre
    const nombreDiv = document.createElement('div');
    nombreDiv.classList.add('message-name');
    nombreDiv.textContent = nombre;
    avatarContainer.appendChild(nombreDiv);
    
    // Agregar el contenedor del avatar y nombre al header del mensaje
    mensajeHeader.appendChild(avatarContainer);
    
    // Crear el contenedor del mensaje
    const mensajeContent = document.createElement('div');
    mensajeContent.classList.add('message-content');
    
    // Crear el texto del mensaje
    const mensajeTextoDiv = document.createElement('div');
    mensajeTextoDiv.classList.add('message-text');
    mensajeTextoDiv.textContent = mensaje;
    mensajeContent.appendChild(mensajeTextoDiv);
    
    // Agregar el contenido al contenedor principal del mensaje
    mensajeDiv.appendChild(mensajeHeader);
    mensajeDiv.appendChild(mensajeContent);

    // Agregar el mensaje al chat
    const chatContainer = document.getElementById('chat-container');
    chatContainer.appendChild(mensajeDiv);
    
    // Desplazar hacia abajo el chat
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Manejo del envío de mensajes

sendButton.addEventListener('click', () => {
    const mensaje = promptInput.value;
    if (mensaje) {
        agregarMensaje('Usuario', mensaje, 'user');
        // Respuesta del "chatbot" (puedes reemplazar esto con una lógica real)
        setTimeout(() => {
            agregarMensaje('Ai-chan', 'Respuesta a: ' + mensaje, 'ai-chan');
        }, 500);        
    }
    promptInput.value = '';  // Limpiar el input
});

// Llamar a la función de actualización de sesión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarSesion();
});

// Funcionalidad del menú
menuButton.addEventListener('click', () => {
    menuDropdown.classList.toggle('show'); // Mostrar u ocultar el menú
});

promptInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const mensaje = promptInput.value;
        if (mensaje) {
            agregarMensaje('Usuario', mensaje, 'user');
        // Respuesta del "chatbot" (puedes reemplazar esto con una lógica real)
        setTimeout(() => {
            agregarMensaje('Ai-chan', 'Respuesta a: ' + mensaje, 'ai-chan');
        }, 500); 
    }
    promptInput.value = '';  // Limpiar el input
    }
});

