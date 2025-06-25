// main.js

// === LECCIÓN 1: OBJETOS Y ARRAYS ===
// 1. Historial de conversaciones (array de objetos mensaje)
let chatHistory = [];
// 2. Modela los mensajes como objetos JS (se usará una clase para esto, que cubre prototipos/clases)

// Referencias a elementos del DOM
const chatMessagesContainer = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const uiStatusDiv = document.getElementById('ui-status');
const loadingOldMessagesDiv = document.getElementById('loading-old-messages');

// === LECCIÓN 3: PROTOTIPOS, CLASES Y MODULARIDAD ===
// 1. Crea una clase ChatMessage que modele un mensaje
class ChatMessage { 
    constructor(author, content, timestamp = new Date()) {
        this.author = author;     // Autor del mensaje (ej: 'user', 'ai')
        this.content = content;   // Contenido del mensaje
        this.timestamp = timestamp; // Fecha y hora del mensaje
    }

    // Método para formatear el mensaje para mostrarlo bonito en el DOM
    formatear() {
        const messageDiv = document.createElement('div');
        // Usamos clases de Tailwind para estilizar el mensaje
        messageDiv.className = `p-3 rounded-xl max-w-[80%] break-words shadow-sm transition-all duration-300 ease-in-out ${
            this.author === 'user' ? 'user-message self-end ml-auto' : 'ai-message self-start mr-auto'
        }`;

        const contentParagraph = document.createElement('p');
        contentParagraph.textContent = this.content;
        contentParagraph.className = 'text-base';

        const timeSpan = document.createElement('span');
        timeSpan.textContent = this.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSpan.className = `text-xs mt-1 block ${
            this.author === 'user' ? 'text-blue-100' : 'text-gray-500'
        }`;

        messageDiv.appendChild(contentParagraph);
        messageDiv.appendChild(timeSpan);
        return messageDiv;
    }
}

// === LECCIÓN 2: HOISTING, SCOPE, CLOSURES, CALLBACKS ===

// 2. Closure para contar cuántas preguntas ha hecho el usuario
const createUserQuestionCounter = () => {
    let questionCount = 0; // Esta variable está en el closure
    return () => {
        questionCount++;
        console.log(`El usuario ha hecho ${questionCount} pregunta(s).`);
        return questionCount;
    };
};
const countUserQuestion = createUserQuestionCounter(); // Esta función "recuerda" questionCount

// 3. Implementa un callback que se ejecute al recibir respuesta de la API
//    (antes de mostrarla en el DOM).
const preRenderCallback = (responseContent) => {
    console.log("CALLBACK: Respuesta de la IA recibida y pre-procesada:", responseContent.substring(0, 50) + "...");
    // Aquí podrías, por ejemplo, filtrar malas palabras, o analizar el sentimiento antes de mostrarlo.
    // Para este ejemplo, solo lo logueamos.
};

// === MODULARIDAD: Funciones Separadas ===

// Función para actualizar el estado de la UI (cargando, error)
const updateUIState = (message = '', type = 'info') => {
    uiStatusDiv.textContent = message;
    // Clases de Tailwind para diferentes estados
    uiStatusDiv.className = `text-center mt-2 p-2 rounded-lg ${
        type === 'error' ? 'bg-red-100 text-red-700' : type === 'loading' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
    }`;
    uiStatusDiv.style.display = message ? 'block' : 'none'; // Ocultar si no hay mensaje
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll al final
};

// 3. Renderiza los mensajes en el DOM usando .forEach() sobre el array de objetos.
const renderChatHistory = () => {
    chatMessagesContainer.innerHTML = ''; // Limpiar el contenedor actual
    chatHistory.forEach(message => {
        chatMessagesContainer.appendChild(message.formatear());
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Auto-scroll al final
};

// 4. Consumo de la API de OpenAI (usando Gemini 2.0 Flash como sustituto)
const callOpenAIAPI = async (prompt) => {
    updateUIState('Conectando con la IA...', 'loading');
    // const apiKey = "YOUR_API_KEY_HERE"; // En el entorno de Canvas, __api_key se proporciona automáticamente.
    const apiKey = ""; // Dejar vacío para que Canvas inyecte la clave.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    let chatHistoryForAPI = [];
    chatHistoryForAPI.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
        contents: chatHistoryForAPI,
        generationConfig: {
            // Puedes ajustar parámetros como la temperatura (creatividad) o top_p aquí
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 200 // Limita la longitud de la respuesta
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Error de la API: ${response.status} - ${errorBody.error?.message || response.statusText}`);
        }

        const result = await response.json();
        updateUIState(''); // Limpiar el estado de carga

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            return text;
        } else {
            throw new Error("Respuesta de la IA inesperada o vacía.");
        }
    } catch (error) {
        console.error("Error al llamar a la API:", error);
        updateUIState(`Error de conexión: ${error.message}. Intenta de nuevo.`, 'error');
        return "Lo siento, hubo un problema al conectar con la IA. Por favor, inténtalo de nuevo.";
    }
};

// Agrega una función de autocompletado usando setTimeout() para simular procesamiento AI (como typing delay).
const simulateTypingDelay = (messageContent) => {
    let tempMessageDiv = document.createElement('div');
    tempMessageDiv.className = `ai-message p-3 rounded-xl max-w-[80%] break-words shadow-sm self-start mr-auto`;
    tempMessageDiv.innerHTML = '<span class="typing-indicator">...</span>'; // Indicador de escritura
    chatMessagesContainer.appendChild(tempMessageDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    return new Promise(resolve => {
        let currentText = '';
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < messageContent.length) {
                currentText += messageContent.charAt(i);
                tempMessageDiv.querySelector('.typing-indicator').textContent = currentText + '|'; // Simular cursor
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                i++;
            } else {
                clearInterval(typeInterval);
                tempMessageDiv.querySelector('.typing-indicator').textContent = currentText; // Eliminar cursor al terminar
                resolve(tempMessageDiv); // Resuelve la promesa con el div del mensaje finalizado
            }
        }, 50); // Velocidad de escritura
    });
};


// Función principal para enviar un mensaje
const sendMessage = async () => {
    const userText = userInput.value.trim();
    if (userText === '') return; // No enviar mensajes vacíos

    updateUIState(''); // Limpiar cualquier mensaje de estado anterior
    userInput.value = ''; // Limpiar el input

    // Crear mensaje del usuario y añadirlo al historial
    const userMessage = new ChatMessage('user', userText);
    chatHistory.push(userMessage);
    renderChatHistory(); // Renderizar el historial actualizado

    countUserQuestion(); // Llamar al closure para contar preguntas

    try {
        // Simular un typing delay inicial antes de la respuesta real de la IA
        updateUIState('IA está escribiendo...', 'loading');
        // No necesitamos esperar un tiempo fijo aquí, el delay viene de la simulación de escritura
        // Esto solo es para el mensaje de estado
        await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa antes de llamar a la API

        const aiResponseContent = await callOpenAIAPI(userText);

        // Ejecutar el callback antes de añadir el mensaje de la IA al historial y renderizar
        preRenderCallback(aiResponseContent);

        // Simular el typing delay para la respuesta de la IA
        await simulateTypingDelay(aiResponseContent);

        // Crear mensaje de la IA y añadirlo al historial
        const aiMessage = new ChatMessage('ai', aiResponseContent);
        chatHistory.push(aiMessage);
        // Volver a renderizar para asegurar que el mensaje simulado sea reemplazado por el real y correcto en el historial
        renderChatHistory();

    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        updateUIState(`Error al procesar tu mensaje: ${error.message}`, 'error');
        // Añadir un mensaje de error al historial si la API falla
        chatHistory.push(new ChatMessage('ai', 'Lo siento, no pude procesar tu solicitud en este momento.'));
        renderChatHistory();
    } finally {
        updateUIState(''); // Limpiar cualquier mensaje de estado
    }
};

// === LECCIÓN 2: HOISTING ===
// 1. Demuestra un caso de hoisting, usando una función declarada antes de ser definida.
// La función `setupEventListeners` es llamada por `initApp` (abajo) antes de su definición.
// JavaScript "hoistea" las declaraciones de funciones completas al inicio de su scope.
function setupEventListeners() {
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// === LECCIÓN 3: PROMESAS Y ASYNC/AWAIT ===
// Agrega una promesa falsa para simular la carga de mensajes antiguos antes de iniciar el chat (delay artificial).
const simulateOldMessagesLoad = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Ejemplo de mensajes antiguos
            const oldMessages = [
                new ChatMessage('ai', '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?', new Date(Date.now() - 3600 * 1000)),
                new ChatMessage('user', 'Hola, ¿cómo estás?', new Date(Date.now() - 3500 * 1000))
            ];
            chatHistory.push(...oldMessages); // Añadir al historial
            resolve();
        }, 2000); // Simula 2 segundos de carga
    });
};

// Función de inicialización de la aplicación
const initApp = async () => {
    // Escondemos el status inicial mientras cargamos los mensajes
    updateUIState('Iniciando chat...', 'loading');
    loadingOldMessagesDiv.style.display = 'block'; // Mostrar mensaje de carga específica

    await simulateOldMessagesLoad(); // Esperar a que se carguen los mensajes antiguos

    loadingOldMessagesDiv.style.display = 'none'; // Ocultar mensaje de carga específica
    updateUIState(''); // Limpiar el estado de inicio
    renderChatHistory(); // Renderizar los mensajes (incluyendo los "antiguos" simulados)

    // Configurar los event listeners después de que el DOM esté listo y los mensajes cargados
    setupEventListeners();
    userInput.focus(); // Poner el foco en el input al iniciar
};

// Iniciar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initApp);
