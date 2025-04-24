-- Script SQL để thêm trường is_admin vào bảng users và thiết lập tài khoản admin

-- Kiểm tra xem trường is_admin đã tồn tại trong bảng users chưa
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'is_admin';

-- Thêm trường is_admin nếu chưa tồn tại
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Tạo tài khoản admin mẫu nếu chưa tồn tại
INSERT INTO users (name, email, password, is_admin)
SELECT 'Admin', 'admin@schoolstore.com', '$2a$10$XDCGMn0aFj1Hc6Ama9Pb8.N.rZNXNNZwVHt5JvwzYrGJ.z1XoVMJK', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@schoolstore.com');

-- Cập nhật quyền admin cho tài khoản admin
UPDATE users
SET is_admin = TRUE
WHERE email = 'admin@schoolstore.com';

-- Kiểm tra tài khoản admin
SELECT id, name, email, is_admin FROM users WHERE is_admin = TRUE;