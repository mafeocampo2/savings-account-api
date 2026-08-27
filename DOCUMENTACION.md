# Libreta de Ahorros - Documentación Técnica

## 📋 Descripción General

**Libreta de Ahorros** es una aplicación web bancaria full-stack que simula un sistema de cuentas de ahorro. Permite a los usuarios crear cuentas, realizar depósitos y retiros, y visualizar sus transacciones.

### Características Principales
- ✅ Creación de cuentas de ahorro
- ✅ Depósitos y retiros en 2 pasos (monto → confirmación → comprobante)
- ✅ Listado de cuentas con búsqueda
- ✅ Historial de transacciones
- ✅ Modo oscuro automático
- ✅ Diseño responsivo (mobile-first)
- ✅ Validación robusta de montos

---

## 🏗️ Arquitectura

### Frontend (7 Páginas HTML)

```
index.html
   ↓
   ├→ crear.html (nueva cuenta)
   │
   └→ gestion.html?cuenta=X
      ├→ accion.html?cuenta=X&tipo=deposito|retiro
      │  └→ confirmar.html
      │     └→ comprobante.html
      │        └→ gestion.html (regresa)
```

#### **1. index.html - Selección de Cuenta**
- **Propósito**: Listar todas las cuentas existentes
- **Features**:
  - Búsqueda en tiempo real por nombre/ID
  - Botón "Actualizar lista" (fetch del servidor)
  - Botón "Abrir cuenta" (enlace a crear.html)
  - Estado vacío cuando no hay cuentas
- **Datos mostrados**: Titular, Número de cuenta (#), Saldo actual
- **Navegación**: Clic en fila → gestion.html?cuenta=X

#### **2. crear.html - Abrir Nueva Cuenta**
- **Propósito**: Formulario para crear una nueva cuenta
- **Campos**:
  - Titular (texto, obligatorio)
  - Depósito inicial (número, opcional)
- **Validación**:
  - Titular no puede estar vacío
  - Monto se parsea con parseAmount() (maneja 100.000, 100,000)
  - Error si la API falla
- **Flujo**: 
  1. Usuario completa y hace clic en "Crear cuenta"
  2. Envía POST a `/api/accounts`
  3. Muestra confirmación
  4. Redirige a index.html

#### **3. gestion.html?cuenta=X - Gestión de Cuenta**
- **Propósito**: Panel principal de una cuenta
- **Pantalla muestra**:
  - Saldo disponible (grande, número tabular)
  - Nombre del titular
  - Número de cuenta (#XXX)
- **Acciones disponibles**:
  - Botón "Depositar" → accion.html?cuenta=X&tipo=deposito
  - Botón "Retirar" → accion.html?cuenta=X&tipo=retiro
  - Botón "Eliminar cuenta" (con confirmación)
- **Actualización automática**: Recarga cada 10 segundos
- **Tabla de movimientos**: Muestra historial (si existe)

#### **4. accion.html?cuenta=X&tipo=deposito|retiro - Paso 1: Monto**
- **Propósito**: Ingreso del monto a depositar/retirar
- **Features**:
  - Mostrada la cuenta destino y saldo actual
  - Input de monto con validación en tiempo real
  - Botones de "acceso rápido": $10.000, $50.000, $100.000, $500.000
  - **Preview en vivo**: Muestra saldo actual, monto, saldo final
  - Botón "Siguiente" solo activo si monto > 0
  - Para retiros: valida que no exceda el saldo
- **Almacenamiento**: 
  - Guarda en sessionStorage: `{accountId, tipo, amount}`
- **Navegación**:
  - "Siguiente" → confirmar.html
  - "Cancelar" → gestion.html

#### **5. confirmar.html - Paso 2: Confirmación**
- **Propósito**: Confirmar la operación antes de enviar
- **Muestra**:
  - Monto grande (+ para depósito, − para retiro)
  - Resumen con: Cuenta, Saldo anterior, Monto, Saldo final
  - Botón "Confirmar" y "Cancelar"
- **Seguridad**:
  - Botón "Confirmar" se deshabilita al hacer clic (evita doble-envío)
  - Lee datos de sessionStorage
  - Envía a API: POST `/api/accounts/{id}/deposit` o `/withdraw`
- **Navegación**:
  - Si exitoso → comprobante.html (después de 1.5s)
  - Si error → muestra mensaje, botón re-habilitado

#### **6. comprobante.html - Resultado**
- **Propósito**: Recibo de la operación completada
- **Muestra**:
  - Ícono de "✓" (éxito)
  - Monto grande con signo (+ o −)
  - Detalles:
    - Cuenta (#XXX - Titular)
    - Saldo anterior
    - Saldo actual
    - Número de comprobante (generado)
    - Fecha y hora (completa)
- **Navegación**:
  - Botón "Volver a gestión" → gestion.html?cuenta=X

---

## 🔌 API REST (Backend)

### Base URL
```
http://localhost:3000/api/accounts
```

### Endpoints

#### **GET /api/accounts**
```javascript
// Request
GET /api/accounts

// Response 200
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ownerName": "Andrés Villegas Mesa",
      "balance": 1500000
    }
  ]
}
```

#### **POST /api/accounts**
```javascript
// Request
POST /api/accounts
{
  "ownerName": "Juan Pérez",
  "initialBalance": 500000  // opcional
}

// Response 201
{
  "success": true,
  "data": {
    "id": 2,
    "ownerName": "Juan Pérez",
    "balance": 500000
  }
}
```

#### **GET /api/accounts/:id**
```javascript
// Request
GET /api/accounts/1

// Response 200
{
  "success": true,
  "data": {
    "id": 1,
    "ownerName": "Andrés Villegas Mesa",
    "balance": 1500000
  }
}
```

#### **POST /api/accounts/:id/deposit**
```javascript
// Request
POST /api/accounts/1/deposit
{ "amount": 150000 }

// Response 200
{
  "success": true,
  "data": {
    "amount": 150000,
    "newBalance": 1650000
  }
}
```

#### **POST /api/accounts/:id/withdraw**
```javascript
// Request
POST /api/accounts/1/withdraw
{ "amount": 100000 }

// Response 200
{
  "success": true,
  "data": {
    "amount": 100000,
    "newBalance": 1550000
  }
}

// Response 400 (saldo insuficiente)
{
  "success": false,
  "message": "Insufficient balance"
}
```

#### **DELETE /api/accounts/:id**
```javascript
// Request
DELETE /api/accounts/1

// Response 200
{
  "success": true,
  "data": { /* cuenta eliminada */ }
}
```

---

## 💾 Gestión de Datos

### En Memoria (servidor)
```javascript
// src/data/accounts.js
const accounts = {};  // id -> {id, ownerName, balance}
```

### En Cliente

#### **sessionStorage (para flujos multi-paso)**
```javascript
sessionStorage.setItem('pendingAction', JSON.stringify({
  accountId: 1,
  type: 'deposito',
  amount: 150000
}));

sessionStorage.setItem('receipt', JSON.stringify({
  accountId: 1,
  type: 'deposito',
  amount: 150000,
  newBalance: 1650000,
  timestamp: '26/08/2026 10:09:15'
}));
```

#### **localStorage (NO se usa)**
- Por diseño, el ID de cuenta **vive en la URL**, no en localStorage
- Esto hace que el botón "atrás" del navegador funcione naturalmente

---

## 🎨 Sistema de Diseño

### Paleta de Colores

**Modo Claro (default)**
```css
--navy: #332F4A        /* Header, botones */
--ink: #2A2A38         /* Texto principal */
--ink-soft: #6B7280    /* Etiquetas, hints */
--paper: #F4F5F8       /* Fondo */
--white: #FFFFFF       /* Tarjetas, bordes */
--green: #146D34       /* Depósitos, OK */
--red: #9A322A        /* Retiros, errores */
```

**Modo Oscuro ([data-theme="dark"])**
```css
--navy: #1C1B2E        /* Header oscuro */
--ink: #E8E9EE         /* Texto claro */
--ink-soft: #9AA3B2    /* Etiquetas */
--paper: #14141F       /* Fondo muy oscuro */
--white: #FFFFFF       /* Texto siempre blanco */
/* Colores acentos igual */
```

### Tipografía
- **Archivo**: Interfaz, textos generales
- **IBM Plex Mono**: Números y montos (tabular-nums)
- **Font size**: Labels 10.5px, body 14-15px, headings 18-48px

### Componentes

#### **Botones**
```html
<!-- Todos con border 2px, sin fondo -->
<button class="btn-primary">Actualizar</button>    <!-- Navy -->
<button class="btn-secondary">Cancelar</button>   <!-- Navy outline -->
<button class="btn-success">Depositar</button>    <!-- Verde -->
<button class="btn-danger">Eliminar</button>      <!-- Rojo -->
<button class="btn-confirm">Confirmar</button>    <!-- Navy sólido (special) -->
```

#### **Tarjetas**
```html
<div class="card">
  <!-- Fondo blanco/oscuro, borde sutil, padding 30px -->
</div>
```

#### **Inputs**
```html
<input type="text" placeholder="Nombre completo">
<!-- Borde inferior sólo en focus -->
```

---

## 🔐 Validación y Seguridad

### Cliente (JavaScript)
1. **Validación de monto**
   ```javascript
   const amount = parseAmount(input.value);  // Maneja separadores
   if (amount <= 0) disableButton();         // No permite <= 0
   ```

2. **Prevención de doble-envío**
   ```javascript
   button.disabled = true;  // Inmediatamente al hacer clic
   // Se re-habilita sólo si hay error
   ```

3. **Búsqueda sin servidor**
   ```javascript
   const filtered = allAccounts.filter(acc =>
     acc.owner.toLowerCase().includes(query) ||
     String(acc.id).includes(query)
   );
   ```

### Servidor (Node.js + Express)
1. **Validación de entrada**
   - ownerName es string no vacío
   - amount es número > 0

2. **Validación de lógica**
   - Retiro no puede exceder saldo
   - Cuenta debe existir

3. **Respuestas consistentes**
   - Siempre estructura: `{success: bool, data?, message?}`

---

## 📱 Flujo Completo: Depositar $150.000

```
[Usuario en gestion.html?cuenta=1]
           ↓
    Hace clic en "Depositar"
           ↓
[Navega a accion.html?cuenta=1&tipo=deposito]
           ↓
    Ingresa "150000" en input
           ↓
[Preview en vivo actualiza: saldo final = 1.150.000]
           ↓
    Hace clic en "Siguiente"
           ↓
[sessionStorage.pendingAction = {accountId: 1, type: "deposito", amount: 150000}]
           ↓
[Navega a confirmar.html]
           ↓
    Lee sessionStorage, muestra resumen
           ↓
    Hace clic en "Confirmar"
           ↓
    Button.disabled = true
           ↓
    POST /api/accounts/1/deposit { amount: 150000 }
           ↓
    [Servidor: valida, suma, responde]
           ↓
    Response 200: { amount: 150000, newBalance: 1150000 }
           ↓
    sessionStorage.receipt = { ...datos completos }
           ↓
[Navega a comprobante.html (después 1.5s)]
           ↓
    Lee receipt, muestra:
    - ✓ Depósito completado
    - + $ 150.000
    - Saldo anterior: $ 1.000.000
    - Saldo actual: $ 1.150.000
    - Comprobante: ABC123DEF
    - Fecha: 26/08/2026 10:09:15
           ↓
    Usuario hace clic "Volver"
           ↓
[Navega a gestion.html?cuenta=1]
           ↓
    Carga cuenta, muestra nuevo saldo: $ 1.150.000
```

---

## 📊 Funciones Clave

### api.js

```javascript
// Formatear número como pesos sin decimales
formatCOP(1000000)  // "1.000.000"

// Parse inteligente de montos
parseAmount("100.000")  // 100000
parseAmount("100,000")  // 100000
parseAmount("100000")   // 100000

// Obtener todas las cuentas
getAccounts()  // Promise -> Array<Account>

// Obtener una cuenta
getAccount(id)  // Promise -> Account | null

// Crear cuenta
createAccount(name, initialBalance)  // Promise -> {success, data, message}

// Operaciones bancarias
deposit(accountId, amount)     // Promise -> {success, data, message}
withdraw(accountId, amount)    // Promise -> {success, data, message}
deleteAccount(accountId)       // Promise -> {success, data, message}

// Utilidades
getParam(name)  // Lee query string
checkHealth()   // Verifica servidor
```

### Cada página (gestion.html, etc)

```javascript
// Inicialización
async function init() {
  checkHealth();
  await loadData();
  setInterval(refreshData, 10000);  // Cada 10s
}

// Actualizar UI desde API
async function loadAccount() {
  const account = await getAccount(accountId);
  document.getElementById('balance').textContent = formatCOP(account.balance);
}

// Toggle modo oscuro
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}
```

---

## 🚀 Cómo Ejecutar

### Prerrequisitos
- Node.js v14+
- npm

### Instalación
```bash
# En la raíz del proyecto
npm install

# Iniciar servidor
npm start

# Abre en navegador
http://localhost:3000
```

### Estructura de archivos
```
savings-account-api/
├── public/
│   ├── index.html           # Listado de cuentas
│   ├── crear.html           # Crear cuenta
│   ├── gestion.html         # Gestión
│   ├── accion.html          # Paso 1 (monto)
│   ├── confirmar.html       # Paso 2 (confirmación)
│   ├── comprobante.html     # Resultado
│   ├── presentacion.html    # Diapositivas (esta file)
│   ├── api.js               # Funciones API compartidas
│   └── estilos.css          # Estilos globales
├── src/
│   ├── server.js            # Express setup
│   ├── routes/
│   │   └── accountRoutes.js  # Endpoints
│   └── data/
│       └── accounts.js       # Base de datos en memoria
└── package.json
```

---

## 📝 Decisiones de Diseño

### ¿Por qué 7 páginas separadas?
- **UX clara**: Cada paso es una pantalla, no confunde
- **Navegación intuitiva**: El botón "atrás" funciona como se espera
- **Mobile-friendly**: Enfoque en una acción a la vez
- **Mantenibilidad**: Código separado, más fácil de leer

### ¿Por qué URL params en lugar de localStorage?
- **Navegación natural**: Botón atrás del navegador funciona
- **Shareable**: Puedes compartir URLs
- **Seguridad**: Los datos no persisten más allá de la sesión

### ¿Por qué sessionStorage en flujos multi-paso?
- **Privacidad**: Datos desaparecen al cerrar el tab
- **Prevención de caché**: No confunde navegación histórica
- **Validación**: Paso 2 valida que Paso 1 haya sucedido

### ¿Por qué sin decimales en montos?
- **Simplificación**: Aplicación es educativa
- **UX**: Números más limpios
- **Realidad**: Muchos sistemas de tarjeta también lo hacen

---

## 🧪 Testing Manual

### Crear cuenta
- [ ] Click "Abrir cuenta"
- [ ] Ingresar "Andrés" y "1000000"
- [ ] Click "Crear"
- [ ] Verificar que aparece en index.html

### Depositar
- [ ] Click en una cuenta
- [ ] Click "Depositar"
- [ ] Ingresa "250000"
- [ ] Verifica preview: saldo final = anterior + 250000
- [ ] Click "Siguiente"
- [ ] Verifica resumen
- [ ] Click "Confirmar"
- [ ] Verifica comprobante
- [ ] Click "Volver"
- [ ] Verifica saldo actualizado

### Retiro (saldo insuficiente)
- [ ] Click "Retirar"
- [ ] Ingresa más que el saldo
- [ ] Botón "Siguiente" debe estar deshabilitado

### Modo oscuro
- [ ] Click ícono tema
- [ ] Verificar contraste
- [ ] "Libreta de Ahorros" debe ser visible

---

## 🔍 Debugging Tips

### Ver red de peticiones
```javascript
// En console del navegador
fetch('/api/accounts')
  .then(r => r.json())
  .then(console.log)
```

### Ver localStorage/sessionStorage
```javascript
console.log(sessionStorage.getItem('pendingAction'))
```

### Buscar errores de API
Revisar en servidor: `npm start` mostrará logs

### Modo developer
- F12 → Pestaña "Network" para ver peticiones
- "Console" para logs y errores
- "Application" para inspeccionar Storage

---

## 📚 Recursos

- [MDN - Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [MDN - CSS Variables](https://developer.mozilla.org/es/docs/Web/CSS/var)
- [Express Docs](https://expressjs.com/)

---

**Desarrollado como proyecto educativo en 2026**
