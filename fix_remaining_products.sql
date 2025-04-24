-- Script SQL để cập nhật danh mục cho các sản phẩm còn lại

-- Kiểm tra các sản phẩm chưa có danh mục
SELECT id, name
FROM school_supplies
WHERE category_id IS NULL OR category_id = 0;

-- Cập nhật danh mục cho các sản phẩm cụ thể còn thiếu
-- Máy tính Casio FX-570VN Plus -> Dụng cụ Học tập
UPDATE school_supplies
SET category_id = (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập')
WHERE id = 15 OR name LIKE '%Máy tính Casio%';

-- Bộ 10 viên phấn trắng -> Dụng cụ Vẽ
UPDATE school_supplies
SET category_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ')
WHERE id = 17 OR name LIKE '%phấn%';

-- Bìa nhựa đựng tài liệu -> Dụng cụ Văn phòng
UPDATE school_supplies
SET category_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng')
WHERE id = 31 OR name LIKE '%Bìa nhựa%' OR name LIKE '%đựng tài liệu%';

-- Đèn bàn học LED -> Phụ kiện Học tập
UPDATE school_supplies
SET category_id = (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập')
WHERE id = 47 OR name LIKE '%Đèn bàn học%' OR name LIKE '%đèn học%';

-- Kiểm tra lại sau khi cập nhật
SELECT id, name, category_id
FROM school_supplies
WHERE category_id IS NULL OR category_id = 0;

-- Kiểm tra số lượng sản phẩm trong mỗi danh mục
SELECT c.name as category_name, COUNT(s.id) as product_count
FROM categories c
LEFT JOIN school_supplies s ON c.id = s.category_id
GROUP BY c.id, c.name
ORDER BY c.name;