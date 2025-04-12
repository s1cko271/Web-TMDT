-- Script SQL để cập nhật category_id cho các sản phẩm trong bảng school_supplies

-- Đầu tiên, kiểm tra xem trường category_id hay categories_id được sử dụng
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'school_supplies' 
AND COLUMN_NAME IN ('category_id', 'categories_id');

-- Lưu ý: Sử dụng kết quả từ truy vấn trên để xác định tên trường chính xác (category_id hoặc categories_id)
-- Trong các câu lệnh UPDATE bên dưới, thay thế [CATEGORY_FIELD] bằng tên trường chính xác

-- Cập nhật sản phẩm cho danh mục "Dụng cụ Văn phòng"
UPDATE school_supplies 
SET categories_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng') 
WHERE name LIKE '%kẹp%' 
   OR name LIKE '%ghim%' 
   OR name LIKE '%bấm%' 
   OR name LIKE '%thước%' 
   OR name LIKE '%kéo%' 
   OR name LIKE '%dao%' 
   OR name LIKE '%băng keo%' 
   OR name LIKE '%giấy note%' 
   OR name LIKE '%giấy in%' 
   OR name LIKE '%file%' 
   OR name LIKE '%kệ%';

-- Cập nhật sản phẩm cho danh mục "Bút và Viết"
UPDATE school_supplies 
SET categories_id = (SELECT id FROM categories WHERE name = 'Bút và Viết') 
WHERE name LIKE '%bút%' 
   OR name LIKE '%viết%' 
   OR name LIKE '%chì%' 
   OR name LIKE '%mực%' 
   OR name LIKE '%marker%' 
   OR name LIKE '%highlight%';

-- Cập nhật sản phẩm cho danh mục "Dụng cụ Vẽ"
UPDATE school_supplies 
SET categories_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ') 
WHERE name LIKE '%màu%' 
   OR name LIKE '%vẽ%' 
   OR name LIKE '%cọ%' 
   OR name LIKE '%palette%' 
   OR name LIKE '%canvas%' 
   OR name LIKE '%giấy vẽ%' 
   OR name LIKE '%sơn%' 
   OR name LIKE '%bảng vẽ%';

-- Cập nhật sản phẩm cho danh mục "Dụng cụ Đo lường"
UPDATE school_supplies 
SET categories_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường') 
WHERE name LIKE '%thước%' 
   OR name LIKE '%compa%' 
   OR name LIKE '%ê-ke%' 
   OR name LIKE '%êke%' 
   OR name LIKE '%đo%' 
   OR name LIKE '%thước đo%' 
   OR name LIKE '%thước kẻ%';

-- Cập nhật sản phẩm cho danh mục "Phụ kiện Học tập"
UPDATE school_supplies 
SET categories_id = (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập') 
WHERE name LIKE '%cặp%' 
   OR name LIKE '%túi%' 
   OR name LIKE '%balo%' 
   OR name LIKE '%hộp bút%' 
   OR name LIKE '%gọt%' 
   OR name LIKE '%tẩy%' 
   OR name LIKE '%bìa%' 
   OR name LIKE '%sổ%' 
   OR name LIKE '%vở%' 
   OR name LIKE '%tập%';

-- Nếu có sản phẩm chưa được gán danh mục, bạn có thể thêm một truy vấn để kiểm tra
SELECT id, name FROM school_supplies WHERE categories_id IS NULL;

-- Thêm một số sản phẩm mẫu nếu bảng school_supplies chưa có dữ liệu
-- Dụng cụ Văn phòng
INSERT INTO school_supplies (name, description, image_url, unit_price, stock_quantity, status, categories_id) VALUES
('Kẹp giấy kim loại', 'Kẹp giấy chất lượng cao, hộp 100 cái', '/images/sp1.jpg', 15000, 100, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng')),
('Ghim bấm số 10', 'Hộp ghim bấm 1000 cái', '/images/sp2.jpg', 12000, 150, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng')),
('Băng keo trong 2 mặt', 'Băng keo 2 mặt dán giấy, 15mm x 10m', '/images/sp3.jpg', 25000, 80, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng')),
('Giấy note 5 màu', 'Giấy ghi chú 5 màu, kích thước 76x76mm', '/images/sp4.jpg', 18000, 120, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng')),
('Kéo văn phòng', 'Kéo cắt giấy cỡ trung, lưỡi thép không gỉ', '/images/sp5.jpg', 35000, 60, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng'));

-- Bút và Viết
INSERT INTO school_supplies (name, description, image_url, unit_price, stock_quantity, status, categories_id) VALUES
('Bút bi Thiên Long', 'Bút bi xanh, đỏ, đen', '/images/sp6.jpg', 5000, 200, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Bút và Viết')),
('Bút gel màu', 'Bộ 10 bút gel nhiều màu', '/images/sp7.jpg', 45000, 70, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Bút và Viết')),
('Bút chì 2B', 'Bút chì gỗ 2B, hộp 12 cây', '/images/sp8.jpg', 30000, 90, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Bút và Viết')),
('Bút highlight pastel', 'Bộ 5 bút đánh dấu màu pastel', '/images/sp9.jpg', 40000, 85, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Bút và Viết')),
('Bút lông dầu', 'Bút lông dầu viết bảng, hộp 10 cây', '/images/sp10.jpg', 60000, 50, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Bút và Viết'));

-- Dụng cụ Vẽ
INSERT INTO school_supplies (name, description, image_url, unit_price, stock_quantity, status, categories_id) VALUES
('Bộ màu nước 12 màu', 'Hộp màu nước 12 màu kèm cọ', '/images/sp11.jpg', 75000, 40, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ')),
('Bộ cọ vẽ', 'Bộ 10 cọ vẽ các kích cỡ', '/images/sp12.jpg', 65000, 45, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ')),
('Giấy vẽ A4', 'Tập giấy vẽ A4 định lượng 200gsm, 20 tờ', '/images/sp13.jpg', 35000, 60, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ')),
('Bút chì màu', 'Hộp 24 bút chì màu cao cấp', '/images/sp14.jpg', 85000, 35, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ')),
('Palette màu', 'Khay pha màu 12 ô', '/images/sp15.jpg', 25000, 70, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ'));

-- Dụng cụ Đo lường
INSERT INTO school_supplies (name, description, image_url, unit_price, stock_quantity, status, categories_id) VALUES
('Thước kẻ 30cm', 'Thước nhựa trong suốt 30cm', '/images/sp16.jpg', 8000, 150, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường')),
('Compa học sinh', 'Compa kim loại kèm hộp đựng', '/images/sp17.jpg', 45000, 60, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường')),
('Bộ thước ê-ke', 'Bộ thước ê-ke, thước đo góc', '/images/sp18.jpg', 35000, 70, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường')),
('Thước đo độ', 'Thước đo độ bán nguyệt 180 độ', '/images/sp19.jpg', 12000, 100, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường')),
('Thước T', 'Thước T kỹ thuật 40cm', '/images/sp20.jpg', 55000, 40, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường'));

-- Phụ kiện Học tập
INSERT INTO school_supplies (name, description, image_url, unit_price, stock_quantity, status, categories_id) VALUES
('Balo học sinh', 'Balo chống thấm nước, nhiều ngăn', '/images/sp21.jpg', 250000, 30, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập')),
('Hộp bút nhựa', 'Hộp đựng bút viết trong suốt', '/images/sp22.jpg', 20000, 80, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập')),
('Tẩy 2 đầu', 'Tẩy 2 đầu xóa chì và mực', '/images/sp23.jpg', 7000, 150, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập')),
('Gọt bút chì', 'Gọt bút chì cầm tay có hộp đựng', '/images/sp24.jpg', 15000, 100, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập')),
('Vở ô ly 200 trang', 'Vở ô ly cao cấp 200 trang', '/images/sp25.jpg', 18000, 120, 'Còn hàng', (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập'));