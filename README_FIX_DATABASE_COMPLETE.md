# Hướng dẫn sửa lỗi cơ sở dữ liệu toàn diện

Tài liệu này hướng dẫn cách sửa lỗi tên sản phẩm và cập nhật đầy đủ danh mục trong cơ sở dữ liệu của ứng dụng.

## Vấn đề hiện tại

Cơ sở dữ liệu đang gặp các vấn đề sau:

1. **Không nhất quán về tên trường danh mục**: Có sự không nhất quán giữa việc sử dụng `category_id` và `categories_id` trong bảng `school_supplies`.
2. **Tên sản phẩm không chính xác**: Nhiều sản phẩm có tên không đầy đủ hoặc thiếu thông tin chi tiết.
3. **Danh mục không đầy đủ sản phẩm**: Một số danh mục không có sản phẩm hoặc sản phẩm chưa được phân loại đúng.

## Giải pháp

Để giải quyết các vấn đề trên, các tệp sau đã được tạo:

1. **`fix_database_complete_v2.sql`**: Tệp SQL chứa các câu lệnh toàn diện để sửa lỗi cơ sở dữ liệu, bao gồm:
   - Chuẩn hóa trường danh mục (sử dụng `category_id`)
   - Sửa lỗi tên sản phẩm
   - Cập nhật đầy đủ danh mục cho tất cả sản phẩm
   - Kiểm tra và báo cáo kết quả

2. **`fix_database_complete_execute.js`**: Script JavaScript để thực thi các câu lệnh SQL tự động.

## Cách thực hiện

### Phương pháp 1: Sử dụng MySQL Workbench

1. Mở MySQL Workbench và kết nối đến cơ sở dữ liệu của ứng dụng.
2. Mở tệp `fix_database_complete_v2.sql`.
3. Thực thi từng câu lệnh SQL theo thứ tự để:
   - Kiểm tra trường danh mục hiện tại
   - Chuẩn hóa trường danh mục (sử dụng `category_id`)
   - Sửa lỗi tên sản phẩm
   - Cập nhật danh mục cho các sản phẩm
   - Kiểm tra kết quả

### Phương pháp 2: Sử dụng Script JavaScript

1. Mở terminal hoặc command prompt.
2. Di chuyển đến thư mục dự án.
3. Đảm bảo đã cài đặt các thư viện cần thiết:
   ```bash
   npm install mysql2 dotenv
   ```
4. Chạy lệnh sau để thực thi script:
   ```bash
   node fix_database_complete_execute.js
   ```

Script sẽ tự động:
- Kết nối đến cơ sở dữ liệu
- Kiểm tra và chuẩn hóa trường danh mục
- Sửa lỗi tên sản phẩm
- Cập nhật danh mục cho các sản phẩm
- Hiển thị thống kê sản phẩm theo danh mục

## Chi tiết sửa lỗi

### 1. Chuẩn hóa trường danh mục

Script sẽ kiểm tra xem trường nào đang được sử dụng (`category_id` hay `categories_id`) và chuẩn hóa thành `category_id`.

### 2. Sửa lỗi tên sản phẩm

Các sản phẩm sau sẽ được cập nhật tên đầy đủ:
- Bút bi Thiên Long TL-027
- Bút gel màu Pentel Hybrid Dual Metallic
- Bút chì 2B Staedtler
- Bút highlight pastel Stabilo Boss
- Bút lông dầu Artline 70
- Thước kẻ 30cm Thiên Long
- Compa Thiên Long C-019
- Hộp bút nhựa trong suốt
- Balo học sinh Hami BL001
- Vở ô ly 200 trang Campus NB-BSTY200
- Máy tính Casio FX-570VN Plus
- Bộ 10 viên phấn trắng
- Bìa nhựa đựng tài liệu
- Đèn bàn học LED

### 3. Cập nhật danh mục sản phẩm

Sản phẩm sẽ được phân loại vào các danh mục sau dựa trên tên sản phẩm:
- Dụng cụ Văn phòng
- Bút và Viết
- Dụng cụ Vẽ
- Dụng cụ Đo lường
- Sổ và Giấy
- Phụ kiện Học tập
- Đồ dùng Học sinh
- Thiết bị Văn phòng
- Khác (cho các sản phẩm không thuộc danh mục nào)

### 4. Kiểm tra kết quả

Sau khi thực hiện các bước trên, script sẽ kiểm tra:
- Các sản phẩm chưa được gán danh mục (nếu có)
- Số lượng sản phẩm trong mỗi danh mục
- Danh sách sản phẩm theo từng danh mục

## Lưu ý

- Trước khi chạy script, hãy sao lưu cơ sở dữ liệu để tránh mất dữ liệu.
- Nếu gặp lỗi khi thực thi script, hãy kiểm tra thông báo lỗi và điều chỉnh script nếu cần.
- Sau khi chạy script, hãy kiểm tra lại cơ sở dữ liệu để đảm bảo các thay đổi đã được áp dụng đúng.