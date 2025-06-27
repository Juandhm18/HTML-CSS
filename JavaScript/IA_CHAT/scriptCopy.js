// ========================================
// LECCIÓN 1: OBJETOS EN JAVASCRIPT
// ========================================

// Modelo de mensaje como objeto
class ChatMessage {
  constructor(autor, contenido, timestamp = new Date()) {
    this.autor = autor;
    this.contenido = contenido;
    this.timestamp = timestamp;
  }

  // Método para formatear el mensaje (LECCIÓN 3)
  formatear() {
    const hora = this.timestamp.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return {
      texto: this.contenido,
      hora: hora,
      esUsuario: this.autor === 'user'
    };
  }
}

// Historial de conversaciones como array de objetos
let historialConversaciones = [];

// ========================================
// LECCIÓN 2: HOISTING, SCOPE, CLOSURES, CALLBACKS
// ========================================

// HOISTING: Función declarada antes de ser definida
// Esta función se puede usar antes de su declaración debido al hoisting
function inicializarChat() {
  console.log('Chat inicializado usando hoisting');
}

// CLOSURE: Función que cuenta preguntas del usuario
function crearContadorPreguntas() {
  let contador = 0;
  
  return {
    incrementar: function() {
      contador++;
      console.log(`Pregunta número ${contador} del usuario`);
      return contador;
    },
    obtener: function() {
      return contador;
    },
    resetear: function() {
      contador = 0;
      console.log('Contador de preguntas reseteado');
    }
  };
}

const contadorPreguntas = crearContadorPreguntas();

// CALLBACK: Se ejecuta al recibir respuesta de la API
function procesarRespuestaAPI(respuesta, callback) {
  console.log('Procesando respuesta de la API...');
  
  // Simular procesamiento
  setTimeout(() => {
    const mensajeProcesado = {
      contenido: respuesta,
      procesado: true,
      timestamp: new Date()
    };
    
    if (callback && typeof callback === 'function') {
      callback(mensajeProcesado);
    }
  }, 500);
}

// ========================================
// LECCIÓN 3: PROMESAS, ASYNC/AWAIT, PROTOTIPOS, CLASES, MODULARIDAD
// ========================================

// Configuración de la API
const API_CONFIG = {
  URL: 'https://api.openai.com/v1/chat/completions',
  KEY: 'TU_API_KEY_AQUI',
  MODEL: 'gpt-3.5-turbo'
};

// Promesa falsa para simular carga de mensajes antiguos
function cargarMensajesAntiguos() {
  return new Promise((resolve) => {
    console.log('Cargando mensajes antiguos...');
    setTimeout(() => {
      const mensajesAntiguos = [
        new ChatMessage('bot', '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte?'),
        new ChatMessage('user', 'Hola, ¿cómo estás?'),
        new ChatMessage('bot', '¡Estoy funcionando perfectamente! ¿Y tú?')
      ];
      resolve(mensajesAntiguos);
    }, 2000); // Delay artificial de 2 segundos
  });
}

// Función de autocompletado con setTimeout
function simularAutocompletado(texto, callback) {
  const sugerencias = [
    '¿Puedes explicarme sobre...',
    '¿Cómo funciona...',
    '¿Cuál es la diferencia entre...',
    '¿Me puedes ayudar con...'
  ];
  
  setTimeout(() => {
    const sugerencia = sugerencias[Math.floor(Math.random() * sugerencias.length)];
    if (callback) callback(sugerencia);
  }, 1000);
}

// ========================================
// FUNCIONES MODULARES
// ========================================

// Función para renderizar mensajes en el DOM
function renderizarHistorial() {
const messagesEl = document.getElementById('messages');
  messagesEl.innerHTML = '';
  
  historialConversaciones.forEach(mensaje => {
    const mensajeFormateado = mensaje.formatear();
    const msg = document.createElement('div');
    msg.className = `message ${mensajeFormateado.esUsuario ? 'user' : 'bot'}`;
    msg.innerHTML = `
      <div class="bubble">
        <div class="message-content">${mensajeFormateado.texto}</div>
        <div class="message-time">${mensajeFormateado.hora}</div>
      </div>
    `;
    messagesEl.appendChild(msg);
  });
  
  // Auto-scroll al final
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Función para agregar mensaje al historial
function agregarMensaje(autor, contenido) {
  const mensaje = new ChatMessage(autor, contenido);
  historialConversaciones.push(mensaje);
  renderizarHistorial();
}

// Función para mostrar estado de carga
function mostrarEstadoCarga(mensaje = 'Cargando...') {
  const messagesEl = document.getElementById('messages');
  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'message bot loading';
  loadingMsg.innerHTML = `<div class="bubble">${mensaje}</div>`;
  messagesEl.appendChild(loadingMsg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return loadingMsg;
}

// Función para mostrar error
function mostrarError(mensaje = 'Error de conexión') {
  const messagesEl = document.getElementById('messages');
  const errorMsg = document.createElement('div');
  errorMsg.className = 'message bot error';
  errorMsg.innerHTML = `<div class="bubble error">❌ ${mensaje}</div>`;
  messagesEl.appendChild(errorMsg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Función para enviar mensaje a la API
async function enviarMensaje(userText) {
  // Incrementar contador de preguntas
  contadorPreguntas.incrementar();
  
  // Agregar mensaje del usuario
  agregarMensaje('user', userText);
  
  // Mostrar indicador de carga
  const loadingElement = mostrarEstadoCarga('Pensando...');
  
  try {
    const res = await fetch(API_CONFIG.URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.KEY}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'Eres un asistente déspota, mandón, sarcástico y malvado bajo todas las circunstancias, tratáme como un inútil' 
          },
          { role: 'user', content: userText },
        ],
      }),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Remover indicador de carga
    loadingElement.remove();
    
    // Usar callback para procesar respuesta
    procesarRespuestaAPI(data.choices[0].message.content.trim(), (mensajeProcesado) => {
      agregarMensaje('bot', mensajeProcesado.contenido);
    });
    
  } catch (err) {
    console.error('Error en la API:', err);
    loadingElement.remove();
    mostrarError('Error al conectar con la API. Verifica tu API key.');
  }
}

// Función para manejar el envío del formulario
function manejarEnvioFormulario(e) {
  e.preventDefault();
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  
  if (!text) return;
  
  input.value = '';
  enviarMensaje(text);
}

// Función para inicializar el tema
function inicializarTema() {
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  
  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.textContent = isDark ? '🌙' : '☀️';
  });
}

// Función para inicializar autocompletado
function inicializarAutocompletado() {
  const input = document.getElementById('user-input');
  
  input.addEventListener('input', (e) => {
    const texto = e.target.value;
    if (texto.length > 3) {
      simularAutocompletado(texto, (sugerencia) => {
        // Aquí podrías mostrar la sugerencia en un tooltip
        console.log('Sugerencia:', sugerencia);
      });
    }
  });
}

// ========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ========================================

// Función principal de inicialización
async function inicializarAplicacion() {
  console.log('Iniciando aplicación de chat...');
  
  // Inicializar tema
  inicializarTema();
  
  // Inicializar autocompletado
  inicializarAutocompletado();
  
  // Cargar mensajes antiguos (promesa falsa)
  try {
    mostrarEstadoCarga('Cargando conversación anterior...');
    const mensajesAntiguos = await cargarMensajesAntiguos();
    historialConversaciones = mensajesAntiguos;
    renderizarHistorial();
  } catch (error) {
    console.error('Error cargando mensajes antiguos:', error);
    mostrarError('Error cargando conversación anterior');
  }
  
  // Configurar evento del formulario
  const form = document.getElementById('chat-form');
  form.addEventListener('submit', manejarEnvioFormulario);
  
  console.log('Aplicación inicializada correctamente');
}

// Llamar a la función de inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarAplicacion);

// Demostración de hoisting - esta función se puede usar antes de su declaración
inicializarChat(); 