/**
 * Email utility module
 * Provides functions for sending automated emails
 */

const nodemailer = require('nodemailer');

// Tạo transporter cho nodemailer
let transporter = null;

// Khởi tạo transporter với cấu hình từ biến môi trường
const initializeTransporter = () => {
  if (transporter) return transporter;
  
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
  
  return transporter;
};

// Gửi email đăng ký thành công
const sendRegistrationEmail = async (user) => {
  try {
    const transport = initializeTransporter();
    
    const mailOptions = {
      from: `"School Store" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Chào mừng bạn đến với School Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a4a4a;">Xin chào ${user.name},</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại School Store.</p>
          <p>Thông tin tài khoản của bạn:</p>
          <ul>
            <li>Tên: ${user.name}</li>
            <li>Email: ${user.email}</li>
          </ul>
          <p>Bạn có thể đăng nhập và bắt đầu mua sắm ngay bây giờ.</p>
          <p>Trân trọng,</p>
          <p>Đội ngũ School Store</p>
        </div>
      `
    };
    
    const info = await transport.sendMail(mailOptions);
    console.log('Email đăng ký đã được gửi: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Lỗi khi gửi email đăng ký:', error);
    throw error;
  }
};

// Gửi email xác nhận đơn hàng
const sendOrderConfirmationEmail = async (user, order, items) => {
  try {
    const transport = initializeTransporter();
    
    // Tạo danh sách sản phẩm trong đơn hàng
    let productList = '';
    let totalAmount = 0;
    
    items.forEach(item => {
      productList += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price.toLocaleString('vi-VN')} đ</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${(item.price * item.quantity).toLocaleString('vi-VN')} đ</td>
        </tr>
      `;
      totalAmount += item.price * item.quantity;
    });
    
    const mailOptions = {
      from: `"School Store" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Xác nhận đơn hàng của bạn',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a4a4a;">Xin chào ${user.name},</h2>
          <p>Cảm ơn bạn đã đặt hàng tại School Store. Đơn hàng của bạn đã được xác nhận.</p>
          <p><strong>Mã đơn hàng:</strong> #${order.id}</p>
          <p><strong>Ngày đặt hàng:</strong> ${new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
          
          <h3 style="color: #4a4a4a;">Chi tiết đơn hàng:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: left;">Sản phẩm</th>
                <th style="padding: 8px; text-align: center;">Số lượng</th>
                <th style="padding: 8px; text-align: right;">Đơn giá</th>
                <th style="padding: 8px; text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${productList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Tổng cộng:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">${totalAmount.toLocaleString('vi-VN')} đ</td>
              </tr>
            </tfoot>
          </table>
          
          <h3 style="color: #4a4a4a;">Thông tin giao hàng:</h3>
          <p><strong>Địa chỉ:</strong> ${user.address || 'Chưa cung cấp'}</p>
          <p><strong>Số điện thoại:</strong> ${user.phone || 'Chưa cung cấp'}</p>
          
          <p>Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi.</p>
          <p>Trân trọng,</p>
          <p>Đội ngũ School Store</p>
        </div>
      `
    };
    
    const info = await transport.sendMail(mailOptions);
    console.log('Email xác nhận đơn hàng đã được gửi: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Lỗi khi gửi email xác nhận đơn hàng:', error);
    throw error;
  }
};

// Gửi email thông báo khuyến mãi
const sendPromotionEmail = async (users, promotion) => {
  try {
    const transport = initializeTransporter();
    
    // Gửi email cho từng người dùng
    const results = await Promise.all(users.map(async (user) => {
      const mailOptions = {
        from: `"School Store" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: `Khuyến mãi đặc biệt: ${promotion.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a4a4a;">Xin chào ${user.name},</h2>
            <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px;">
              <h3 style="color: #e63946;">${promotion.title}</h3>
              <p>${promotion.description}</p>
              <p><strong>Thời gian áp dụng:</strong> ${new Date(promotion.start_date).toLocaleDateString('vi-VN')} - ${new Date(promotion.end_date).toLocaleDateString('vi-VN')}</p>
              ${promotion.code ? `<p><strong>Mã khuyến mãi:</strong> <span style="background-color: #e63946; color: white; padding: 3px 8px; border-radius: 3px;">${promotion.code}</span></p>` : ''}
              <a href="${promotion.url || '#'}" style="display: inline-block; background-color: #e63946; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Xem ngay</a>
            </div>
            <p style="margin-top: 20px;">Đừng bỏ lỡ cơ hội mua sắm với giá ưu đãi!</p>
            <p>Trân trọng,</p>
            <p>Đội ngũ School Store</p>
          </div>
        `
      };
      
      return transport.sendMail(mailOptions);
    }));
    
    console.log(`Đã gửi ${results.length} email khuyến mãi`);
    return results;
  } catch (error) {
    console.error('Lỗi khi gửi email khuyến mãi:', error);
    throw error;
  }
};

module.exports = {
  sendRegistrationEmail,
  sendOrderConfirmationEmail,
  sendPromotionEmail
};