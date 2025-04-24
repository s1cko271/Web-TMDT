-- Script SQL để sửa lỗi tên sản phẩm và cập nhật danh mục sản phẩm

-- 1. Kiểm tra xem trường category_id hay categories_id được sử dụng
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'school_supplies' 
AND COLUMN_NAME IN ('category_id', 'categories_id');

-- 2. Nếu cả hai trường đều tồn tại, cập nhật dữ liệu từ categories_id sang category_id và xóa trường categories_id
-- Kiểm tra xem cả hai trường có tồn tại không
SELECT COUNT(*) as count_fields
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'school_supplies' 
AND COLUMN_NAME IN ('category_id', 'categories_id')
HAVING COUNT(*) = 2;

-- Nếu cả hai trường tồn tại, cập nhật dữ liệu từ categories_id sang category_id
UPDATE school_supplies 
SET category_id = categories_id 
WHERE categories_id IS NOT NULL AND (category_id IS NULL OR category_id = 0);

-- Sau đó xóa trường categories_id nếu cần
-- ALTER TABLE school_supplies DROP COLUMN categories_id;

-- 3. Nếu chỉ có trường categories_id, đổi tên thành category_id
-- Kiểm tra xem chỉ có trường categories_id không
SELECT COUNT(*) as has_categories_id
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'school_supplies' 
AND COLUMN_NAME = 'categories_id';

SELECT COUNT(*) as has_category_id
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'school_supplies' 
AND COLUMN_NAME = 'category_id';

-- Nếu chỉ có categories_id, đổi tên thành category_id
-- ALTER TABLE school_supplies CHANGE COLUMN categories_id category_id INT;

-- 4. Sửa lỗi tên sản phẩm (cập nhật tên sản phẩm không chính xác)
-- Ví dụ: Sửa các tên sản phẩm bị lỗi chính tả hoặc không nhất quán
UPDATE school_supplies
SET name = 'Bút bi Thiên Long TL-027'
WHERE name = 'Bút bi Thiên Long' OR name LIKE '%Bút bi Thiên Long%' OR name LIKE '%Thiên Long TL-027%';

UPDATE school_supplies
SET name = 'Bút gel màu Pentel Hybrid Dual Metallic'
WHERE name = 'Bút gel màu' OR name LIKE '%Bút gel màu%' OR name LIKE '%Pentel Hybrid%';

UPDATE school_supplies
SET name = 'Bút chì 2B Staedtler'
WHERE name = 'Bút chì 2B' OR name LIKE '%Bút chì 2B%' OR name LIKE '%Staedtler%';

UPDATE school_supplies
SET name = 'Bút highlight pastel Stabilo Boss'
WHERE name = 'Bút highlight pastel' OR name LIKE '%Bút highlight%' OR name LIKE '%Stabilo Boss%';

UPDATE school_supplies
SET name = 'Bút lông dầu Artline 70'
WHERE name = 'Bút lông dầu' OR name LIKE '%Bút lông dầu%' OR name LIKE '%Artline 70%';

-- 5. Cập nhật danh mục cho các sản phẩm
-- Sử dụng category_id vì đây là trường chuẩn

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
   OR name LIKE '%kệ%'
   OR name LIKE '%dập ghim%'
   OR name LIKE '%đục lỗ%';

-- Cập nhật sản phẩm cho danh mục "Bút và Viết"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Bút và Viết') 
WHERE name LIKE '%bút%' 
   OR name LIKE '%viết%' 
   OR name LIKE '%chì%' 
   OR name LIKE '%mực%' 
   OR name LIKE '%marker%' 
   OR name LIKE '%highlight%'
   OR name LIKE '%gel%'
   OR name LIKE '%lông%';

-- Cập nhật sản phẩm cho danh mục "Dụng cụ Vẽ"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ') 
WHERE name LIKE '%màu%' 
   OR name LIKE '%vẽ%' 
   OR name LIKE '%cọ%' 
   OR name LIKE '%palette%' 
   OR name LIKE '%canvas%' 
   OR name LIKE '%giấy vẽ%' 
   OR name LIKE '%sơn%' 
   OR name LIKE '%bảng vẽ%'
   OR name LIKE '%chì màu%'
   OR name LIKE '%sáp màu%';

-- Cập nhật sản phẩm cho danh mục "Dụng cụ Đo lường"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường') 
WHERE name LIKE '%thước%' 
   OR name LIKE '%compa%' 
   OR name LIKE '%ê-ke%' 
   OR name LIKE '%êke%' 
   OR name LIKE '%đo%' 
   OR name LIKE '%thước đo%' 
   OR name LIKE '%thước kẻ%'
   OR name LIKE '%thước dây%'
   OR name LIKE '%thước góc%';

-- Cập nhật sản phẩm cho danh mục "Sổ và Giấy"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Sổ và Giấy') 
WHERE name LIKE '%sổ%' 
   OR name LIKE '%vở%' 
   OR name LIKE '%tập%' 
   OR name LIKE '%nhật ký%' 
   OR name LIKE '%diary%' 
   OR name LIKE '%notebook%'
   OR name LIKE '%giấy%'
   OR name LIKE '%giấy note%'
   OR name LIKE '%giấy in%';

-- Cập nhật sản phẩm cho danh mục "Phụ kiện Học tập"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập') 
WHERE name LIKE '%cặp%' 
   OR name LIKE '%túi%' 
   OR name LIKE '%balo%' 
   OR name LIKE '%hộp bút%' 
   OR name LIKE '%gọt%' 
   OR name LIKE '%tẩy%' 
   OR name LIKE '%ba lô%';

-- Cập nhật các sản phẩm còn lại chưa được phân loại vào danh mục "Khác"
UPDATE school_supplies 
SET category_id = (SELECT id FROM categories WHERE name = 'Khác') 
WHERE category_id IS NULL OR category_id = 0;

-- 6. Kiểm tra kết quả
SELECT c.name as category_name, COUNT(s.id) as product_count
FROM categories c
LEFT JOIN school_supplies s ON c.id = s.category_id
GROUP BY c.id, c.name
ORDER BY c.name;

-- Kiểm tra sản phẩm không có danh mục
SELECT id, name
FROM school_supplies
WHERE category_id IS NULL OR category_id = 0;