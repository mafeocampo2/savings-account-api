# Savings Account API

REST API that simulates a basic savings account system, developed for the TechSoft S.A. university prototype project.

## Business rules

1. Deposit amount must be greater than zero.
2. Withdraw amount must be greater than zero.
3. It is not allowed to withdraw more than the available balance.
4. The balance can never be negative.

## Architecture (separation of responsibilities)

```
src/
├── models/         -> Data structures (SavingsAccount)
├── repositories/    -> Data access / persistence (in-memory)
├── validators/       -> Input validation (required fields, numeric, ranges)
├── services/          -> Business rules and logic
├── controllers/         -> HTTP request/response handling
├── routes/                -> Express route definitions
├── middlewares/            -> Centralized error handling
└── app.js                   -> Express app configuration
server.js                      -> Application entry point
```

Each layer has a single responsibility, so the code is easy to maintain and extend
(for example, replacing the in-memory repository with a real database only requires
changing `accountRepository.js`).

## Requirements

- Node.js 18+ (uses the built-in `node:test` module for testing)

## Installation

```bash
npm install
```

## Run the API

```bash
npm start
```

The server starts on `http://localhost:3000`.

## Run tests

```bash
npm test
```

## Web frontend

A simple web interface (styled like a savings passbook) is served automatically
at `http://localhost:3000` once the server is running. It lets you create
accounts, deposit, withdraw, and check the balance directly in the browser —
no Postman required. It's a plain HTML/CSS/JS page (`public/index.html`) that
calls the same REST endpoints described below via `fetch`.

## Endpoints

| Method | Endpoint                          | Description                     |
|--------|------------------------------------|----------------------------------|
| GET    | `/`                                 | Health check                    |
| POST   | `/api/accounts`                     | Create a new account            |
| GET    | `/api/accounts`                     | List all accounts               |
| GET    | `/api/accounts/:id`                 | Get one account                 |
| GET    | `/api/accounts/:id/balance`         | Check the balance                |
| POST   | `/api/accounts/:id/deposit`         | Deposit money                    |
| POST   | `/api/accounts/:id/withdraw`        | Withdraw money                   |
| DELETE | `/api/accounts/:id`                 | Delete an account                |

### Example: create an account

```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{"ownerName": "Ana", "initialBalance": 100}'
```

### Example: deposit

```bash
curl -X POST http://localhost:3000/api/accounts/1/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 50}'
```

### Example: withdraw (insufficient balance error)

```bash
curl -X POST http://localhost:3000/api/accounts/1/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 999999}'
```

Response:

```json
{
  "success": false,
  "message": "Insufficient balance. Available balance is 150, requested withdrawal is 999999."
}
```

## Testing with Postman

Import `postman_collection.json` into Postman. It includes success and error cases
for every endpoint (including invalid/non-numeric amounts and insufficient balance).

## Naming convention

The project uses **camelCase** for variables and functions, and **PascalCase** for
classes (e.g. `SavingsAccount`, `AppError`), consistently across the codebase.
All source code, comments, and error messages are written in English.
