const accountRepository = require('../repositories/accountRepository');
const AppError = require('../errors/AppError');
const {
  validateCreateAccount,
  validateDeposit,
  validateWithdraw,
  validateAccountId,
} = require('../validators/accountValidator');

/**
 * Business logic for the savings account system.
 * Business rules:
 *  1. Deposit amount must be greater than zero.
 *  2. Withdraw amount must be greater than zero.
 *  3. It is not allowed to withdraw more than the available balance.
 *  4. The balance can never be negative.
 */
class AccountService {
  createAccount(payload) {
    validateCreateAccount(payload);
    const { ownerName, initialBalance = 0 } = payload;
    const account = accountRepository.create(ownerName.trim(), Number(initialBalance));
    return account;
  }

  getAccountById(id) {
    validateAccountId(id);
    const account = accountRepository.findById(id);

    if (!account) {
      throw new AppError(`Account with id "${id}" was not found.`, 404);
    }

    return account;
  }

  getAllAccounts() {
    return accountRepository.findAll();
  }

  getBalance(id) {
    const account = this.getAccountById(id);
    return { accountId: account.id, balance: account.balance };
  }

  deposit(id, payload) {
    const account = this.getAccountById(id);
    const amount = validateDeposit(payload);

    account.balance += amount;
    accountRepository.save(account);

    return {
      accountId: account.id,
      operation: 'deposit',
      amount,
      newBalance: account.balance,
    };
  }

  withdraw(id, payload) {
    const account = this.getAccountById(id);
    const amount = validateWithdraw(payload);

    // Business rule: cannot withdraw more than the available balance.
    if (amount > account.balance) {
      throw new AppError(
        `Insufficient balance. Available balance is ${account.balance}, requested withdrawal is ${amount}.`,
        400
      );
    }

    account.balance -= amount;

    // Safety net: the balance must never become negative.
    if (account.balance < 0) {
      throw new AppError('Operation rejected: balance cannot be negative.', 400);
    }

    accountRepository.save(account);

    return {
      accountId: account.id,
      operation: 'withdraw',
      amount,
      newBalance: account.balance,
    };
  }
}

module.exports = new AccountService();
