const test = require('node:test');
const assert = require('node:assert/strict');
const accountService = require('../src/services/accountService');

test('should create an account with a valid initial balance', () => {
  const account = accountService.createAccount({ ownerName: 'Ana', initialBalance: 100 });
  assert.equal(account.balance, 100);
  assert.equal(account.ownerName, 'Ana');
});

test('should reject account creation without ownerName', () => {
  assert.throws(() => accountService.createAccount({}), /ownerName/);
});

test('should deposit a valid amount and increase the balance', () => {
  const account = accountService.createAccount({ ownerName: 'Luis', initialBalance: 50 });
  const result = accountService.deposit(account.id, { amount: 25 });
  assert.equal(result.newBalance, 75);
});

test('should reject a deposit of zero or negative amount', () => {
  const account = accountService.createAccount({ ownerName: 'Marta', initialBalance: 10 });
  assert.throws(() => accountService.deposit(account.id, { amount: 0 }));
  assert.throws(() => accountService.deposit(account.id, { amount: -5 }));
});

test('should reject a deposit with a non-numeric amount', () => {
  const account = accountService.createAccount({ ownerName: 'Pedro', initialBalance: 10 });
  assert.throws(() => accountService.deposit(account.id, { amount: 'abc' }));
});

test('should withdraw a valid amount and decrease the balance', () => {
  const account = accountService.createAccount({ ownerName: 'Sofia', initialBalance: 100 });
  const result = accountService.withdraw(account.id, { amount: 40 });
  assert.equal(result.newBalance, 60);
});

test('should reject withdrawal greater than available balance', () => {
  const account = accountService.createAccount({ ownerName: 'Carlos', initialBalance: 30 });
  assert.throws(() => accountService.withdraw(account.id, { amount: 100 }), /Insufficient balance/);
});

test('should never allow a negative balance', () => {
  const account = accountService.createAccount({ ownerName: 'Elena', initialBalance: 0 });
  assert.throws(() => accountService.withdraw(account.id, { amount: 1 }));
  assert.equal(account.balance, 0);
});

test('should delete an existing account', () => {
  const account = accountService.createAccount({ ownerName: 'Diego', initialBalance: 20 });
  const result = accountService.deleteAccount(account.id);
  assert.equal(result.deleted, true);
  assert.throws(() => accountService.getAccountById(account.id), /was not found/);
});

test('should reject deleting a non-existent account', () => {
  assert.throws(() => accountService.deleteAccount('99999'), /was not found/);
});
