const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET all categories
router.get('/', async (req, res) => {
  try {
    // Lấy danh sách các danh mục từ cơ sở dữ liệu
    const [categories] = await pool.query('SELECT id, name, description, image_url FROM categories');
    
    if (!categories || categories.length === 0) {
      // Trả về mảng rỗng nếu không có danh mục
      return res.json([]);
    }
    
    // Sử dụng trường category_id vì đã được xác nhận trong update_categories_execute.js
    const categoryField = 'category_id';
    let hasValidCategoryField = true;
    
    try {
      // Thử truy vấn với category_id
      await pool.query('SELECT 1 FROM school_supplies WHERE category_id = ? LIMIT 1', [1]);
    } catch (err) {
      if (err.message.includes('Unknown column') || err.message.includes('doesn\'t exist')) {
        // Nếu không tồn tại trường hoặc bảng không tồn tại
        hasValidCategoryField = false;
        console.error('Error: category_id field not found in school_supplies table');
      }
    }
    
    // Nếu không có trường hợp lệ, trả về danh mục không có số lượng sản phẩm
    if (!hasValidCategoryField) {
      const simpleCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image_url,
        count: 0
      }));
      return res.json(simpleCategories);
    }
    
    // Đếm số lượng sản phẩm trong mỗi danh mục với tên cột đúng
    const categoriesWithCount = await Promise.all(categories.map(async (category) => {
      try {
        const [products] = await pool.query(`SELECT COUNT(*) as count FROM school_supplies WHERE ${categoryField} = ?`, [category.id]);
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          image: category.image_url,
          count: products[0].count
        };
      } catch (err) {
        // Nếu có lỗi khi đếm sản phẩm, trả về count = 0
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          image: category.image_url,
          count: 0
        };
      }
    }));
    
    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    // Trả về mảng rỗng thay vì lỗi 500 để tránh lỗi hiển thị trên frontend
    res.json([]);
  }
});

// GET products by category
router.get('/:categoryName/products', async (req, res) => {
  try {
    const categoryName = decodeURIComponent(req.params.categoryName);
    console.log('Fetching products for category:', categoryName);
    
    // Tìm category_id dựa trên tên danh mục
    const [category] = await pool.query('SELECT id FROM categories WHERE name = ?', [categoryName]);
    
    if (category && category.length > 0) {
      const categoryId = category[0].id;
      
      // Sử dụng trường category_id vì đã được xác nhận trong update_categories_execute.js
      const categoryField = 'category_id';
      let hasValidCategoryField = true;
      
      try {
        // Thử truy vấn với category_id
        await pool.query('SELECT 1 FROM school_supplies WHERE category_id = ? LIMIT 1', [1]);
      } catch (err) {
        if (err.message.includes('Unknown column') || err.message.includes('doesn\'t exist')) {
          // Nếu không tồn tại trường hoặc bảng không tồn tại
          hasValidCategoryField = false;
          console.error('Error: category_id field not found in school_supplies table');
        }
      }
      
      if (!hasValidCategoryField) {
        // Trả về mảng rỗng nếu không có trường hợp lệ
        return res.json([]);
      }
      
      try {
        console.log(`Executing query: SELECT * FROM school_supplies WHERE ${categoryField} = ${categoryId}`);
        const [products] = await pool.query(`SELECT * FROM school_supplies WHERE ${categoryField} = ?`, [categoryId]);
        console.log(`Found ${products.length} products for category ID ${categoryId}`);
        res.json(products);
      } catch (err) {
        console.error('Error querying products:', err.message);
        res.json([]);
      }
    } else {
      // Trả về mảng rỗng nếu không tìm thấy danh mục
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    // Trả về mảng rỗng thay vì lỗi 500 để tránh lỗi hiển thị trên frontend
    res.json([]);
  }
});

// GET products by category ID
router.get('/id/:categoryId/products', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    
    // Sử dụng trực tiếp trường category_id vì đã được xác nhận trong update_categories_execute.js
    const categoryField = 'category_id';
    let hasValidCategoryField = true;
    
    try {
      // Thử truy vấn với category_id
      await pool.query('SELECT 1 FROM school_supplies WHERE category_id = ? LIMIT 1', [1]);
    } catch (err) {
      if (err.message.includes('Unknown column') || err.message.includes('doesn\'t exist')) {
        // Nếu không tồn tại trường hoặc bảng không tồn tại
        console.error('Error: category_id field not found in school_supplies table');
        hasValidCategoryField = false;
      }
    }
    
    if (!hasValidCategoryField) {
      // Trả về mảng rỗng nếu không có trường hợp lệ
      return res.json([]);
    }
    
    try {
      console.log(`Attempting to fetch products for category ID: ${categoryId} using field: ${categoryField}`);
      const [products] = await pool.query(`SELECT * FROM school_supplies WHERE ${categoryField} = ?`, [categoryId]);
      console.log(`Found ${products.length} products for category ID ${categoryId}`);
      res.json(products);
    } catch (err) {
      console.error('Error querying products:', err.message);
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching products by category ID:', error.message);
    // Trả về mảng rỗng thay vì lỗi 500 để tránh lỗi hiển thị trên frontend
    res.json([]);
  }
});

module.exports = router;