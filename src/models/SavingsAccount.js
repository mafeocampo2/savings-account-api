/**
 * SavingsAccount model.
 * Plain data structure representing a savings account.
 */
class SavingsAccount {
  constructor(id, ownerName, initialBalance = 0) {
    this.id = id;
    this.ownerName = ownerName;
    this.balance = initialBalance;
    this.createdAt = new Date().toISOString();
  }
}

module.exports = SavingsAccount;
