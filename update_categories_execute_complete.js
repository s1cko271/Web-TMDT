// Script để thực thi cập nhật đầy đủ danh mục sản phẩm
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Tạo connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Hàm kiểm tra bảng có tồn tại không
async function tableExists(connection, tableName) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) as count FROM information_schema.tables 
     WHERE table_schema = DATABASE() 
     AND table_name = ?`, 
    [tableName]
  );
  return rows[0].count > 0;
}

async function executeUpdate() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Kết nối cơ sở dữ liệu thành công');
    
    // Kiểm tra bảng categories có tồn tại không, tạo nếu chưa có
    const categoriesExists = await tableExists(connection, 'categories');
    if (!categoriesExists) {
      console.log('Đang tạo bảng categories...');
      await connection.query(`
        CREATE TABLE categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          image_url VARCHAR(255)
        )
      `);
      
      // Thêm các danh mục mặc định
      await connection.query(`
        INSERT INTO categories (name, description) VALUES
        ('Dụng cụ Văn phòng', 'Các dụng cụ văn phòng như kẹp, ghim, băng keo...'),
        ('Bút và Viết', 'Các loại bút, viết các loại'),
        ('Sổ và Giấy', 'Sổ, vở và các loại giấy'),
        ('Dụng cụ Vẽ', 'Dụng cụ vẽ và hội họa'),
        ('Dụng cụ Đo lường', 'Thước, compa và dụng cụ đo lường'),
        ('Phụ kiện Học tập', 'Các phụ kiện học tập khác'),
        ('Khác', 'Các sản phẩm khác')
      `);
      console.log('Bảng categories đã được tạo và thêm các danh mục mặc định');
    }
    
    // Kiểm tra bảng school_supplies có tồn tại không, tạo nếu chưa có
    const suppliesExists = await tableExists(connection, 'school_supplies');
    if (!suppliesExists) {
      console.log('Đang tạo bảng school_supplies...');
      await connection.query(`
        CREATE TABLE school_supplies (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          image_url VARCHAR(255),
          unit_price DECIMAL(10, 2) NOT NULL,
          stock_quantity INT NOT NULL DEFAULT 0,
          status VARCHAR(50),
          category_id INT,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        )
      `);
      console.log('Bảng school_supplies đã được tạo với trường category_id');
      
      // Thêm các sản phẩm mẫu
      console.log('Đang thêm các sản phẩm mẫu...');
      await connection.query(`
        INSERT INTO school_supplies (name, description, image_url, unit_price, stock_quantity, status) VALUES
        ('Kẹp giấy kim loại', 'Kẹp giấy chất lượng cao, hộp 100 cái', '/sp1.jpg', 15000, 100, 'Còn hàng'),
        ('Ghim bấm số 10', 'Hộp ghim bấm 1000 cái', '/sp2.jpg', 12000, 150, 'Còn hàng'),
        ('Băng keo trong 2 mặt', 'Băng keo 2 mặt dán giấy, 15mm x 10m', '/sp3.jpg', 25000, 80, 'Còn hàng'),
        ('Giấy note 5 màu', 'Giấy ghi chú 5 màu, kích thước 76x76mm', '/sp4.jpg', 18000, 120, 'Còn hàng'),
        ('Kéo văn phòng', 'Kéo cắt giấy cỡ trung, lưỡi thép không gỉ', '/sp5.jpg', 35000, 60, 'Còn hàng'),
        ('Bút bi Thiên Long', 'Bút bi xanh, đỏ, đen', '/sp6.jpg', 5000, 200, 'Còn hàng'),
        ('Bút gel màu', 'Bộ 10 bút gel nhiều màu', '/sp7.jpg', 45000, 70, 'Còn hàng'),
        ('Bút chì 2B', 'Bút chì gỗ 2B, hộp 12 cây', '/sp8.jpg', 30000, 90, 'Còn hàng'),
        ('Bút highlight pastel', 'Bộ 5 bút đánh dấu màu pastel', '/sp9.jpg', 40000, 85, 'Còn hàng'),
        ('Bút lông dầu', 'Bút lông dầu viết bảng, hộp 10 cây', '/sp10.jpg', 60000, 50, 'Còn hàng'),
        ('Sổ tay bìa cứng', 'Sổ tay bìa cứng 200 trang', '/sp11.jpg', 35000, 60, 'Còn hàng'),
        ('Vở ô ly 200 trang', 'Vở ô ly cao cấp 200 trang', '/sp12.jpg', 18000, 120, 'Còn hàng'),
        ('Balo học sinh', 'Balo chống thấm nước, nhiều ngăn', '/sp13.jpg', 250000, 30, 'Còn hàng'),
        ('Hộp bút nhựa', 'Hộp đựng bút viết trong suốt', '/sp14.jpg', 20000, 80, 'Còn hàng'),
        ('Thước kẻ 30cm', 'Thước kẻ nhựa trong suốt 30cm', '/sp15.jpg', 8000, 150, 'Còn hàng'),
        ('Compa học sinh', 'Compa kim loại chính xác cao', '/sp16.jpg', 25000, 70, 'Còn hàng'),
        ('Bộ màu nước 12 màu', 'Bộ màu nước cao cấp 12 màu kèm cọ', '/sp17.jpg', 85000, 40, 'Còn hàng'),
        ('Giấy màu origami', 'Bộ giấy gấp origami nhiều màu 100 tờ', '/sp18.jpg', 30000, 60, 'Còn hàng'),
        ('Tẩy 2B', 'Tẩy chì cao su mềm', '/sp19.jpg', 5000, 200, 'Còn hàng'),
        ('Gọt bút chì', 'Gọt bút chì cầm tay nhỏ gọn', '/sp20.jpg', 7000, 180, 'Còn hàng'),
        ('Bìa còng 5cm', 'Bìa còng lưu trữ tài liệu 5cm', '/sp21.jpg', 45000, 50, 'Còn hàng'),
        ('Bìa nút 3 dây', 'Bìa nút 3 dây đựng hồ sơ A4', '/sp22.jpg', 15000, 100, 'Còn hàng'),
        ('Giấy A4 Excel', 'Giấy in A4 trắng 80gsm 500 tờ', '/sp23.jpg', 75000, 50, 'Còn hàng'),
        ('Bút dạ quang', 'Bộ 5 bút dạ quang nhiều màu', '/sp24.jpg', 40000, 70, 'Còn hàng'),
        ('Bút lông bảng', 'Bút lông viết bảng trắng', '/sp25.jpg', 12000, 120, 'Còn hàng'),
        ('Bút chì màu 24 màu', 'Bộ bút chì màu cao cấp 24 màu', '/sp26.jpg', 65000, 45, 'Còn hàng'),
        ('Sáp màu 12 màu', 'Bộ sáp màu an toàn cho trẻ em', '/sp27.jpg', 35000, 60, 'Còn hàng'),
        ('Bảng vẽ nam châm', 'Bảng vẽ nam châm cho trẻ em', '/sp28.jpg', 120000, 30, 'Còn hàng'),
        ('Túi đựng bút', 'Túi vải đựng bút viết nhiều ngăn', '/sp29.jpg', 35000, 70, 'Còn hàng'),
        ('Balo laptop', 'Balo đựng laptop chống sốc', '/sp30.jpg', 350000, 25, 'Còn hàng'),
        ('Thước ê-ke', 'Bộ thước ê-ke học sinh', '/sp31.jpg', 15000, 100, 'Còn hàng'),
        ('Thước đo góc', 'Thước đo góc bán nguyệt', '/sp32.jpg', 12000, 90, 'Còn hàng'),
        ('Giấy kiểm tra', 'Giấy kiểm tra có ô tô sẵn', '/sp33.jpg', 25000, 80, 'Còn hàng'),
        ('Sổ lò xo A5', 'Sổ lò xo bìa cứng khổ A5', '/sp34.jpg', 28000, 75, 'Còn hàng'),
        ('Sổ tay bỏ túi', 'Sổ tay mini bỏ túi tiện lợi', '/sp35.jpg', 15000, 120, 'Còn hàng'),
        ('Kẹp bướm', 'Kẹp bướm văn phòng các cỡ', '/sp36.jpg', 25000, 90, 'Còn hàng'),
        ('Kẹp gỗ mini', 'Bộ kẹp gỗ mini trang trí', '/sp37.jpg', 18000, 100, 'Còn hàng'),
        ('Dập ghim lớn', 'Dập ghim văn phòng cỡ lớn', '/sp38.jpg', 85000, 40, 'Còn hàng'),
        ('Đục lỗ giấy', 'Đục lỗ giấy 2 lỗ tiêu chuẩn', '/sp39.jpg', 65000, 45, 'Còn hàng'),
        ('Bảng tên đeo cổ', 'Bảng tên đeo cổ kèm dây', '/sp40.jpg', 12000, 150, 'Còn hàng')
      `);
      console.log('Các sản phẩm mẫu đã được thêm thành công');
    } else {
      // Kiểm tra trường category_id có tồn tại không, thêm nếu chưa có
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'school_supplies' 
        AND COLUMN_NAME IN ('category_id', 'categories_id')
      `);
      
      if (!columns || columns.length === 0) {
        console.log('Đang thêm trường category_id vào bảng school_supplies...');
        await connection.query(`
          ALTER TABLE school_supplies 
          ADD COLUMN category_id INT,
          ADD FOREIGN KEY (category_id) REFERENCES categories(id)
        `);
        console.log('Đã thêm trường category_id vào bảng school_supplies');
      }
    }
    
    // Xác định tên trường chính xác (category_id hoặc categories_id)
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'school_supplies' 
      AND COLUMN_NAME IN ('category_id', 'categories_id')
    `);
    
    if (!columns || columns.length === 0) {
      console.error('Không tìm thấy trường category_id trong bảng school_supplies');
      return;
    }
    
    const categoryField = columns[0].COLUMN_NAME;
    console.log(`Sử dụng tên trường: ${categoryField}`);
    
    // Cập nhật sản phẩm cho danh mục "Dụng cụ Văn phòng"
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng') 
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
         OR name LIKE '%kẹp gỗ%'
    `);
    console.log('Đã cập nhật sản phẩm cho danh mục "Dụng cụ Văn phòng"');
    
    // Cập nhật sản phẩm cho danh mục "Bút và Viết"
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Bút và Viết') 
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
         OR name LIKE '%dạ%'
    `);
    console.log('Đã cập nhật sản phẩm cho danh mục "Bút và Viết"');
    
    // Cập nhật sản phẩm cho danh mục "Dụng cụ Vẽ"
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ') 
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
         OR name LIKE '%màu acrylic%'
    `);
    console.log('Đã cập nhật sản phẩm cho danh mục "Dụng cụ Vẽ"');
    
    // Cập nhật sản phẩm cho danh mục "Dụng cụ Đo lường"
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường') 
      WHERE name LIKE '%thước%' 
         OR name LIKE '%compa%' 
         OR name LIKE '%ê-ke%' 
         OR name LIKE '%êke%' 
         OR name LIKE '%đo%' 
         OR name LIKE '%thước đo%' 
         OR name LIKE '%thước kẻ%'
         OR name LIKE '%thước dây%'
         OR name LIKE '%thước góc%'
         OR name LIKE '%thước tam giác%'
    `);
    console.log('Đã cập nhật sản phẩm cho danh mục "Dụng cụ Đo lường"');
    
    // Cập nhật sản phẩm cho danh mục "Sổ và Giấy"
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Sổ và Giấy') 
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
         OR name LIKE '%giấy kraft%'
    `);
    console.log('Đã cập nhật sản phẩm cho danh mục "Sổ và Giấy"');
    
    // Cập nhật sản phẩm cho danh mục "Phụ kiện Học tập"
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập') 
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
         OR name LIKE '%bảng ghi%'
    `);
    console.log('Đã cập nhật sản phẩm cho danh mục "Phụ kiện Học tập"');
    
    // Cập nhật sản phẩm chưa được gán danh mục vào danh mục "Khác"
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Khác') 
      WHERE ${categoryField} IS NULL OR ${categoryField} = 0
    `);
    console.log('Đã cập nhật sản phẩm chưa được gán danh mục vào danh mục "Khác"');
    
    // Đếm số lượng sản phẩm theo danh mục
    const [counts] = await connection.query(`
      SELECT c.name, COUNT(s.id) as count 
      FROM categories c 
      LEFT JOIN school_supplies s ON c.id = s.${categoryField} 
      GROUP BY c.id, c.name
    `);
    
    console.log('\nSố lượng sản phẩm theo danh mục:');
    counts.forEach(row => {
      console.log(`${row.name}: ${row.count} sản phẩm`);
    });
    
    console.log('\nCập nhật danh mục sản phẩm hoàn tất!');
  } catch (error) {
    console.error('Lỗi khi thực thi cập nhật:', error.message);
    console.error('Chi tiết lỗi:', error);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

executeUpdate();