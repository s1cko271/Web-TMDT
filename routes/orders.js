const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const emailService = require('../utils/email');

// Tạo bảng orders và order_items nếu chưa tồn tại
async function setupOrderTables() {
  try {
    // Tạo bảng orders
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
        shipping_address TEXT,
        shipping_phone VARCHAR(20),
        payment_method VARCHAR(50),
        payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX (user_id),
        INDEX (status),
        INDEX (payment_status)
      )
    `);

    // Tạo bảng order_items
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES school_supplies(id),
        INDEX (order_id),
        INDEX (product_id)
      )
    `);

    console.log('Order tables setup completed');
  } catch (error) {
    console.error('Error setting up order tables:', error.message);
  }
}

// Gọi hàm setup khi khởi động server
setupOrderTables();

// POST tạo đơn hàng mới
router.post('/', verifyToken, async (req, res) => {
  try {
    const { user_id, items, shipping_address, shipping_phone, payment_method } = req.body;

    // Validate required fields
    if (!user_id || !items || items.length === 0) {
      return res.status(400).json({ message: 'User ID and items are required' });
    }

    // Kiểm tra người dùng tồn tại
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tính tổng tiền đơn hàng
    let totalAmount = 0;
    const orderItems = [];

    // Lấy thông tin sản phẩm và tính tổng tiền
    for (const item of items) {
      const [product] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [item.product_id]);
      if (product.length === 0) {
        return res.status(404).json({ message: `Product with ID ${item.product_id} not found` });
      }

      const productData = product[0];
      const itemTotal = productData.unit_price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: productData.unit_price,
        name: productData.name,
        price: productData.unit_price
      });
    }

    // Tạo đơn hàng mới
    const [orderResult] = await pool.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, shipping_phone, payment_method)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, totalAmount, shipping_address, shipping_phone, payment_method]
    );

    const orderId = orderResult.insertId;

    // Thêm các sản phẩm vào đơn hàng
    for (const item of orderItems) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.unit_price]
      );
    }

    // Lấy thông tin đơn hàng đã tạo
    const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);

    // Gửi email xác nhận đơn hàng
    try {
      await emailService.sendOrderConfirmationEmail(user[0], order[0], orderItems);
      console.log(`Email xác nhận đơn hàng đã được gửi đến ${user[0].email}`);
    } catch (emailError) {
      console.error('Không thể gửi email xác nhận đơn hàng:', emailError);
      // Không trả về lỗi cho người dùng, chỉ ghi log lỗi
    }

    // Xóa giỏ hàng sau khi đặt hàng thành công
    try {
      const [cart] = await pool.query('SELECT * FROM carts WHERE user_id = ?', [user_id]);
      if (cart.length > 0) {
        await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);
      }
    } catch (cartError) {
      console.error('Lỗi khi xóa giỏ hàng:', cartError.message);
    }

    res.status(201).json({
      id: orderId,
      user_id,
      total_amount: totalAmount,
      status: order[0].status,
      shipping_address,
      shipping_phone,
      payment_method,
      payment_status: order[0].payment_status,
      created_at: order[0].created_at,
      items: orderItems
    });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET lấy danh sách đơn hàng của người dùng
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra người dùng tồn tại
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Lấy danh sách đơn hàng
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    // Lấy chi tiết từng đơn hàng
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.query(`
        SELECT oi.*, p.name, p.image_url
        FROM order_items oi
        JOIN school_supplies p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);

      return {
        ...order,
        items: items.map(item => ({
          id: item.id,
          product_id: item.product_id,
          name: item.name,
          image_url: item.image_url,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.quantity * item.unit_price
        }))
      };
    }));

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching user orders:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET lấy chi tiết đơn hàng
router.get('/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Lấy thông tin đơn hàng
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Lấy thông tin người dùng
    const [users] = await pool.query('SELECT id, name, email, address, phone FROM users WHERE id = ?', [order.user_id]);
    const user = users[0];

    // Lấy chi tiết các sản phẩm trong đơn hàng
    const [items] = await pool.query(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN school_supplies p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    res.json({
      ...order,
      user,
      items: items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        image_url: item.image_url,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price
      }))
    });
  } catch (error) {
    console.error('Error fetching order details:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT cập nhật trạng thái đơn hàng
router.put('/:orderId/status', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    // Kiểm tra đơn hàng tồn tại
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Cập nhật trạng thái đơn hàng
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

    // Lấy thông tin đơn hàng đã cập nhật
    const [updatedOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);

    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT cập nhật trạng thái thanh toán
router.put('/:orderId/payment', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { payment_status } = req.body;

    if (!payment_status || !['pending', 'paid', 'failed'].includes(payment_status)) {
      return res.status(400).json({ message: 'Valid payment status is required' });
    }

    // Kiểm tra đơn hàng tồn tại
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Cập nhật trạng thái thanh toán
    await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, orderId]);

    // Lấy thông tin đơn hàng đã cập nhật
    const [updatedOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);

    // Nếu thanh toán thành công, gửi email xác nhận
    if (payment_status === 'paid' && orders[0].payment_status !== 'paid') {
      try {
        // Lấy thông tin người dùng
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [updatedOrder[0].user_id]);
        const user = users[0];

        // Lấy thông tin các sản phẩm trong đơn hàng
        const [items] = await pool.query(`
          SELECT oi.*, p.name
          FROM order_items oi
          JOIN school_supplies p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [orderId]);

        const orderItems = items.map(item => ({
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          price: item.unit_price
        }));

        // Gửi email xác nhận thanh toán
        await emailService.sendOrderConfirmationEmail(user, updatedOrder[0], orderItems);
        console.log(`Email xác nhận thanh toán đã được gửi đến ${user.email}`);
      } catch (emailError) {
        console.error('Không thể gửi email xác nhận thanh toán:', emailError);
      }
    }

    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating payment status:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;