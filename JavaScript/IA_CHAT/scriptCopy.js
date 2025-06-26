// app.js
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const messagesEl = document.getElementById('messages');
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Dark mode toggle
themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
});
// API config
const API_URL = 'https://api.openai.com/v1/chat/completions';
// const API_KEY = 'TU_API_KEY_AQUI';
// Lección 1 y 3: Clase ChatMessage
class ChatMessage {
  constructor(autor, contenido) {
    this.autor = autor;
    this.contenido = contenido;
    this.timestamp = new Date().toLocaleTimeString();
  }

  formatear() {
    return `[${this.timestamp}] ${this.autor.toUpperCase()}: ${this.contenido}`;
  }
}
// Historial de mensajes
const historialMensajes = [];

// Renderizar historial
function renderizarHistorial() {
  messagesEl.innerHTML = '';
  historialMensajes.forEach(msg => {
    appendMessage(msg.autor, msg.formatear());
  });
}

// Closure para contar preguntas
const contadorPreguntas = (() => {
  let count = 0;
  return () => ++count;
})();

// Callback para respuesta API
function onApiResponse(respuesta, callback) {
  callback(respuesta);
}

// Simula carga artificial de mensajes antiguos
function cargarMensajesAnteriores() {
  return new Promise(resolve => {
    appendMessage('bot', 'Cargando mensajes anteriores...');
    setTimeout(() => {
      historialMensajes.push(new ChatMessage('bot', '¡Bienvenido de vuelta!'));
      renderizarHistorial();
      resolve();
    }, 1500);
  });
}

// Simula "autocompletado"
function simularAutocompletado(texto, callback) {
  appendMessage('bot', 'Escribiendo...');
  setTimeout(() => {
    messagesEl.lastChild.remove();
    callback(texto);
  }, 1000);
}

// Enviar mensaje usando async/await
async function enviarMensaje(textoUsuario) {
  const mensajeUsuario = new ChatMessage('user', textoUsuario);
  historialMensajes.push(mensajeUsuario);
  appendMessage('user', mensajeUsuario.formatear());

  appendMessage('bot', '…'); // Indicador "typing"

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un asistente útil y sarcástico que responde con humor' },
          { role: 'user', content: textoUsuario },
        ],
      }),
    });

    const data = await res.json();
    messagesEl.lastChild.remove(); // Quita “…”

    const contenidoBot = data.choices[0].message.content.trim();
    const mensajeBot = new ChatMessage('bot', contenidoBot);
    historialMensajes.push(mensajeBot);

    onApiResponse(mensajeBot, (msg) => {
      appendMessage('bot', msg.formatear());
    });

  } catch (error) {
    console.error(error);
    messagesEl.lastChild.textContent = 'Error al conectar con la API.';
  }
}

// Añadir mensaje al DOM
function appendMessage(who, text) {
  const msg = document.createElement('div');
  msg.className = `message ${who}`;
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Ejemplo de Hoisting
hoistedFunc();
function hoistedFunc() {
  console.log('Esta función fue llamada antes de definirse gracias al hoisting');
}

// Captura de formulario
form.addEventListener('submit', async e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  contadorPreguntas();
  await enviarMensaje(text);
});

// Al cargar la página
window.addEventListener('DOMContentLoaded', async () => {
  await cargarMensajesAnteriores();
});

