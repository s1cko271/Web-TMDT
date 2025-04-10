/**
 * Middleware index file
 * Exports all middleware functions from a single file for easier imports
 */

const { verifyToken } = require('./auth');
const errorHandler = require('./errorHandler');
const {
  validateRequiredFields,
  validateProduct,
  validateUserRegistration,
  validateUserLogin,
  isValidEmail
} = require('./validator');

module.exports = {
  // Auth middleware
  verifyToken,
  
  // Error handling middleware
  errorHandler,
  
  // Validation middleware
  validateRequiredFields,
  validateProduct,
  validateUserRegistration,
  validateUserLogin,
  isValidEmail
};