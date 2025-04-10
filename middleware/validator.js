/**
 * Request validation middleware
 * Provides utility functions for validating request data
 */

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate required fields in request body
const validateRequiredFields = (req, res, fields) => {
  for (const field of fields) {
    if (!req.body[field]) {
      return res.status(400).json({ message: `${field} is required` });
    }
  }
  return null;
};

// Validate product data
const validateProduct = (req, res, next) => {
  const { name, unit_price } = req.body;
  
  if (!name || !unit_price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }
  
  if (isNaN(parseFloat(unit_price))) {
    return res.status(400).json({ message: 'Price must be a valid number' });
  }
  
  next();
};

// Validate user registration data
const validateUserRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  
  // Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  
  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  
  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  
  next();
};

// Validate user login data
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Check required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  
  next();
};

module.exports = {
  validateRequiredFields,
  validateProduct,
  validateUserRegistration,
  validateUserLogin,
  isValidEmail
};