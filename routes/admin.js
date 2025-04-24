const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { verifyAdmin } = require('../middleware/adminAuth');
const emailService = require('../utils/email');
const promotionMailer = require('../utils/promotion-mailer');
const promotionsRouter = require('./promotions');

// Middleware xác thực admin cho tất cả các routes
router.use(verifyAdmin);

// Sử dụng router khuyến mãi
router.use('/promotions', promotionsRouter);

// GET thống kê tổng quan cho dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Lấy tổng số người dùng
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    
    // Lấy tổng số sản phẩm
    const [productCount] = await pool.query('SELECT COUNT(*) as count FROM school_supplies');
    
    // Lấy tổng số đơn hàng
    const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
    
    // Lấy tổng doanh thu
    const [revenue] = await pool.query('SELECT SUM(total_amount) as total FROM orders');
    
    // Lấy 5 sản phẩm bán chạy nhất
    const [topProducts] = await pool.query(`
      SELECT p.id, p.name, p.unit_price, SUM(oi.quantity) as total_sold
      FROM school_supplies p
      JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    
    // Lấy 5 đơn hàng gần nhất
    const [recentOrders] = await pool.query(`
      SELECT o.id, o.user_id, u.name as user_name, o.total_amount, o.status, o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);
    
    res.json({
      userCount: userCount[0].count,
      productCount: productCount[0].count,
      orderCount: orderCount[0].count,
      revenue: revenue[0].total || 0,
      topProducts,
      recentOrders
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê dashboard:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET danh sách tất cả người dùng
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT id, name, email, address, phone, is_admin, created_at, updated_at 
      FROM users
      ORDER BY created_at DESC
    `);
    
    res.json(users);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT cập nhật thông tin người dùng (bao gồm quyền admin)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, phone, is_admin } = req.body;
    
    // Kiểm tra người dùng tồn tại
    const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    
    // Cập nhật thông tin người dùng
    await pool.query(`
      UPDATE users
      SET name = ?, email = ?, address = ?, phone = ?, is_admin = ?
      WHERE id = ?
    `, [
      name || existingUser[0].name,
      email || existingUser[0].email,
      address !== undefined ? address : existingUser[0].address,
      phone !== undefined ? phone : existingUser[0].phone,
      is_admin !== undefined ? is_admin : existingUser[0].is_admin,
      id
    ]);
    
    // Lấy thông tin người dùng đã cập nhật
    const [updatedUser] = await pool.query(
      'SELECT id, name, email, address, phone, is_admin, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    
    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE xóa người dùng
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra người dùng tồn tại
    const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    
    // Xóa người dùng
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ message: 'Người dùng đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET danh sách tất cả sản phẩm
router.get('/products', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM school_supplies p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id ASC
    `);
    
    res.json(products);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST thêm sản phẩm mới
router.post('/products', async (req, res) => {
  try {
    const { name, description, unit_price, stock_quantity, category_id, image_url } = req.body;
    
    // Validate dữ liệu
    if (!name || !unit_price) {
      return res.status(400).json({ message: 'Tên và giá sản phẩm là bắt buộc' });
    }
    
    // Thêm sản phẩm mới
    const [result] = await pool.query(`
      INSERT INTO school_supplies (name, description, unit_price, stock_quantity, category_id, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, description, unit_price, stock_quantity || 0, category_id, image_url]);
    
    // Lấy thông tin sản phẩm vừa thêm
    const [newProduct] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT cập nhật thông tin sản phẩm
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, unit_price, stock_quantity, category_id, image_url } = req.body;
    
    // Kiểm tra sản phẩm tồn tại
    const [existingProduct] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    // Cập nhật thông tin sản phẩm
    await pool.query(`
      UPDATE school_supplies
      SET name = ?, description = ?, unit_price = ?, stock_quantity = ?, category_id = ?, image_url = ?
      WHERE id = ?
    `, [
      name || existingProduct[0].name,
      description !== undefined ? description : existingProduct[0].description,
      unit_price || existingProduct[0].unit_price,
      stock_quantity !== undefined ? stock_quantity : existingProduct[0].stock_quantity,
      category_id || existingProduct[0].category_id,
      image_url || existingProduct[0].image_url,
      id
    ]);
    
    // Lấy thông tin sản phẩm đã cập nhật
    const [updatedProduct] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [id]);
    
    res.json(updatedProduct[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE xóa sản phẩm
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra sản phẩm tồn tại
    const [existingProduct] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [id]);
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    // Xóa sản phẩm
    await pool.query('DELETE FROM school_supplies WHERE id = ?', [id]);
    
    res.json({ message: 'Sản phẩm đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET danh sách tất cả danh mục
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST thêm danh mục mới
router.post('/categories', async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    
    // Validate dữ liệu
    if (!name) {
      return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
    }
    
    // Thêm danh mục mới
    const [result] = await pool.query(`
      INSERT INTO categories (name, description, image_url)
      VALUES (?, ?, ?)
    `, [name, description, image_url]);
    
    // Lấy thông tin danh mục vừa thêm
    const [newCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error('Lỗi khi thêm danh mục:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT cập nhật thông tin danh mục
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    
    // Kiểm tra danh mục tồn tại
    const [existingCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existingCategory.length === 0) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }
    
    // Cập nhật thông tin danh mục
    await pool.query(`
      UPDATE categories
      SET name = ?, description = ?, image_url = ?
      WHERE id = ?
    `, [
      name || existingCategory[0].name,
      description !== undefined ? description : existingCategory[0].description,
      image_url || existingCategory[0].image_url,
      id
    ]);
    
    // Lấy thông tin danh mục đã cập nhật
    const [updatedCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    
    res.json(updatedCategory[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin danh mục:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE xóa danh mục
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra danh mục tồn tại
    const [existingCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existingCategory.length === 0) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }
    
    // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
    const [products] = await pool.query('SELECT COUNT(*) as count FROM school_supplies WHERE category_id = ?', [id]);
    if (products[0].count > 0) {
      return res.status(400).json({ 
        message: 'Không thể xóa danh mục này vì có sản phẩm thuộc danh mục này',
        count: products[0].count
      });
    }
    
    // Xóa danh mục
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    
    res.json({ message: 'Danh mục đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET danh sách tất cả đơn hàng
router.get('/orders', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET chi tiết đơn hàng
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Lấy thông tin đơn hàng
    const [orders] = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email, u.address as user_address, u.phone as user_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    
    // Lấy chi tiết các sản phẩm trong đơn hàng
    const [orderItems] = await pool.query(`
      SELECT oi.*, p.name, p.unit_price, p.image_url
      FROM order_items oi
      JOIN school_supplies p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    
    res.json({
      order: orders[0],
      items: orderItems
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT cập nhật trạng thái đơn hàng
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate dữ liệu
    if (!status) {
      return res.status(400).json({ message: 'Trạng thái đơn hàng là bắt buộc' });
    }
    
    // Kiểm tra đơn hàng tồn tại
    const [existingOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (existingOrder.length === 0) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    
    // Cập nhật trạng thái đơn hàng
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    
    // Lấy thông tin đơn hàng đã cập nhật
    const [updatedOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    
    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST gửi email khuyến mãi cho tất cả người dùng
router.post('/promotions/send-all', async (req, res) => {
  try {
    const { title, description, start_date, end_date, code, url } = req.body;
    
    // Validate dữ liệu
    if (!title || !description) {
      return res.status(400).json({ message: 'Tiêu đề và nội dung khuyến mãi là bắt buộc' });
    }
    
    // Tạo đối tượng khuyến mãi
    const promotion = {
      title,
      description,
      start_date,
      end_date,
      code,
      url
    };
    
    // Gửi email khuyến mãi cho tất cả người dùng
    const results = await promotionMailer.sendPromotionToAllUsers(promotion);
    
    res.json({
      message: `Đã gửi email khuyến mãi thành công cho ${results.length} người dùng`,
      sent_count: results.length
    });
  } catch (error) {
    console.error('Lỗi khi gửi email khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST gửi email khuyến mãi cho người dùng theo danh mục
router.post('/promotions/send-by-category', async (req, res) => {
  try {
    const { title, description, start_date, end_date, code, url, category_id } = req.body;
    
    // Validate dữ liệu
    if (!title || !description || !category_id) {
      return res.status(400).json({ message: 'Tiêu đề, nội dung khuyến mãi và ID danh mục là bắt buộc' });
    }
    
    // Tạo đối tượng khuyến mãi
    const promotion = {
      title,
      description,
      start_date,
      end_date,
      code,
      url
    };
    
    // Gửi email khuyến mãi cho người dùng theo danh mục
    const results = await promotionMailer.sendPromotionByCategoryPurchase(promotion, category_id);
    
    res.json({
      message: `Đã gửi email khuyến mãi thành công cho ${results.length} người dùng theo danh mục`,
      sent_count: results.length
    });
  } catch (error) {
    console.error('Lỗi khi gửi email khuyến mãi theo danh mục:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;