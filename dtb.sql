CREATE DATABASE IF NOT EXISTS school_store;
USE school_store;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500)
);

-- Thêm các danh mục sản phẩm
INSERT INTO categories (name, description, image_url) VALUES
('Bút và Viết', 'Các loại bút bi, bút chì, bút mực và các dụng cụ viết khác', 'images/sp1.jpg'),
('Dụng cụ Vẽ', 'Bút màu, bút sáp và các dụng cụ vẽ khác', 'images/sp8.jpg'),
('Dụng cụ Đo lường', 'Thước kẻ, compa, ê-ke và các dụng cụ đo lường khác', 'images/sp11.jpg'),
('Sổ và Giấy', 'Vở, sổ tay, giấy và các loại giấy khác', 'images/sp21.jpg'),
('Dụng cụ Văn phòng', 'Kẹp giấy, ghim bấm, băng keo và các dụng cụ văn phòng khác', 'images/sp34.jpg'),
('Phụ kiện Học tập', 'Ba lô, hộp bút, đèn học và các phụ kiện học tập khác', 'images/sp44.jpg');

CREATE TABLE IF NOT EXISTS school_supplies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    unit_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    status ENUM('Còn hàng', 'Hết hàng') NOT NULL DEFAULT 'Còn hàng',
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO school_supplies (name, description, image_url, unit_price, stock_quantity, status, category_id) VALUES
('Bút bi mực xanh', 'Bút bi có mực xanh, thiết kế thân nhựa, viết trơn, phù hợp cho học sinh và văn phòng.', 'images/sp1.jpg', 5000, 100, 'Còn hàng', 1),
('Bút chì gỗ 2B', 'Bút chì gỗ loại 2B, thích hợp cho vẽ, viết, và làm bài kiểm tra trắc nghiệm.', 'images/sp2.jpg', 3000, 200, 'Còn hàng', 1),
('Bút chì kim 0.5mm', 'Bút chì kim với đầu bút 0.5mm, kèm theo ruột bút, phù hợp cho viết chính xác.', 'images/sp3.jpg', 25000, 50, 'Còn hàng', 1),
('Bút mực xanh', 'Bút mực với ngòi bút êm ái, có thể bơm mực dễ dàng, thích hợp cho học sinh.', 'images/sp4.jpg', 10000, 80, 'Còn hàng', 1),
('Bút lông dầu hai đầu', 'Bút lông dầu với hai đầu bút: một đầu nhỏ để viết, một đầu to để đánh dấu.', 'images/sp5.jpg', 15000, 60, 'Còn hàng', 1),
('Bút dạ quang 5 màu', 'Bộ bút dạ quang với 5 màu sắc tươi sáng, giúp đánh dấu nội dung quan trọng.', 'images/sp6.jpg', 50000, 90, 'Còn hàng', 1),
('Bút xóa kéo', 'Bút xóa dạng kéo, dễ sử dụng, không gây lem mực khi viết lại.', 'images/sp7.jpg', 10000, 70, 'Còn hàng', 1),
('Bộ bút màu nước 12 cây', 'Bộ 12 bút màu nước, màu sắc tươi sáng, thích hợp cho học sinh và họa sĩ nhí.', 'images/sp8.jpg', 30000, 40, 'Còn hàng', 2),
('Bộ bút chì màu 24 cây', 'Bộ 24 bút chì màu, chất lượng cao, dễ tô, phù hợp cho vẽ tranh.', 'images/sp9.jpg', 40000, 30, 'Còn hàng', 2),
('Bộ bút sáp màu 12 cây', 'Bộ 12 bút sáp màu, dễ sử dụng, không gây lem, phù hợp cho trẻ em.', 'images/sp10.jpg', 25000, 50, 'Còn hàng', 2),
('Thước kẻ nhựa trong 20cm', 'Thước kẻ dài 20cm, chất liệu nhựa trong suốt, dễ dàng quan sát khi đo.', 'images/sp11.jpg', 5000, 120, 'Còn hàng', 3),
('Ê-ke 45 độ nhựa', 'Ê-ke nhựa góc 45 độ, phù hợp cho học sinh vẽ hình hình học.', 'images/sp12.jpg', 7000, 100, 'Còn hàng', 3),
('Thước dẻo cong', 'Thước cong có thể uốn dẻo, không gãy, tiện lợi cho việc vẽ hình.', 'images/sp13.jpg', 8000, 90, 'Còn hàng', 3),
('Compa vẽ hình tròn', 'Compa dùng để vẽ hình tròn chính xác, kèm theo ngòi chì.', 'images/sp14.jpg', 20000, 50, 'Còn hàng', 3),
('Máy tính Casio FX-570VN Plus', 'Máy tính cầm tay Casio FX-570VN Plus hỗ trợ nhiều tính năng tính toán.', 'images/sp15.jpg', 350000, 20, 'Còn hàng', 3),
('Bảng con kẻ ô ly', 'Bảng con kích thước nhỏ, kẻ ô ly giúp viết dễ dàng hơn.', 'images/sp16.jpg', 15000, 80, 'Còn hàng', 6),
('Bộ 10 viên phấn trắng', 'Bộ gồm 10 viên phấn trắng, không bụi, dễ viết trên bảng đen.', 'images/sp17.jpg', 5000, 150, 'Còn hàng', 1),
('Bút lông bảng trắng mực đậm', 'Bút lông chuyên dùng cho bảng trắng, mực đậm, dễ lau sạch.', 'images/sp18.jpg', 12000, 60, 'Còn hàng', 1),
('Cục tẩy nhỏ gọn', 'Cục tẩy nhỏ, dễ mang theo, không làm rách giấy.', 'images/sp19.jpg', 3000, 200, 'Còn hàng', 1),
('Gọt bút chì mini', 'Gọt bút chì nhỏ gọn, dễ sử dụng, phù hợp cho học sinh.', 'images/sp20.jpg', 5000, 100, 'Còn hàng', 1),
('Vở ô ly 96 trang', 'Vở ô ly 96 trang dành cho học sinh cấp 1, giấy trắng đẹp.', 'images/sp21.jpg', 12000, 70, 'Còn hàng', 4),
('Vở kẻ ngang 200 trang', 'Vở kẻ ngang 200 trang, phù hợp cho học sinh và sinh viên ghi chép.', 'images/sp22.jpg', 15000, 60, 'Còn hàng', 4),
('Sổ tay ghi chú 100 trang', 'Sổ tay nhỏ gọn, 100 trang, phù hợp để ghi chú nhanh.', 'images/sp23.jpg', 20000, 40, 'Còn hàng', 4),
('Giấy kiểm tra khổ A4', 'Tập giấy kiểm tra khổ A4, phù hợp cho bài kiểm tra trên lớp.', 'images/sp24.jpg', 5000, 90, 'Còn hàng', 4),
('Giấy nháp tiện lợi', 'Tập giấy nháp, thích hợp cho việc làm bài tập và ghi chú.', 'images/sp25.jpg', 3000, 200, 'Còn hàng', 4),
('Bộ giấy màu thủ công', 'Bộ giấy màu đa dạng, dùng để làm thủ công và trang trí.', 'images/sp26.jpg', 25000, 30, 'Còn hàng', 4),
('Giấy A4 500 tờ', 'Tập giấy A4 gồm 500 tờ, chất lượng cao, thích hợp cho in ấn và viết tay.', 'images/sp27.jpg', 60000, 20, 'Còn hàng', 4),
('Giấy ghi chú nhiều màu', 'Bộ giấy ghi chú với nhiều màu sắc khác nhau, giúp dễ phân loại thông tin.', 'images/sp28.jpg', 10000, 100, 'Còn hàng', 4),
('Giấy dán Sticky Notes', 'Giấy dán ghi chú với keo dính nhẹ, dễ dán và tháo, không để lại vết keo.', 'images/sp29.jpg', 12000, 80, 'Còn hàng', 4),
('Bộ 10 tập hồ sơ nhựa', 'Bộ 10 tập hồ sơ bằng nhựa, giúp bảo quản tài liệu an toàn.', 'images/sp30.jpg', 30000, 50, 'Còn hàng', 5),
('Bìa nhựa đựng tài liệu', 'Bìa nhựa mỏng, giúp đựng hồ sơ, tài liệu tránh nhăn và rách.', 'images/sp31.jpg', 15000, 60, 'Còn hàng', 5),
('Túi đựng bút vải', 'Túi vải đựng bút, nhiều ngăn, phù hợp cho học sinh và nhân viên văn phòng.', 'images/sp32.jpg', 20000, 70, 'Còn hàng', 6),
('Hộp bút nhiều ngăn', 'Hộp bút thiết kế nhiều ngăn, giúp sắp xếp bút và dụng cụ học tập gọn gàng.', 'images/sp33.jpg', 25000, 40, 'Còn hàng', 6),
('Hộp 100 cái kẹp giấy', 'Kẹp giấy nhỏ, dùng để giữ tài liệu, giấy tờ ngăn nắp.', 'images/sp34.jpg', 5000, 150, 'Còn hàng', 5),
('Hộp 50 cái kẹp bướm', 'Kẹp bướm kim loại chắc chắn, dùng để kẹp tài liệu dày.', 'images/sp35.jpg', 7000, 100, 'Còn hàng', 5),
('Ghim bấm 1000 chiếc', 'Hộp ghim bấm 1000 chiếc, phù hợp cho máy bấm giấy thông dụng.', 'images/sp36.jpg', 10000, 80, 'Còn hàng', 5),
('Băng keo trong 1.8cm', 'Cuộn băng keo trong, khổ rộng 1.8cm, phù hợp cho văn phòng và học tập.', 'images/sp37.jpg', 8000, 90, 'Còn hàng', 5),
('Băng keo hai mặt 1.5cm', 'Cuộn băng keo hai mặt, khổ rộng 1.5cm, dính chắc chắn, tiện dụng.', 'images/sp38.jpg', 10000, 70, 'Còn hàng', 5),
('Lọ hồ dán 40ml', 'Hồ dán dạng lỏng, dung tích 40ml, tiện lợi cho dán giấy và thủ công.', 'images/sp39.jpg', 5000, 120, 'Còn hàng', 5),
('Lọ keo dán 50ml', 'Keo dán trong suốt, dung tích 50ml, phù hợp cho văn phòng và học tập.', 'images/sp40.jpg', 7000, 100, 'Còn hàng', 5),
('Kéo cắt giấy inox', 'Kéo làm từ inox sắc bén, tay cầm nhựa chắc chắn, cắt giấy dễ dàng.', 'images/sp41.jpg', 12000, 60, 'Còn hàng', 5),
('Bảng dán thời khóa biểu', 'Bảng thời khóa biểu dán tường, giúp sắp xếp lịch học khoa học.', 'images/sp42.jpg', 15000, 80, 'Còn hàng', 6),
('Đồng hồ bấm giờ học tập', 'Đồng hồ hẹn giờ giúp quản lý thời gian học tập và làm bài hiệu quả.', 'images/sp43.jpg', 50000, 30, 'Còn hàng', 6),
('Ba lô học sinh chống gù', 'Ba lô thiết kế chống gù, phù hợp cho học sinh tiểu học và trung học.', 'images/sp44.jpg', 300000, 20, 'Còn hàng', 6),
('Hộp cơm giữ nhiệt 3 tầng', 'Hộp cơm giữ nhiệt với 3 tầng giúp giữ nhiệt tốt, tiện lợi mang đi học.', 'images/sp45.jpg', 250000, 15, 'Còn hàng', 6),
('Bình nước cá nhân 500ml', 'Bình nước dung tích 500ml, thiết kế gọn nhẹ, dễ mang theo.', 'images/sp46.jpg', 100000, 30, 'Còn hàng', 6),
('Đèn bàn học LED', 'Đèn bàn học LED tiết kiệm điện, ánh sáng bảo vệ mắt.', 'images/sp47.jpg', 200000, 25, 'Còn hàng', 6),
('Kệ để sách mini', 'Giá sách mini giúp sắp xếp sách gọn gàng, tiết kiệm không gian.', 'images/sp48.jpg', 150000, 20, 'Còn hàng', 6),
('Bảng từ trắng có nam châm', 'Bảng từ trắng hỗ trợ viết bút lông và dán giấy bằng nam châm.', 'images/sp49.jpg', 200000, 10, 'Còn hàng', 6),
('Máy in cầm tay mini', 'Máy in cầm tay nhỏ gọn, in ấn nhanh chóng, dễ sử dụng.', 'images/sp50.jpg', 1200000, 5, 'Còn hàng', 6);