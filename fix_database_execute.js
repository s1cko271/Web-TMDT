// Script để thực thi việc sửa lỗi cơ sở dữ liệu
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

// Hàm kiểm tra cột có tồn tại không
async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) as count FROM information_schema.columns 
     WHERE table_schema = DATABASE() 
     AND table_name = ? 
     AND column_name = ?`, 
    [tableName, columnName]
  );
  return rows[0].count > 0;
}

async function fixDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Kết nối cơ sở dữ liệu thành công');
    
    // Kiểm tra bảng school_supplies có tồn tại không
    const suppliesExists = await tableExists(connection, 'school_supplies');
    if (!suppliesExists) {
      console.log('Bảng school_supplies không tồn tại. Không thể tiếp tục.');
      return;
    }
    
    // Kiểm tra xem trường category_id và categories_id có tồn tại không
    const hasCategoryId = await columnExists(connection, 'school_supplies', 'category_id');
    const hasCategoriesId = await columnExists(connection, 'school_supplies', 'categories_id');
    
    console.log(`Trường category_id tồn tại: ${hasCategoryId}`);
    console.log(`Trường categories_id tồn tại: ${hasCategoriesId}`);
    
    // Xử lý trường hợp cả hai trường đều tồn tại
    if (hasCategoryId && hasCategoriesId) {
      console.log('Cả hai trường category_id và categories_id đều tồn tại. Đang cập nhật dữ liệu...');
      
      // Cập nhật dữ liệu từ categories_id sang category_id
      await connection.query(`
        UPDATE school_supplies 
        SET category_id = categories_id 
        WHERE categories_id IS NOT NULL AND (category_id IS NULL OR category_id = 0)
      `);
      
      console.log('Đã cập nhật dữ liệu từ categories_id sang category_id');
      
      // Xóa trường categories_id
      await connection.query(`ALTER TABLE school_supplies DROP COLUMN categories_id`);
      console.log('Đã xóa trường categories_id');
    }
    // Xử lý trường hợp chỉ có trường categories_id
    else if (!hasCategoryId && hasCategoriesId) {
      console.log('Chỉ có trường categories_id. Đang đổi tên thành category_id...');
      
      // Đổi tên trường categories_id thành category_id
      await connection.query(`ALTER TABLE school_supplies CHANGE COLUMN categories_id category_id INT`);
      console.log('Đã đổi tên trường categories_id thành category_id');
    }
    // Xử lý trường hợp không có trường category_id
    else if (!hasCategoryId && !hasCategoriesId) {
      console.log('Không có trường category_id. Đang thêm trường category_id...');
      
      // Thêm trường category_id
      await connection.query(`
        ALTER TABLE school_supplies ADD COLUMN category_id INT,
        ADD FOREIGN KEY (category_id) REFERENCES categories(id)
      `);
      console.log('Đã thêm trường category_id');
    }
    
    // Sửa lỗi tên sản phẩm
    console.log('Đang sửa lỗi tên sản phẩm...');
    
    // Cập nhật tên sản phẩm
    const updateNameQueries = [
      `UPDATE school_supplies SET name = 'Bút bi Thiên Long TL-027' WHERE name = 'Bút bi Thiên Long' OR name LIKE '%Bút bi Thiên Long%' OR name LIKE '%Thiên Long TL-027%'`,
      `UPDATE school_supplies SET name = 'Bút gel màu Pentel Hybrid Dual Metallic' WHERE name = 'Bút gel màu' OR name LIKE '%Bút gel màu%' OR name LIKE '%Pentel Hybrid%'`,
      `UPDATE school_supplies SET name = 'Bút chì 2B Staedtler' WHERE name = 'Bút chì 2B' OR name LIKE '%Bút chì 2B%' OR name LIKE '%Staedtler%'`,
      `UPDATE school_supplies SET name = 'Bút highlight pastel Stabilo Boss' WHERE name = 'Bút highlight pastel' OR name LIKE '%Bút highlight%' OR name LIKE '%Stabilo Boss%'`,
      `UPDATE school_supplies SET name = 'Bút lông dầu Artline 70' WHERE name = 'Bút lông dầu' OR name LIKE '%Bút lông dầu%' OR name LIKE '%Artline 70%'`
    ];
    
    for (const query of updateNameQueries) {
      await connection.query(query);
    }
    
    console.log('Đã sửa lỗi tên sản phẩm');
    
    // Cập nhật danh mục cho các sản phẩm
    console.log('Đang cập nhật danh mục cho các sản phẩm...');
    
    // Kiểm tra xem các danh mục có tồn tại không
    const categoryQueries = [
      `UPDATE school_supplies SET category_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Văn phòng') WHERE name LIKE '%kẹp%' OR name LIKE '%ghim%' OR name LIKE '%bấm%' OR name LIKE '%thước%' OR name LIKE '%kéo%' OR name LIKE '%dao%' OR name LIKE '%băng keo%' OR name LIKE '%giấy note%' OR name LIKE '%giấy in%' OR name LIKE '%file%' OR name LIKE '%kệ%' OR name LIKE '%dập ghim%' OR name LIKE '%đục lỗ%'`,
      
      `UPDATE school_supplies SET category_id = (SELECT id FROM categories WHERE name = 'Bút và Viết') WHERE name LIKE '%bút%' OR name LIKE '%viết%' OR name LIKE '%chì%' OR name LIKE '%mực%' OR name LIKE '%marker%' OR name LIKE '%highlight%' OR name LIKE '%gel%' OR name LIKE '%lông%'`,
      
      `UPDATE school_supplies SET category_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Vẽ') WHERE name LIKE '%màu%' OR name LIKE '%vẽ%' OR name LIKE '%cọ%' OR name LIKE '%palette%' OR name LIKE '%canvas%' OR name LIKE '%giấy vẽ%' OR name LIKE '%sơn%' OR name LIKE '%bảng vẽ%' OR name LIKE '%chì màu%' OR name LIKE '%sáp màu%'`,
      
      `UPDATE school_supplies SET category_id = (SELECT id FROM categories WHERE name = 'Dụng cụ Đo lường') WHERE name LIKE '%thước%' OR name LIKE '%compa%' OR name LIKE '%ê-ke%' OR name LIKE '%êke%' OR name LIKE '%đo%' OR name LIKE '%thước đo%' OR name LIKE '%thước kẻ%' OR name LIKE '%thước dây%' OR name LIKE '%thước góc%'`,
      
      `UPDATE school_supplies SET category_id = (SELECT id FROM categories WHERE name = 'Sổ và Giấy') WHERE name LIKE '%sổ%' OR name LIKE '%vở%' OR name LIKE '%tập%' OR name LIKE '%nhật ký%' OR name LIKE '%diary%' OR name LIKE '%notebook%' OR name LIKE '%giấy%' OR name LIKE '%giấy note%' OR name LIKE '%giấy in%'`,
      
      `UPDATE school_supplies SET category_id = (SELECT id FROM categories WHERE name = 'Phụ kiện Học tập') WHERE name LIKE '%cặp%' OR name LIKE '%túi%' OR name LIKE '%balo%' OR name LIKE '%hộp bút%' OR name LIKE '%gọt%' OR name LIKE '%tẩy%' OR name LIKE '%ba lô%'`,
      
      `UPDATE school_supplies SET category_id = (SELECT id FROM categories WHERE name = 'Khác') WHERE category_id IS NULL OR category_id = 0`
    ];
    
    for (const query of categoryQueries) {
      try {
        await connection.query(query);
      } catch (err) {
        console.error(`Lỗi khi thực hiện truy vấn: ${err.message}`);
      }
    }
    
    console.log('Đã cập nhật danh mục cho các sản phẩm');
    
    // Kiểm tra kết quả
    const [categoryStats] = await connection.query(`
      SELECT c.name as category_name, COUNT(s.id) as product_count
      FROM categories c
      LEFT JOIN school_supplies s ON c.id = s.category_id
      GROUP BY c.id, c.name
      ORDER BY c.name
    `);
    
    console.log('\nThống kê sản phẩm theo danh mục:');
    categoryStats.forEach(stat => {
      console.log(`${stat.category_name}: ${stat.product_count} sản phẩm`);
    });
    
    // Kiểm tra sản phẩm không có danh mục
    const [noCategory] = await connection.query(`
      SELECT id, name
      FROM school_supplies
      WHERE category_id IS NULL OR category_id = 0
    `);
    
    if (noCategory.length > 0) {
      console.log('\nSản phẩm không có danh mục:');
      noCategory.forEach(product => {
        console.log(`ID: ${product.id}, Tên: ${product.name}`);
      });
    } else {
      console.log('\nTất cả sản phẩm đã được gán danh mục');
    }
    
    console.log('\nĐã hoàn thành việc sửa lỗi cơ sở dữ liệu');
    
  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

// Thực thi hàm sửa lỗi cơ sở dữ liệu
fixDatabase();