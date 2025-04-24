const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const emailService = require('../utils/email');

// Tạo bảng carts và cart_items nếu chưa tồn tại
async function setupCartTables() {
  try {
    // Tạo bảng carts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (user_id)
      )
    `);

    // Tạo bảng cart_items
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES school_supplies(id) ON DELETE CASCADE,
        UNIQUE KEY (cart_id, product_id),
        INDEX (cart_id),
        INDEX (product_id)
      )
    `);

    console.log('Cart tables setup completed');
  } catch (error) {
    console.error('Error setting up cart tables:', error.message);
  }
}

// Gọi hàm setup khi khởi động server
setupCartTables();

// GET cart items for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm hoặc tạo giỏ hàng cho người dùng
    let [cart] = await pool.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    
    if (cart.length === 0) {
      // Nếu không có giỏ hàng, tạo mới
      const [result] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      const cartId = result.insertId;
      [cart] = await pool.query('SELECT * FROM carts WHERE id = ?', [cartId]);
    }

    const cartId = cart[0].id;

    // Lấy các sản phẩm trong giỏ hàng với thông tin chi tiết
    const [cartItems] = await pool.query(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.image_url, p.unit_price, p.stock_quantity, p.status
      FROM cart_items ci
      JOIN school_supplies p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cartId]);

    res.json({
      id: cartId,
      user_id: parseInt(userId),
      items: cartItems.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        image_url: item.image_url,
        price: item.unit_price,
        quantity: item.quantity,
        stock: item.stock_quantity,
        status: item.status
      })),
      created_at: cart[0].created_at,
      updated_at: cart[0].updated_at
    });
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add item to cart
router.post('/:userId/items', async (req, res) => {
  try {
    const { userId } = req.params;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Kiểm tra sản phẩm tồn tại
    const [product] = await pool.query('SELECT * FROM school_supplies WHERE id = ?', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Tìm hoặc tạo giỏ hàng cho người dùng
    let [cart] = await pool.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    let cartId;

    if (cart.length === 0) {
      // Nếu không có giỏ hàng, tạo mới
      const [result] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cartId = result.insertId;
    } else {
      cartId = cart[0].id;
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const [existingItem] = await pool.query(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, product_id]
    );

    if (existingItem.length > 0) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      const newQuantity = existingItem[0].quantity + quantity;
      await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItem[0].id]
      );
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, product_id, quantity]
      );
    }

    // Lấy thông tin giỏ hàng đã cập nhật
    const [updatedCartItems] = await pool.query(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.image_url, p.unit_price, p.stock_quantity, p.status
      FROM cart_items ci
      JOIN school_supplies p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cartId]);

    res.status(201).json({
      id: cartId,
      user_id: parseInt(userId),
      items: updatedCartItems.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        image_url: item.image_url,
        price: item.unit_price,
        quantity: item.quantity,
        stock: item.stock_quantity,
        status: item.status
      }))
    });
  } catch (error) {
    console.error('Error adding item to cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update cart item quantity
router.put('/:userId/items/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    // Kiểm tra giỏ hàng của người dùng
    const [cart] = await pool.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (cart.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Kiểm tra item trong giỏ hàng
    const [cartItem] = await pool.query(
      'SELECT * FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cart[0].id]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Cập nhật số lượng
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, itemId]
    );

    // Lấy thông tin giỏ hàng đã cập nhật
    const [updatedCartItems] = await pool.query(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.image_url, p.unit_price, p.stock_quantity, p.status
      FROM cart_items ci
      JOIN school_supplies p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cart[0].id]);

    res.json({
      id: cart[0].id,
      user_id: parseInt(userId),
      items: updatedCartItems.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        image_url: item.image_url,
        price: item.unit_price,
        quantity: item.quantity,
        stock: item.stock_quantity,
        status: item.status
      }))
    });
  } catch (error) {
    console.error('Error updating cart item:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE remove item from cart
router.delete('/:userId/items/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    // Kiểm tra giỏ hàng của người dùng
    const [cart] = await pool.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (cart.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Kiểm tra item trong giỏ hàng
    const [cartItem] = await pool.query(
      'SELECT * FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cart[0].id]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Xóa item khỏi giỏ hàng
    await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);

    // Lấy thông tin giỏ hàng đã cập nhật
    const [updatedCartItems] = await pool.query(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.image_url, p.unit_price, p.stock_quantity, p.status
      FROM cart_items ci
      JOIN school_supplies p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cart[0].id]);

    res.json({
      id: cart[0].id,
      user_id: parseInt(userId),
      items: updatedCartItems.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        image_url: item.image_url,
        price: item.unit_price,
        quantity: item.quantity,
        stock: item.stock_quantity,
        status: item.status
      }))
    });
  } catch (error) {
    console.error('Error removing item from cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE clear cart
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra giỏ hàng của người dùng
    const [cart] = await pool.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (cart.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Xóa tất cả items trong giỏ hàng
    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cart[0].id]);

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;