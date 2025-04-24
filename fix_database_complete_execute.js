// Script JavaScript để thực thi các câu lệnh SQL từ file fix_database_complete_v2.sql

const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

// Đọc cấu hình kết nối từ file .env
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_supplies_db',
  port: process.env.DB_PORT || 3306
};

// Đọc file SQL
const readSqlFile = (filePath) => {
  try {
    const fullPath = path.resolve(filePath);
    console.log(`Đọc file SQL từ: ${fullPath}`);
    return fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.error(`Lỗi khi đọc file SQL: ${error.message}`);
    process.exit(1);
  }
};

// Phân tách các câu lệnh SQL
const splitSqlStatements = (sqlContent) => {
  // Phân tách theo dấu chấm phẩy và bỏ qua các comment
  const statements = [];
  let currentStatement = '';
  let inComment = false;
  
  const lines = sqlContent.split('\n');
  for (const line of lines) {
    // Bỏ qua các dòng comment
    if (line.trim().startsWith('--')) continue;
    
    // Thêm dòng vào câu lệnh hiện tại
    currentStatement += line + '\n';
    
    // Nếu dòng kết thúc bằng dấu chấm phẩy, đó là một câu lệnh hoàn chỉnh
    if (line.trim().endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }
  
  return statements.filter(stmt => stmt.length > 0);
};

// Thực thi các câu lệnh SQL
const executeSqlStatements = async (statements) => {
  let connection;
  try {
    // Kết nối đến cơ sở dữ liệu
    console.log('Đang kết nối đến cơ sở dữ liệu...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Đã kết nối thành công!');
    
    // Thực thi từng câu lệnh SQL
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        console.log(`Đang thực thi câu lệnh ${i + 1}/${statements.length}...`);
        const [results] = await connection.query(stmt);
        
        // Hiển thị kết quả nếu là câu lệnh SELECT
        if (stmt.trim().toUpperCase().startsWith('SELECT')) {
          console.log('Kết quả:');
          console.table(results);
        } else {
          console.log(`Thực thi thành công: ${results.affectedRows || 0} dòng bị ảnh hưởng`);
        }
      } catch (error) {
        console.error(`Lỗi khi thực thi câu lệnh: ${error.message}`);
        console.error(`Câu lệnh gây lỗi: ${stmt}`);
      }
    }
    
    console.log('Đã hoàn thành việc thực thi tất cả các câu lệnh SQL!');
  } catch (error) {
    console.error(`Lỗi kết nối đến cơ sở dữ liệu: ${error.message}`);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Đã đóng kết nối đến cơ sở dữ liệu.');
    }
  }
};

// Hàm chính
const main = async () => {
  try {
    // Đường dẫn đến file SQL
    const sqlFilePath = path.join(__dirname, 'fix_database_complete_v2.sql');
    
    // Đọc nội dung file SQL
    const sqlContent = readSqlFile(sqlFilePath);
    
    // Phân tách các câu lệnh SQL
    const statements = splitSqlStatements(sqlContent);
    console.log(`Đã phân tách được ${statements.length} câu lệnh SQL.`);
    
    // Thực thi các câu lệnh SQL
    await executeSqlStatements(statements);
  } catch (error) {
    console.error(`Lỗi: ${error.message}`);
  }
};

// Chạy chương trình
main();