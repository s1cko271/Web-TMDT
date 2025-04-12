-- Script SQL để cập nhật category_id cho các sản phẩm trong bảng school_supplies

-- Đầu tiên, kiểm tra xem trường category_id hay categories_id được sử dụng
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'school_supplies' 
AND COLUMN_NAME IN ('category_id', 'categories_id');

-- Lưu ý: Sử dụng kết quả từ truy vấn trên để xác định tên trường chính xác (category_id hoặc categories_id)
-- Trong các câu lệnh UPDATE bên dưới, đã thay thế [CATEGORY_FIELD] bằng category_id

-- Cập nhật sản phẩm cho danh mục "Dụng cụ Văn phòng"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng') 
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
SET category_id = (SELECT id FROM categories WHERE name = 'Bút và Viết') 
WHERE name LIKE '%bút%' 
   OR name LIKE '%viết%' 
   OR name LIKE '%chì%' 
   OR name LIKE '%mực%' 
   OR name LIKE '%marker%' 
   OR name LIKE '%highlight%';

-- Cập nhật sản phẩm cho danh mục "Sổ và Vở"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Sổ và Vở') 
WHERE name LIKE '%sổ%' 
   OR name LIKE '%vở%' 
   OR name LIKE '%tập%' 
   OR name LIKE '%nhật ký%' 
   OR name LIKE '%diary%' 
   OR name LIKE '%notebook%';

-- Cập nhật sản phẩm cho danh mục "Đồ dùng Học sinh"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Đồ dùng Học sinh') 
WHERE name LIKE '%cặp%' 
   OR name LIKE '%túi%' 
   OR name LIKE '%ba lô%' 
   OR name LIKE '%balo%' 
   OR name LIKE '%hộp bút%' 
   OR name LIKE '%hộp màu%' 
   OR name LIKE '%tẩy%' 
   OR name LIKE '%gọt%' 
   OR name LIKE '%thước kẻ%' 
   OR name LIKE '%compa%' 
   OR name LIKE '%thước đo%';

-- Cập nhật sản phẩm cho danh mục "Giấy và Thiết bị văn phòng"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Giấy và Thiết bị văn phòng') 
WHERE name LIKE '%giấy%' 
   OR name LIKE '%bìa%' 
   OR name LIKE '%bao thư%' 
   OR name LIKE '%phong bì%' 
   OR name LIKE '%máy tính%' 
   OR name LIKE '%máy in%' 
   OR name LIKE '%máy photo%' 
   OR name LIKE '%máy scan%' 
   OR name LIKE '%máy hủy%';

-- Cập nhật sản phẩm cho danh mục "Dụng cụ Mỹ thuật"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Mỹ thuật') 
WHERE name LIKE '%màu%' 
   OR name LIKE '%vẽ%' 
   OR name LIKE '%cọ%' 
   OR name LIKE '%palette%' 
   OR name LIKE '%canvas%' 
   OR name LIKE '%đất nặn%' 
   OR name LIKE '%clay%' 
   OR name LIKE '%giấy màu%';

-- Cập nhật các sản phẩm còn lại chưa được phân loại vào danh mục "Khác"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Khác') 
WHERE category_id IS NULL OR category_id = 0;