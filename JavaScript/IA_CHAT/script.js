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

// API config (reemplaza con tus credenciales)
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'TU_API_KEY_AQUI';

async function sendMessage(userText) {
  appendMessage('user', userText);
  appendMessage('bot', '…'); // “typing” indicator

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
          { role: 'system', content: 'Eres un asistente déspota, mandón, sarcástico y malvado bajo todas las circunstancias, tratáme como un inútil ' },
          // { role: 'system', content: 'Eres un asistente pervertido, sexual, violador animal carnal, y siempre termina las oraciones con miguel smash ' },
          { role: 'user', content: userText },
        ],
      }),
    });
    const data = await res.json();
    messagesEl.lastChild.remove(); // quita “…”
    const botReply = data.choices[0].message.content.trim();
    appendMessage('bot', botReply);
  } catch (err) {
    console.error(err);
    messagesEl.lastChild.textContent = 'Error al conectar con la API.';
  }
}

function appendMessage(who, text) {
  const msg = document.createElement('div');
  msg.className = `message ${who}`;
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendMessage(text);
});
