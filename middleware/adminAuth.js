const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Middleware để xác thực và kiểm tra quyền admin
const verifyAdmin = async (req, res, next) => {
  // Lấy token từ header
  const token = req.header('x-auth-token');

  // Kiểm tra nếu không có token
  if (!token) {
    return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Lấy thông tin người dùng từ database
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }
    
    const user = users[0];
    
    // Kiểm tra nếu người dùng có quyền admin
    // Giả sử có trường is_admin trong bảng users
    // Nếu chưa có, sẽ cần thêm trường này vào bảng users
    if (!user.is_admin) {
      return res.status(403).json({ message: 'Quyền truy cập bị từ chối, yêu cầu quyền admin' });
    }
    
    // Thêm thông tin người dùng vào request
    req.user = user;
    next();
  } catch (error) {
    console.error('Lỗi xác thực admin:', error);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = { verifyAdmin };