const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM school_supplies');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET products by category (assuming you might want to add this feature later)
router.get('/category/:category', async (req, res) => {
  try {
    // This is a placeholder - you would need to add a category column to your table
    // or implement a different filtering mechanism
    const [rows] = await pool.query('SELECT * FROM school_supplies WHERE name LIKE ?', [`%${req.params.category}%`]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;