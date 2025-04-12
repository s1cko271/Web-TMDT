const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    // Lấy các tham số từ query string
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy, 
      sortOrder,
      featured,
      page = 1, 
      limit = 20 
    } = req.query;
    
    // Xây dựng câu truy vấn cơ bản
    let query = 'SELECT * FROM school_supplies WHERE 1=1';
    const queryParams = [];
    
    // Thêm điều kiện tìm kiếm theo tên sản phẩm
    if (search) {
      query += ' AND name LIKE ?';
      queryParams.push(`%${search}%`);
    }
    
    // Thêm điều kiện lọc theo danh mục
    if (category) {
      // Nếu category là ID (số)
      if (!isNaN(category)) {
        query += ' AND category_id = ?';
        queryParams.push(parseInt(category));
      } else {
        // Nếu category là tên danh mục (chuỗi)
        const [categoryResult] = await pool.query('SELECT id FROM categories WHERE name = ?', [category]);
        if (categoryResult && categoryResult.length > 0) {
          query += ' AND category_id = ?';
          queryParams.push(categoryResult[0].id);
        }
      }
    }
    
    // Thêm điều kiện lọc theo khoảng giá
    if (minPrice) {
      query += ' AND unit_price >= ?';
      queryParams.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query += ' AND unit_price <= ?';
      queryParams.push(parseFloat(maxPrice));
    }
    
    // Thêm điều kiện sắp xếp
    if (sortBy) {
      const validSortColumns = ['unit_price', 'name', 'stock_quantity'];
      const validSortOrders = ['asc', 'desc'];
      
      const column = validSortColumns.includes(sortBy) ? sortBy : 'id';
      const order = validSortOrders.includes(sortOrder?.toLowerCase()) ? sortOrder : 'asc';
      
      query += ` ORDER BY ${column} ${order}`;
    } else {
      // Mặc định sắp xếp theo ID
      query += ' ORDER BY id ASC';
    }
    
    // Thực hiện truy vấn
    const [rows] = await pool.query(query, queryParams);
    
    // Nếu yêu cầu sản phẩm nổi bật, chỉ trả về 4 sản phẩm đầu tiên
    if (featured === 'true') {
      return res.json(rows.slice(0, 4));
    }
    
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

// GET products by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    
    // Vì chưa có cột category trong bảng school_supplies, chúng ta sẽ giả định tất cả sản phẩm đều thuộc danh mục "School Supplies"
    if (category.toLowerCase() === 'school supplies') {
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

// POST create a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, image_url, unit_price, stock_quantity, status } = req.body;
    
    // Validate required fields
    if (!name || !unit_price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    const query = `
      INSERT INTO school_supplies 
      (name, description, image_url, unit_price, stock_quantity, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      name, 
      description || null, 
      image_url || null, 
      unit_price, 
      stock_quantity || 0, 
      status || 'Còn hàng'
    ]);
    
    res.status(201).json({ 
      id: result.insertId,
      name,
      description,
      image_url,
      unit_price,
      stock_quantity,
      status
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update a product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, unit_price, stock_quantity, status } = req.body;
    
    // Check if product exists
    const [existingProduct] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [id]);
    
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const query = `
      UPDATE school_supplies 
      SET name = ?, description = ?, image_url = ?, unit_price = ?, stock_quantity = ?, status = ? 
      WHERE id = ?
    `;
    
    await pool.query(query, [
      name || existingProduct[0].name, 
      description !== undefined ? description : existingProduct[0].description, 
      image_url !== undefined ? image_url : existingProduct[0].image_url, 
      unit_price !== undefined ? unit_price : existingProduct[0].unit_price, 
      stock_quantity !== undefined ? stock_quantity : existingProduct[0].stock_quantity, 
      status || existingProduct[0].status,
      id
    ]);
    
    // Get updated product
    const [updatedProduct] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [id]);
    
    res.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const [existingProduct] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [id]);
    
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await pool.query('DELETE FROM school_supplies WHERE id = ?', [id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;