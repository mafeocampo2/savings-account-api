/**
 * Centralized error handling middleware.
 * Ensures the server never crashes on an unhandled/unexpected error and always
 * returns a clear, consistent JSON response to the client.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Unexpected internal server error.';

  if (!err.isOperational) {
    // Log unexpected errors for debugging; do not leak internal details to the client.
    console.error('[UNEXPECTED ERROR]', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
}

module.exports = { errorHandler, notFoundHandler };
