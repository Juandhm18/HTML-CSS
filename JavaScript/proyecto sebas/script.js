// Ticket 1: Botón de saludo condicional
function getGreeting(hour) {
    if (hour >= 6 && hour < 12) {
        return '¡Buenos días!';
    } else if (hour >= 12 && hour < 19) {
        return '¡Buenas tardes!';
    } else {
        return '¡Buenas noches!';
    }
}

document.getElementById('greetBtn').addEventListener('click', function() {
    const hourInput = document.getElementById('hourInput').value;
    const hour = Number(hourInput);
    const msgSpan = document.getElementById('greetMsg');
    if (hourInput === '' || isNaN(hour) || hour < 0 || hour > 23) {
        msgSpan.textContent = 'Por favor, ingresa una hora válida (0-23).';
        return;
    }
    msgSpan.textContent = getGreeting(hour);
});

// Ticket 2: Botón contador
let counter = 0;
document.getElementById('counterBtn').addEventListener('click', function() {
    counter++;
    document.getElementById('counterValue').textContent = counter;
});

document.getElementById('resetCounterBtn').addEventListener('click', function() {
    counter = 0;
    document.getElementById('counterValue').textContent = counter;
});

// Ticket 3: Botón selector aleatorio
const randomMessages = [
    '¡Sigue adelante!',
    '¡Hoy es tu día!',
    '¡Puedes lograrlo!',
    '¡No te rindas!',
    '¡Eres increíble!',
    '!You can do everything¡',
    '!Today is your day¡',
    '¡Sigue soñando!',
    '¡Hazlo con pasión!',
    '¡Confía en ti!',
    '¡Cada día cuenta!',
    '¡La actitud lo es todo!'
];
function getRandomMessage(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
}
document.getElementById('randomBtn').addEventListener('click', function() {
    document.getElementById('randomMsg').textContent = getRandomMessage(randomMessages);
});

// Ticket 4: Botón validador de entrada
function isInputValid(value) {
    return value;
}
document.getElementById('validateBtn').addEventListener('click', function() {
    const input = document.getElementById('inputField').value;
    if (input.trim() === '') {
        document.getElementById('validateMsg').textContent = 'Por favor, escribe algo.';
    }else if (isInputValid(input)) {
        document.getElementById('validateMsg').textContent = '¡Entrada válida!';
    } else {
        document.getElementById('validateMsg').textContent = 'Por favor, escribe algo.';
    }
    
});

// Ticket 5: Botón de cambio de color
const colors = ['#f8d7da', '#d4edda', '#d1ecf1', '#fff3cd', '#cce5ff'];
let colorIndex = 0;
document.getElementById('colorBtn').addEventListener('click', function() {
    colorIndex = (colorIndex + 1) % colors.length;
    document.body.style.background = colors[colorIndex];
    document.getElementById('colorMsg').textContent = `Color cambiado (${colorIndex + 1})`;
});

// Ticket 6: Botón con ciclo (mostrar días de la semana)
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
function renderDaysList() {
    const ul = document.getElementById('daysList');
    ul.innerHTML = '';
    for (let i = 0; i < days.length; i++) {
        const li = document.createElement('li');
        li.textContent = days[i];
        ul.appendChild(li);
    }
}
document.getElementById('listBtn').addEventListener('click', renderDaysList);
