// Importa las funciones de Firebase que necesitas
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Obtén una instancia del servicio de autenticación
const auth = getAuth();

// Obtén una instancia de la base de datos
const db = getDatabase();

// Referencia a la lista de mensajes en la base de datos
const messagesRef = ref(db, 'messages');

// Elementos del DOM
const loggedInUserDisplay = document.getElementById("loggedInUser");
const logoutBtn = document.getElementById("logoutBtn");
const messageText = document.getElementById("messageText");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const chatMessages = document.getElementById("chatMessages");

let currentUser = null;

// Función para mostrar mensajes
function displayMessage(name, text) {
    const messageElement = document.createElement("div");
    messageElement.innerText = `${name}: ${text}`;
    chatMessages.appendChild(messageElement);
}

// Función para enviar un mensaje
function sendMessage() {
    const text = messageText.value.trim();
    if (text === "") return;

    const user = currentUser.displayName || "Anónimo";
    const messageData = {
        name: user,
        text: text,
        timestamp: Date.now()
    };

    push(messagesRef, messageData);

    messageText.value = "";
}

// Función para cerrar sesión
function logout() {
    signOut(auth);
}

// Observador de cambios en la autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loggedInUserDisplay.textContent = currentUser.displayName || currentUser.email;
    } else {
        currentUser = null;
        loggedInUserDisplay.textContent = "No hay usuario conectado";
    }
});

// Escucha cambios en la base de datos para mostrar mensajes
onValue(messagesRef, (snapshot) => {
    chatMessages.innerHTML = "";
    const messages = snapshot.val();
    for (const key in messages) {
        if (Object.hasOwnProperty.call(messages, key)) {
            const message = messages[key];
            displayMessage(message.name, message.text);
        }
    }
});

// Agregar eventos
sendMessageBtn.addEventListener("click", sendMessage);
logoutBtn.addEventListener("click", logout);