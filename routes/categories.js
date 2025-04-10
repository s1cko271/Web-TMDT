const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET all categories
router.get('/', async (req, res) => {
  try {
    // Lấy danh sách các danh mục từ cơ sở dữ liệu
    // Vì bảng school_supplies chưa có cột category, chúng ta sẽ tạo một danh sách cố định
    const categories = [
      { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { id: 2, name: 'Clothing', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { id: 3, name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80' },
      { id: 4, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
      { id: 5, name: 'School Supplies', image: '/images/sp1.jpg' }
    ];
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET products by category
router.get('/:categoryName/products', async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    
    // Vì chưa có cột category trong bảng school_supplies, chúng ta sẽ giả định tất cả sản phẩm đều thuộc danh mục "School Supplies"
    if (categoryName.toLowerCase() === 'school supplies') {
      const [rows] = await pool.query('SELECT * FROM school_supplies');
      res.json(rows);
    } else {
      // Trả về mảng rỗng cho các danh mục khác
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;