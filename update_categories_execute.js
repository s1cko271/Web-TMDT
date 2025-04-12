// Script to execute the SQL update for categories
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Create connection pool
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

// Function to check if a table exists
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
    console.log('Database connection established successfully');
    
    // Check if categories table exists, create if not
    const categoriesExists = await tableExists(connection, 'categories');
    if (!categoriesExists) {
      console.log('Creating categories table...');
      await connection.query(`
        CREATE TABLE categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          image_url VARCHAR(255)
        )
      `);
      
      // Insert default categories
      await connection.query(`
        INSERT INTO categories (name, description) VALUES
        ('Dụng cụ Văn phòng', 'Các dụng cụ văn phòng như kẹp, ghim, băng keo...'),
        ('Bút và Viết', 'Các loại bút, viết các loại'),
        ('Sổ và Vở', 'Sổ, vở và các loại tập'),
        ('Sổ và Giấy', 'Sổ, vở và các loại giấy'),
        ('Đồ dùng Học sinh', 'Đồ dùng dành cho học sinh'),
        ('Giấy và Thiết bị văn phòng', 'Giấy và các thiết bị văn phòng'),
        ('Dụng cụ Mỹ thuật', 'Dụng cụ vẽ và mỹ thuật'),
        ('Dụng cụ Vẽ', 'Dụng cụ vẽ và hội họa'),
        ('Dụng cụ Đo lường', 'Thước, compa và dụng cụ đo lường'),
        ('Phụ kiện Học tập', 'Các phụ kiện học tập khác'),
        ('Khác', 'Các sản phẩm khác')
      `);
      console.log('Categories table created and populated with default categories');
    }
    
    // Check if school_supplies table exists, create if not
    const suppliesExists = await tableExists(connection, 'school_supplies');
    if (!suppliesExists) {
      console.log('Creating school_supplies table...');
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
      console.log('School supplies table created with category_id field');
      
      // Add sample products
      console.log('Adding sample products...');
      await connection.query(`
        INSERT INTO school_supplies (name, description, image_url, unit_price, stock_quantity, status) VALUES
        ('Kẹp giấy kim loại', 'Kẹp giấy chất lượng cao, hộp 100 cái', '/images/sp1.jpg', 15000, 100, 'Còn hàng'),
        ('Ghim bấm số 10', 'Hộp ghim bấm 1000 cái', '/images/sp2.jpg', 12000, 150, 'Còn hàng'),
        ('Băng keo trong 2 mặt', 'Băng keo 2 mặt dán giấy, 15mm x 10m', '/images/sp3.jpg', 25000, 80, 'Còn hàng'),
        ('Giấy note 5 màu', 'Giấy ghi chú 5 màu, kích thước 76x76mm', '/images/sp4.jpg', 18000, 120, 'Còn hàng'),
        ('Kéo văn phòng', 'Kéo cắt giấy cỡ trung, lưỡi thép không gỉ', '/images/sp5.jpg', 35000, 60, 'Còn hàng'),
        ('Bút bi Thiên Long', 'Bút bi xanh, đỏ, đen', '/images/sp6.jpg', 5000, 200, 'Còn hàng'),
        ('Bút gel màu', 'Bộ 10 bút gel nhiều màu', '/images/sp7.jpg', 45000, 70, 'Còn hàng'),
        ('Bút chì 2B', 'Bút chì gỗ 2B, hộp 12 cây', '/images/sp8.jpg', 30000, 90, 'Còn hàng'),
        ('Bút highlight pastel', 'Bộ 5 bút đánh dấu màu pastel', '/images/sp9.jpg', 40000, 85, 'Còn hàng'),
        ('Bút lông dầu', 'Bút lông dầu viết bảng, hộp 10 cây', '/images/sp10.jpg', 60000, 50, 'Còn hàng'),
        ('Sổ tay bìa cứng', 'Sổ tay bìa cứng 200 trang', '/images/sp11.jpg', 35000, 60, 'Còn hàng'),
        ('Vở ô ly 200 trang', 'Vở ô ly cao cấp 200 trang', '/images/sp12.jpg', 18000, 120, 'Còn hàng'),
        ('Balo học sinh', 'Balo chống thấm nước, nhiều ngăn', '/images/sp13.jpg', 250000, 30, 'Còn hàng'),
        ('Hộp bút nhựa', 'Hộp đựng bút viết trong suốt', '/images/sp14.jpg', 20000, 80, 'Còn hàng')
      `);
      console.log('Sample products added successfully');
    } else {
      // Check if category_id column exists, add if not
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'school_supplies' 
        AND COLUMN_NAME IN ('category_id', 'categories_id')
      `);
      
      if (!columns || columns.length === 0) {
        console.log('Adding category_id column to school_supplies table...');
        await connection.query(`
          ALTER TABLE school_supplies 
          ADD COLUMN category_id INT,
          ADD FOREIGN KEY (category_id) REFERENCES categories(id)
        `);
        console.log('Added category_id column to school_supplies table');
      }
    }
    
    // Now determine the correct field name (category_id or categories_id)
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'school_supplies' 
      AND COLUMN_NAME IN ('category_id', 'categories_id')
    `);
    
    if (!columns || columns.length === 0) {
      console.error('Failed to create or find category_id column in school_supplies table');
      return;
    }
    
    const categoryField = columns[0].COLUMN_NAME;
    console.log(`Using field name: ${categoryField}`);
    
    // Update products for "Dụng cụ Văn phòng" category
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng') 
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
    `);
    console.log('Updated products for "Dụng cụ Văn phòng" category');
    
    // Update products for "Bút và Viết" category
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Bút và Viết') 
      WHERE name LIKE '%bút%' 
         OR name LIKE '%viết%' 
         OR name LIKE '%chì%' 
         OR name LIKE '%mực%' 
         OR name LIKE '%marker%' 
         OR name LIKE '%highlight%'
    `);
    console.log('Updated products for "Bút và Viết" category');
    
    // Update products for "Sổ và Vở" category
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Sổ và Vở') 
      WHERE name LIKE '%sổ%' 
         OR name LIKE '%vở%' 
         OR name LIKE '%tập%' 
         OR name LIKE '%nhật ký%' 
         OR name LIKE '%diary%' 
         OR name LIKE '%notebook%'
    `);
    console.log('Updated products for "Sổ và Vở" category');
    
    // Update products for "Đồ dùng Học sinh" category
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Đồ dùng Học sinh') 
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
         OR name LIKE '%thước đo%'
    `);
    console.log('Updated products for "Đồ dùng Học sinh" category');
    
    // Update products for "Giấy và Thiết bị văn phòng" category
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Giấy và Thiết bị văn phòng') 
      WHERE name LIKE '%giấy%' 
         OR name LIKE '%bìa%' 
         OR name LIKE '%bao thư%' 
         OR name LIKE '%phong bì%' 
         OR name LIKE '%máy tính%' 
         OR name LIKE '%máy in%' 
         OR name LIKE '%máy photo%' 
         OR name LIKE '%máy scan%' 
         OR name LIKE '%máy hủy%'
    `);
    console.log('Updated products for "Giấy và Thiết bị văn phòng" category');
    
    // Update products for "Dụng cụ Mỹ thuật" category
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Dụng cụ Mỹ thuật') 
      WHERE name LIKE '%màu%' 
         OR name LIKE '%vẽ%' 
         OR name LIKE '%cọ%' 
         OR name LIKE '%palette%' 
         OR name LIKE '%canvas%' 
         OR name LIKE '%đất nặn%' 
         OR name LIKE '%clay%' 
         OR name LIKE '%giấy màu%'
    `);
    console.log('Updated products for "Dụng cụ Mỹ thuật" category');
    
    // Update remaining products to "Khác" category
    await connection.query(`
      UPDATE school_supplies 
      SET ${categoryField} = (SELECT id FROM categories WHERE name = 'Khác') 
      WHERE ${categoryField} IS NULL OR ${categoryField} = 0
    `);
    console.log('Updated remaining products to "Khác" category');
    
    // Count products by category
    const [counts] = await connection.query(`
      SELECT c.name, COUNT(s.id) as count 
      FROM categories c 
      LEFT JOIN school_supplies s ON c.id = s.${categoryField} 
      GROUP BY c.id, c.name
    `);
    
    console.log('\nProducts count by category:');
    counts.forEach(row => {
      console.log(`${row.name}: ${row.count} products`);
    });
    
    console.log('\nCategory update completed successfully!');
  } catch (error) {
    console.error('Error executing update:', error.message);
    console.error('Error details:', error);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

executeUpdate();