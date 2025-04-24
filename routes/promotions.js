const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { verifyAdmin } = require('../middleware/adminAuth');
const emailService = require('../utils/email');
const promotionMailer = require('../utils/promotion-mailer');

// Middleware xác thực admin cho tất cả các routes
router.use(verifyAdmin);

// GET danh sách tất cả khuyến mãi
router.get('/', async (req, res) => {
  try {
    const [promotions] = await pool.query(`
      SELECT * FROM promotions
      ORDER BY created_at DESC
    `);
    
    res.json(promotions);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST thêm khuyến mãi mới
router.post('/', async (req, res) => {
  try {
    const { title, description, discount_percent, start_date, end_date, code, is_active } = req.body;
    
    // Validate dữ liệu
    if (!title || !discount_percent || !code) {
      return res.status(400).json({ message: 'Tiêu đề, phần trăm giảm giá và mã khuyến mãi là bắt buộc' });
    }
    
    // Thêm khuyến mãi mới
    const [result] = await pool.query(`
      INSERT INTO promotions (title, description, discount_percent, start_date, end_date, code, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, description, discount_percent, start_date, end_date, code, is_active]);
    
    // Lấy thông tin khuyến mãi vừa thêm
    const [newPromotion] = await pool.query('SELECT * FROM promotions WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newPromotion[0]);
  } catch (error) {
    console.error('Lỗi khi thêm khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT cập nhật thông tin khuyến mãi
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, discount_percent, start_date, end_date, code, is_active } = req.body;
    
    // Kiểm tra khuyến mãi tồn tại
    const [existingPromotion] = await pool.query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (existingPromotion.length === 0) {
      return res.status(404).json({ message: 'Khuyến mãi không tồn tại' });
    }
    
    // Cập nhật thông tin khuyến mãi
    await pool.query(`
      UPDATE promotions
      SET title = ?, description = ?, discount_percent = ?, start_date = ?, end_date = ?, code = ?, is_active = ?
      WHERE id = ?
    `, [
      title || existingPromotion[0].title,
      description !== undefined ? description : existingPromotion[0].description,
      discount_percent || existingPromotion[0].discount_percent,
      start_date || existingPromotion[0].start_date,
      end_date || existingPromotion[0].end_date,
      code || existingPromotion[0].code,
      is_active !== undefined ? is_active : existingPromotion[0].is_active,
      id
    ]);
    
    // Lấy thông tin khuyến mãi đã cập nhật
    const [updatedPromotion] = await pool.query('SELECT * FROM promotions WHERE id = ?', [id]);
    
    res.json(updatedPromotion[0]);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE xóa khuyến mãi
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra khuyến mãi tồn tại
    const [existingPromotion] = await pool.query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (existingPromotion.length === 0) {
      return res.status(404).json({ message: 'Khuyến mãi không tồn tại' });
    }
    
    // Xóa khuyến mãi
    await pool.query('DELETE FROM promotions WHERE id = ?', [id]);
    
    res.json({ message: 'Khuyến mãi đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST gửi email khuyến mãi cho tất cả người dùng
router.post('/:id/send-emails', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra khuyến mãi tồn tại
    const [promotions] = await pool.query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (promotions.length === 0) {
      return res.status(404).json({ message: 'Khuyến mãi không tồn tại' });
    }
    
    const promotion = promotions[0];
    
    // Gửi email khuyến mãi cho tất cả người dùng
    const results = await promotionMailer.sendPromotionToAllUsers({
      title: promotion.title,
      description: promotion.description,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      code: promotion.code,
      url: `${req.protocol}://${req.get('host')}/products?promo=${promotion.code}`
    });
    
    res.json({
      message: `Đã gửi email khuyến mãi thành công cho ${results.length} người dùng`,
      sent_count: results.length
    });
  } catch (error) {
    console.error('Lỗi khi gửi email khuyến mãi:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;