/**
 * Promotion Mailer Utility
 * Script để gửi email thông báo khuyến mãi cho người dùng
 */

const { pool } = require('../config/db');
const emailService = require('./email');

/**
 * Gửi email thông báo khuyến mãi cho tất cả người dùng
 * @param {Object} promotion - Thông tin khuyến mãi
 * @param {string} promotion.title - Tiêu đề khuyến mãi
 * @param {string} promotion.description - Mô tả khuyến mãi
 * @param {string} promotion.start_date - Ngày bắt đầu khuyến mãi
 * @param {string} promotion.end_date - Ngày kết thúc khuyến mãi
 * @param {string} [promotion.code] - Mã khuyến mãi (nếu có)
 * @param {string} [promotion.url] - Đường dẫn đến trang khuyến mãi
 * @returns {Promise<Array>} - Kết quả gửi email
 */
async function sendPromotionToAllUsers(promotion) {
  try {
    // Lấy danh sách tất cả người dùng
    const [users] = await pool.query('SELECT id, name, email FROM users');
    
    if (users.length === 0) {
      console.log('Không có người dùng nào trong hệ thống');
      return [];
    }
    
    console.log(`Bắt đầu gửi email khuyến mãi cho ${users.length} người dùng...`);
    
    // Gửi email cho tất cả người dùng
    const results = await emailService.sendPromotionEmail(users, promotion);
    
    console.log(`Đã gửi thành công ${results.length} email khuyến mãi`);
    return results;
  } catch (error) {
    console.error('Lỗi khi gửi email khuyến mãi:', error);
    throw error;
  }
}

/**
 * Gửi email thông báo khuyến mãi cho người dùng đã mua sản phẩm trong danh mục cụ thể
 * @param {Object} promotion - Thông tin khuyến mãi
 * @param {number} categoryId - ID của danh mục sản phẩm
 * @returns {Promise<Array>} - Kết quả gửi email
 */
async function sendPromotionByCategoryPurchase(promotion, categoryId) {
  try {
    // Lấy danh sách người dùng đã mua sản phẩm trong danh mục
    const [users] = await pool.query(`
      SELECT DISTINCT u.id, u.name, u.email 
      FROM users u
      JOIN orders o ON u.id = o.user_id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN school_supplies p ON oi.product_id = p.id
      WHERE p.category_id = ?
    `, [categoryId]);
    
    if (users.length === 0) {
      console.log(`Không có người dùng nào đã mua sản phẩm trong danh mục ID ${categoryId}`);
      return [];
    }
    
    console.log(`Bắt đầu gửi email khuyến mãi cho ${users.length} người dùng đã mua sản phẩm trong danh mục ID ${categoryId}...`);
    
    // Gửi email cho người dùng đã lọc
    const results = await emailService.sendPromotionEmail(users, promotion);
    
    console.log(`Đã gửi thành công ${results.length} email khuyến mãi theo danh mục`);
    return results;
  } catch (error) {
    console.error('Lỗi khi gửi email khuyến mãi theo danh mục:', error);
    throw error;
  }
}

/**
 * Gửi email thông báo khuyến mãi cho người dùng chưa mua sắm trong khoảng thời gian
 * @param {Object} promotion - Thông tin khuyến mãi
 * @param {number} days - Số ngày không hoạt động
 * @returns {Promise<Array>} - Kết quả gửi email
 */
async function sendPromotionToInactiveUsers(promotion, days) {
  try {
    // Lấy danh sách người dùng không hoạt động
    const [users] = await pool.query(`
      SELECT u.id, u.name, u.email 
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
      WHERE o.id IS NULL
    `, [days]);
    
    if (users.length === 0) {
      console.log(`Không có người dùng nào không hoạt động trong ${days} ngày qua`);
      return [];
    }
    
    console.log(`Bắt đầu gửi email khuyến mãi cho ${users.length} người dùng không hoạt động...`);
    
    // Gửi email cho người dùng không hoạt động
    const results = await emailService.sendPromotionEmail(users, promotion);
    
    console.log(`Đã gửi thành công ${results.length} email khuyến mãi cho người dùng không hoạt động`);
    return results;
  } catch (error) {
    console.error('Lỗi khi gửi email khuyến mãi cho người dùng không hoạt động:', error);
    throw error;
  }
}

module.exports = {
  sendPromotionToAllUsers,
  sendPromotionByCategoryPurchase,
  sendPromotionToInactiveUsers
};