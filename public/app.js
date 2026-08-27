const API_BASE = window.location.origin + '/api/accounts';

function fmt(n) {
  return Number(n).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Monto con el símbolo pegado al número. El símbolo va en su propio
// <span class="cur"> para que el CSS lo pueda ocultar en modo oscuro.
function money(n) {
  return `<span class="cur">$</span>${fmt(n)}`;
}

// Hora en formato 24h, solo hora y minutos.
function fmtTime(date) {
  return date.toLocaleTimeString('es-CO', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

function fmtDateTime(date) {
  return `${date.toLocaleDateString('es-CO')} ${fmtTime(date)}`;
}

function nowStr() {
  return fmtTime(new Date());
}

function parseAmount(str) {
  // Remueve separadores de miles
  const cleaned = String(str).replace(/\./g, '')
                             .replace(/,/g, '.');
  return parseFloat(cleaned) || 0;
}

function dateStr() {
  const d = new Date();
  return d.toLocaleDateString('es-CO');
}

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    document.getElementById('themeLabel').textContent = 'Modo oscuro';
  } else {
    root.setAttribute('data-theme', 'dark');
    document.getElementById('themeLabel').textContent = 'Modo claro';
  }
}

async function checkHealth() {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  try {
    const res = await fetch(window.location.origin + '/health');
    if (!res.ok) throw new Error();
    dot.classList.remove('offline');
    text.textContent = 'conectado';
  } catch (e) {
    dot.classList.add('offline');
    text.textContent = 'sin conexión con el servidor';
  }
}

function getQueryParam(name) {
  const url = new URL(window.location);
  return url.searchParams.get(name);
}

function showNotice(id, msg, ok = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'notice show ' + (ok ? 'ok' : 'err');
  setTimeout(() => {
    el.classList.remove('show');
  }, 10000);
}

checkHealth();
