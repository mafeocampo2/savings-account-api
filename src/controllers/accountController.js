const accountService = require('../services/accountService');

/**
 * Controllers only handle HTTP concerns (req/res) and delegate business logic
 * to the service layer. Errors are forwarded to the centralized error handler
 * via next(error).
 */

function createAccount(req, res, next) {
  try {
    const account = accountService.createAccount(req.body);
    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: account,
    });
  } catch (error) {
    return next(error);
  }
}

function getAccount(req, res, next) {
  try {
    const account = accountService.getAccountById(req.params.id);
    return res.status(200).json({ success: true, data: account });
  } catch (error) {
    return next(error);
  }
}

function listAccounts(req, res, next) {
  try {
    const accounts = accountService.getAllAccounts();
    return res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    return next(error);
  }
}

function getBalance(req, res, next) {
  try {
    const result = accountService.getBalance(req.params.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

function deposit(req, res, next) {
  try {
    const result = accountService.deposit(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Deposit processed successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

function withdraw(req, res, next) {
  try {
    const result = accountService.withdraw(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Withdrawal processed successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

function deleteAccount(req, res, next) {
  try {
    const result = accountService.deleteAccount(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createAccount,
  getAccount,
  listAccounts,
  getBalance,
  deposit,
  withdraw,
  deleteAccount,
};
