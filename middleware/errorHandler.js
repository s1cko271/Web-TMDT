/**
 * Global error handling middleware
 * Provides consistent error responses across the application
 */

const errorHandler = (err, req, res, next) => {
  // Log error for server-side debugging
  console.error('Server Error:', err.message);
  console.error(err.stack);

  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;