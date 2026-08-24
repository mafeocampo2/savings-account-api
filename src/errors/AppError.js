/**
 * Custom application error.
 * Allows controllers/services to throw errors with a specific HTTP status code
 * instead of letting the server crash with an unhandled exception.
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true; // Known/expected error, safe to show to the client
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
