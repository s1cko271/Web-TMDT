-- Tạo bảng promotions để lưu trữ thông tin khuyến mãi
CREATE TABLE IF NOT EXISTS promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_percent DECIMAL(5,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Thêm một số dữ liệu mẫu
INSERT INTO promotions (title, description, discount_percent, start_date, end_date, code, is_active)
VALUES
('Khuyến mãi mùa tựu trường', 'Giảm giá 15% cho tất cả sản phẩm văn phòng phẩm', 15.00, '2023-08-01', '2023-09-15', 'BACKTOSCHOOL', TRUE),
('Khuyến mãi cuối năm', 'Giảm giá 20% cho đơn hàng trên 500.000đ', 20.00, '2023-12-01', '2023-12-31', 'YEAREND', TRUE),
('Khuyến mãi thành viên mới', 'Giảm giá 10% cho đơn hàng đầu tiên', 10.00, '2023-01-01', '2023-12-31', 'NEWMEMBER', TRUE);