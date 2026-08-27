const Transaction = require('./Transaction');

class SavingsAccount {
  constructor(id, ownerName, initialBalance = 0) {
    this.id = id;
    this.ownerName = ownerName;
    this.balance = initialBalance;
    this.createdAt = new Date().toISOString();
    this.transactions = [];

    if (initialBalance > 0) {
      this.transactions.push(new Transaction('creation', initialBalance, 'Apertura de cuenta'));
    }
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }
}

module.exports = SavingsAccount;
