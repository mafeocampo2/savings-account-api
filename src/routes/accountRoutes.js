const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();

// POST /api/accounts -> create a new savings account
router.post('/', accountController.createAccount);

// GET /api/accounts -> list all accounts
router.get('/', accountController.listAccounts);

// GET /api/accounts/:id -> get one account
router.get('/:id', accountController.getAccount);

// GET /api/accounts/:id/balance -> check balance
router.get('/:id/balance', accountController.getBalance);

// GET /api/accounts/:id/history -> get transaction history
router.get('/:id/history', accountController.getTransactionHistory);

// POST /api/accounts/:id/deposit -> deposit money
router.post('/:id/deposit', accountController.deposit);

// POST /api/accounts/:id/withdraw -> withdraw money
router.post('/:id/withdraw', accountController.withdraw);

// DELETE /api/accounts/:id -> delete an account
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
