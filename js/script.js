"use strict";

const texts = {
  easy: [
    "El perro corre en el parque bajo el sol mientras los niños juegan cerca del lago.",
    "La casa es grande y tiene un jardín verde con flores de varios colores.",
    "Hoy el clima está agradable y la gente camina tranquila por las calles del barrio.",
    "Mi amigo estudia en la universidad y siempre llega temprano a sus clases.",
    "El gato duerme sobre el sofá mientras la lluvia cae suavemente en la ventana.",
    "La familia prepara la cena juntos en la cocina después de un largo día.",
    "El niño aprende a leer con paciencia y entusiasmo cada nueva palabra.",
    "El mercado está lleno de personas comprando frutas frescas y verduras."
  ],

  medium: [
    "La programación requiere práctica constante, pensamiento lógico y una comprensión profunda de cómo se estructuran los algoritmos.",
    "El cerebro humano procesa información a velocidades sorprendentes, adaptándose al entorno mediante mecanismos de aprendizaje continuo.",
    "La comunicación efectiva depende no solo del lenguaje, sino también del contexto emocional y la interpretación del receptor.",
    "El desarrollo de software moderno exige dominio de herramientas, patrones de diseño y buenas prácticas de arquitectura.",
    "La psicología estudia el comportamiento humano desde múltiples perspectivas que incluyen lo cognitivo, lo conductual y lo emocional.",
    "Los sistemas complejos emergen de la interacción entre múltiples variables que no pueden entenderse de forma aislada.",
    "La memoria humana no funciona como un registro exacto, sino como un proceso reconstructivo influenciado por la experiencia.",
    "El análisis de datos permite transformar información cruda en conocimiento útil para la toma de decisiones estratégicas.",
  ],

  hard: [
    "La epistemología contemporánea examina las condiciones de posibilidad del conocimiento científico y los límites inherentes a la justificación empírica.",
    "La computación cuántica redefine los paradigmas clásicos del procesamiento de información mediante superposición, entrelazamiento y colapso de estados.",
    "Las teorías del lenguaje en filosofía analítica cuestionan la relación entre significado, referencia y estructura lógica del discurso humano.",
    "La neuroplasticidad implica que el sistema nervioso puede reorganizar sus conexiones sinápticas en respuesta a estímulos ambientales y experiencias.",
    "Los modelos estadísticos bayesianos permiten actualizar probabilidades a partir de nueva evidencia, optimizando inferencias bajo incertidumbre.",
    "La teoría de sistemas complejos estudia fenómenos donde el comportamiento global no puede deducirse directamente de sus componentes individuales.",
    "La inteligencia artificial moderna integra redes neuronales profundas que ajustan millones de parámetros mediante procesos iterativos de optimización.",
    "El reduccionismo metodológico en ciencia ha sido cuestionado por enfoques holísticos que enfatizan la interdependencia entre niveles de análisis.",
  ],
};

let startTime = null;
let timerInterval = null;
let currentText = "";
let errors = 0;
let typedChars = 0;
let totalTyped = 0;

const input = document.getElementById("input");
const textDisplay = document.getElementById("textDisplay");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const errorsEl = document.getElementById("errors");

const bestWpmEl = document.getElementById("bestWpm");
const avgWpmEl = document.getElementById("avgWpm");

function getRandomText() {
  const diff = document.getElementById("difficulty").value;
  const arr = texts[diff];
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderText() {
  textDisplay.innerHTML = currentText
    .split("")
    .map((char) => `<span>${char}</span>`)
    .join("");
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timeEl.textContent = seconds;
    updateWPM(seconds);
  }, 1000);
}

function updateWPM(seconds) {
  const words = input.value.trim().split(/\s+/).length;
  const wpm = seconds > 0 ? Math.round(words / (seconds / 60)) : 0;
  wpmEl.textContent = wpm;
}

function updateAccuracy() {
  const total = input.value.length;
  const correct = total - errors;
  const accuracy =
    total === 0 ? 100 : Math.max(0, Math.round((correct / total) * 100));
  accuracyEl.textContent = accuracy;
}

function updateErrors() {
  errorsEl.textContent = errors;
}

function highlightText() {
  const spans = textDisplay.querySelectorAll("span");
  const value = input.value;

  errors = 0;

  spans.forEach((span, i) => {
    const char = value[i];

    if (char == null) {
      span.className = "";
    } else if (char === span.textContent) {
      span.className = "correct";
    } else {
      span.className = "incorrect";
      errors++;
    }
  });

  updateErrors();
  updateAccuracy();
}

function finishTest() {
  clearInterval(timerInterval);

  const seconds = Math.floor((Date.now() - startTime) / 1000);
  const words = input.value.trim().split(/\s+/).length;
  const wpm = Math.round(words / (seconds / 60));

  saveStats(wpm);
}

function saveStats(wpm) {
  let stats = JSON.parse(localStorage.getItem("typingStats")) || {
    sessions: [],
    best: 0,
  };

  stats.sessions.push(wpm);
  stats.best = Math.max(stats.best, wpm);

  localStorage.setItem("typingStats", JSON.stringify(stats));

  updateHistory();
}

function updateHistory() {
  let stats = JSON.parse(localStorage.getItem("typingStats")) || {
    sessions: [],
    best: 0,
  };

  const avg =
    stats.sessions.reduce((a, b) => a + b, 0) / (stats.sessions.length || 1);

  bestWpmEl.textContent = stats.best;
  avgWpmEl.textContent = Math.round(avg);
}

function reset() {
  clearInterval(timerInterval);
  input.value = "";
  timeEl.textContent = 0;
  wpmEl.textContent = 0;
  accuracyEl.textContent = 100;
  errorsEl.textContent = 0;

  currentText = getRandomText();
  renderText();
  startTime = null;
}

input.addEventListener("input", () => {
  if (!startTime) startTimer();

  highlightText();

  if (input.value === currentText) {
    finishTest();
  }
});

document.getElementById("restart").addEventListener("click", reset);

document.getElementById("difficulty").addEventListener("change", reset);

currentText = getRandomText();
renderText();
updateHistory();
