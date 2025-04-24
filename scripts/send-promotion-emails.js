/**
 * Script gửi email khuyến mãi
 * Sử dụng để chạy theo lịch trình (cron job) hoặc thủ công
 */

require('dotenv').config();
const promotionMailer = require('../utils/promotion-mailer');

// Thông tin khuyến mãi mẫu
const samplePromotion = {
  title: 'Khuyến mãi đặc biệt tháng này',
  description: 'Giảm giá 20% cho tất cả sản phẩm văn phòng phẩm từ ngày 15-30 hàng tháng.',
  start_date: new Date(),
  end_date: new Date(new Date().setDate(new Date().getDate() + 15)),
  code: 'SCHOOL20',
  url: 'http://localhost:5000/promotions'
};

/**
 * Hàm chính để gửi email khuyến mãi
 */
async function sendPromotionEmails() {
  try {
    console.log('Bắt đầu gửi email khuyến mãi...');
    
    // Gửi cho tất cả người dùng
    await promotionMailer.sendPromotionToAllUsers(samplePromotion);
    
    // Hoặc gửi cho người dùng đã mua sản phẩm trong danh mục cụ thể (ví dụ: danh mục ID 1)
    // await promotionMailer.sendPromotionByCategoryPurchase(samplePromotion, 1);
    
    // Hoặc gửi cho người dùng không hoạt động trong 30 ngày qua
    // await promotionMailer.sendPromotionToInactiveUsers(samplePromotion, 30);
    
    console.log('Hoàn thành gửi email khuyến mãi!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi gửi email khuyến mãi:', error);
    process.exit(1);
  }
}

// Chạy hàm chính
sendPromotionEmails();