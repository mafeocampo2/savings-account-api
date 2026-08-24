const AppError = require('../errors/AppError');

/**
 * Validates the payload used to create a new account.
 */
function validateCreateAccount(payload) {
  const { ownerName, initialBalance } = payload || {};

  if (!ownerName || typeof ownerName !== 'string' || ownerName.trim() === '') {
    throw new AppError('The field "ownerName" is required and must be a non-empty string.', 400);
  }

  if (initialBalance !== undefined) {
    validateAmount(initialBalance, 'initialBalance', { allowZero: true });
  }
}

/**
 * Validates that an amount is present, numeric and within an allowed range.
 * @param {*} value - raw value received from the request body
 * @param {string} fieldName - name of the field, used in error messages
 * @param {object} options - { allowZero: boolean }
 */
function validateAmount(value, fieldName = 'amount', options = {}) {
  const { allowZero = false } = options;

  if (value === undefined || value === null || value === '') {
    throw new AppError(`The field "${fieldName}" is required.`, 400);
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue) || typeof value === 'boolean') {
    throw new AppError(`The field "${fieldName}" must be a valid number.`, 400);
  }

  if (!Number.isFinite(numericValue)) {
    throw new AppError(`The field "${fieldName}" must be a finite number.`, 400);
  }

  const minAllowed = allowZero ? 0 : 0;
  const isValidRange = allowZero ? numericValue >= minAllowed : numericValue > minAllowed;

  if (!isValidRange) {
    const rule = allowZero ? 'greater than or equal to 0' : 'greater than 0';
    throw new AppError(`The field "${fieldName}" must be ${rule}.`, 400);
  }

  return numericValue;
}

/**
 * Validates deposit payload. Business rule: deposit amount must be greater than zero.
 */
function validateDeposit(payload) {
  const { amount } = payload || {};
  return validateAmount(amount, 'amount', { allowZero: false });
}

/**
 * Validates withdraw payload. Business rule: withdraw amount must be greater than zero.
 * (The "insufficient balance" rule is validated in the service layer, since it needs
 * the current account state, not just the raw input.)
 */
function validateWithdraw(payload) {
  const { amount } = payload || {};
  return validateAmount(amount, 'amount', { allowZero: false });
}

function validateAccountId(id) {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new AppError('A valid account id must be provided.', 400);
  }
}

module.exports = {
  validateCreateAccount,
  validateDeposit,
  validateWithdraw,
  validateAccountId,
};
