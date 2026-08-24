const SavingsAccount = require('../models/SavingsAccount');

/**
 * In-memory repository for savings accounts.
 * Keeps persistence logic isolated from business rules (separation of concerns).
 * Could be swapped later for a real database implementation without touching the service layer.
 */
class AccountRepository {
  constructor() {
    this.accounts = new Map();
    this.nextId = 1;
  }

  create(ownerName, initialBalance) {
    const id = String(this.nextId++);
    const account = new SavingsAccount(id, ownerName, initialBalance);
    this.accounts.set(id, account);
    return account;
  }

  findById(id) {
    return this.accounts.get(id) || null;
  }

  findAll() {
    return Array.from(this.accounts.values());
  }

  save(account) {
    this.accounts.set(account.id, account);
    return account;
  }
}

// Singleton instance shared across the app (simple approach for a prototype)
module.exports = new AccountRepository();
