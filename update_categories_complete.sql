-- Script SQL để cập nhật đầy đủ category_id cho các sản phẩm trong bảng school_supplies

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
SET [CATEGORY_FIELD] = (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng') 
WHERE name LIKE '%kẹp%' 
   OR name LIKE '%ghim%' 
   OR name LIKE '%bấm%' 
   OR name LIKE '%kéo%' 
   OR name LIKE '%dao%' 
   OR name LIKE '%băng keo%' 
   OR name LIKE '%giấy note%' 
   OR name LIKE '%giấy in%' 
   OR name LIKE '%file%' 
   OR name LIKE '%kệ%'
   OR name LIKE '%dập ghim%'
   OR name LIKE '%đục lỗ%'
   OR name LIKE '%kẹp bướm%'
   OR name LIKE '%kẹp gỗ%';

-- Cập nhật sản phẩm cho danh mục "Bút và Viết"
UPDATE school_supplies 
SET [CATEGORY_FIELD] = (SELECT id FROM categories WHERE name = 'Bút và Viết') 
WHERE name LIKE '%bút%' 
   OR name LIKE '%viết%' 
   OR name LIKE '%chì%' 
   OR name LIKE '%mực%' 
   OR name LIKE '%marker%' 
   OR name LIKE '%highlight%'
   OR name LIKE '%gel%'
   OR name LIKE '%bi%'
   OR name LIKE '%lông%'
   OR name LIKE '%xóa%'
   OR name LIKE '%dạ%';

-- Cập nhật sản phẩm cho danh mục "Dụng cụ Vẽ"
UPDATE school_supplies 
SET [CATEGORY_FIELD] = (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ') 
WHERE name LIKE '%màu%' 
   OR name LIKE '%vẽ%' 
   OR name LIKE '%cọ%' 
   OR name LIKE '%palette%' 
   OR name LIKE '%canvas%' 
   OR name LIKE '%giấy vẽ%' 
   OR name LIKE '%sơn%' 
   OR name LIKE '%bảng vẽ%'
   OR name LIKE '%chì màu%'
   OR name LIKE '%sáp màu%'
   OR name LIKE '%bút vẽ%'
   OR name LIKE '%màu nước%'
   OR name LIKE '%màu acrylic%';

-- Cập nhật sản phẩm cho danh mục "Dụng cụ Đo lường"
UPDATE school_supplies 
SET [CATEGORY_FIELD] = (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường') 
WHERE name LIKE '%thước%' 
   OR name LIKE '%compa%' 
   OR name LIKE '%ê-ke%' 
   OR name LIKE '%êke%' 
   OR name LIKE '%đo%' 
   OR name LIKE '%thước đo%' 
   OR name LIKE '%thước kẻ%'
   OR name LIKE '%thước dây%'
   OR name LIKE '%thước góc%'
   OR name LIKE '%thước tam giác%';

-- Cập nhật sản phẩm cho danh mục "Sổ và Giấy"
UPDATE school_supplies 
SET [CATEGORY_FIELD] = (SELECT id FROM categories WHERE name = 'Sổ và Giấy') 
WHERE name LIKE '%sổ%' 
   OR name LIKE '%vở%' 
   OR name LIKE '%tập%' 
   OR name LIKE '%nhật ký%' 
   OR name LIKE '%diary%' 
   OR name LIKE '%notebook%'
   OR name LIKE '%giấy%'
   OR name LIKE '%giấy note%'
   OR name LIKE '%giấy in%'
   OR name LIKE '%giấy photo%'
   OR name LIKE '%giấy màu%'
   OR name LIKE '%giấy kiểm tra%'
   OR name LIKE '%giấy kraft%';

-- Cập nhật sản phẩm cho danh mục "Phụ kiện Học tập"
UPDATE school_supplies 
SET [CATEGORY_FIELD] = (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập') 
WHERE name LIKE '%cặp%' 
   OR name LIKE '%túi%' 
   OR name LIKE '%balo%' 
   OR name LIKE '%hộp bút%' 
   OR name LIKE '%gọt%' 
   OR name LIKE '%tẩy%' 
   OR name LIKE '%bìa%'
   OR name LIKE '%ba lô%'
   OR name LIKE '%hộp đựng%'
   OR name LIKE '%thẻ%'
   OR name LIKE '%dây đeo%'
   OR name LIKE '%bảng tên%'
   OR name LIKE '%bảng ghi%';

-- Nếu có sản phẩm chưa được gán danh mục, gán vào danh mục "Khác"
UPDATE school_supplies 
SET [CATEGORY_FIELD] = (SELECT id FROM categories WHERE name = 'Khác') 
WHERE [CATEGORY_FIELD] IS NULL;

-- Kiểm tra sản phẩm chưa được gán danh mục
SELECT id, name FROM school_supplies WHERE [CATEGORY_FIELD] IS NULL;

-- Kiểm tra số lượng sản phẩm trong mỗi danh mục
SELECT c.name, COUNT(s.id) as count 
FROM categories c 
LEFT JOIN school_supplies s ON c.id = s.[CATEGORY_FIELD] 
GROUP BY c.id, c.name;