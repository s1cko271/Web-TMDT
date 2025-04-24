-- Script SQL để sửa lỗi tên sản phẩm đồng hồ bấm giờ học tập (ID 43)

-- Kiểm tra sản phẩm hiện tại
SELECT id, name, description FROM school_supplies WHERE id = 43;

-- Cập nhật tên sản phẩm từ "Đánh dấu trang dính" thành "Đồng hồ bấm giờ học tập"
UPDATE school_supplies
SET name = 'Đồng hồ bấm giờ học tập'
WHERE id = 43;

-- Cập nhật mô tả sản phẩm
UPDATE school_supplies
SET description = 'Đồng hồ bấm giờ học tập nhỏ gọn, nhiều màu sắc, có chức năng đếm ngược và báo thức, phù hợp cho học sinh và sinh viên.'
WHERE id = 43;

-- Cập nhật danh mục sản phẩm (đặt vào danh mục "Phụ kiện Học tập")
UPDATE school_supplies
SET category_id = (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập')
WHERE id = 43;

-- Kiểm tra kết quả sau khi cập nhật
SELECT s.id, s.name, s.description, c.name as category_name
FROM school_supplies s
JOIN categories c ON s.category_id = c.id
WHERE s.id = 43;