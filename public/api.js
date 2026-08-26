const API_BASE = window.location.origin + '/api/accounts';

// Format number as COP currency
function formatCOP(n) {
  return Number(n).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Get current time as string
function nowStr() {
  const d = new Date();
  return d.toLocaleTimeString('es-CO', { hour12: false });
}

// Get full date-time string for receipts
function dateTimeStr() {
  const d = new Date();
  const date = d.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const time = d.toLocaleTimeString('es-CO', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${date} ${time}`;
}

// Check API health
async function checkHealth() {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  if (!dot || !text) return true;

  try {
    const res = await fetch(window.location.origin + '/health');
    if (!res.ok) throw new Error();
    dot.classList.remove('offline');
    text.textContent = 'conectado';
    return true;
  } catch (e) {
    dot.classList.add('offline');
    text.textContent = 'sin conexión con el servidor';
    return false;
  }
}

// Get all accounts
async function getAccounts() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error();
    const json = await res.json();
    return (json.data || []).map(a => ({
      id: a.id,
      owner: a.ownerName,
      balance: a.balance
    }));
  } catch (e) {
    return [];
  }
}

// Get single account details
async function getAccount(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data ? {
      id: json.data.id,
      owner: json.data.ownerName,
      balance: json.data.balance
    } : null;
  } catch (e) {
    return null;
  }
}

// Create new account
async function createAccount(ownerName, initialBalance = 0) {
  try {
    const body = { ownerName };
    if (initialBalance > 0) body.initialBalance = initialBalance;

    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, message: json.message || 'No fue posible crear la cuenta.' };
    }

    return {
      success: true,
      data: {
        id: json.data.id,
        owner: json.data.ownerName,
        balance: json.data.balance
      },
      message: `Cuenta creada — #${json.data.id}`
    };
  } catch (e) {
    return { success: false, message: 'No fue posible conectar con el servidor.' };
  }
}

// Deposit to account
async function deposit(accountId, amount) {
  try {
    const res = await fetch(`${API_BASE}/${accountId}/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount) })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, message: json.message || 'Depósito rechazado.' };
    }

    return {
      success: true,
      data: {
        id: json.data.newBalance,
        amount: json.data.amount,
        newBalance: json.data.newBalance
      },
      message: 'Depósito completado'
    };
  } catch (e) {
    return { success: false, message: 'No fue posible conectar con el servidor.' };
  }
}

// Withdraw from account
async function withdraw(accountId, amount) {
  try {
    const res = await fetch(`${API_BASE}/${accountId}/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount) })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, message: json.message || 'Retiro rechazado.' };
    }

    return {
      success: true,
      data: {
        id: json.data.newBalance,
        amount: json.data.amount,
        newBalance: json.data.newBalance
      },
      message: 'Retiro completado'
    };
  } catch (e) {
    return { success: false, message: 'No fue posible conectar con el servidor.' };
  }
}

// Delete account
async function deleteAccount(accountId) {
  try {
    const res = await fetch(`${API_BASE}/${accountId}`, { method: 'DELETE' });
    const json = await res.json();

    if (!res.ok || !json.success) {
      return { success: false, message: json.message || 'No fue posible eliminar la cuenta.' };
    }

    return { success: true, message: 'Cuenta eliminada' };
  } catch (e) {
    return { success: false, message: 'No fue posible conectar con el servidor.' };
  }
}

// Parse number with thousand separators (. or ,)
function parseAmount(str) {
  if (!str) return 0;
  // Remove thousand separators and normalize decimal separator
  const cleaned = String(str).replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(cleaned) || 0;
}

// Get URL parameter
function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
