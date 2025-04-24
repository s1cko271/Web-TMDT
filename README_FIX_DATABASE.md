# Hướng dẫn sửa lỗi cơ sở dữ liệu

Tài liệu này hướng dẫn cách sửa lỗi tên sản phẩm và cập nhật danh mục trong cơ sở dữ liệu của ứng dụng.

## Vấn đề hiện tại

Hiện tại, cơ sở dữ liệu đang gặp hai vấn đề chính:

1. **Không nhất quán về tên trường danh mục**: Có sự không nhất quán giữa việc sử dụng `category_id` và `categories_id` trong bảng `school_supplies`.
2. **Tên sản phẩm không chính xác**: Nhiều sản phẩm có tên không đầy đủ hoặc thiếu thông tin chi tiết.
3. **Danh mục không đầy đủ sản phẩm**: Một số danh mục không có sản phẩm hoặc sản phẩm chưa được phân loại đúng.

## Giải pháp

Để giải quyết các vấn đề trên, hai tệp đã được tạo:

1. **`fix_database.sql`**: Tệp SQL chứa các câu lệnh để sửa lỗi cơ sở dữ liệu.
2. **`fix_database_execute.js`**: Script JavaScript để thực thi các câu lệnh SQL tự động.

## Cách thực hiện

### Phương pháp 1: Sử dụng MySQL Workbench

1. Mở MySQL Workbench và kết nối đến cơ sở dữ liệu của ứng dụng.
2. Mở tệp `fix_database.sql`.
3. Thực thi từng câu lệnh SQL theo thứ tự để:
   - Kiểm tra trường danh mục hiện tại
   - Chuẩn hóa trường danh mục (sử dụng `category_id`)
   - Sửa lỗi tên sản phẩm
   - Cập nhật danh mục cho các sản phẩm

### Phương pháp 2: Sử dụng Script JavaScript

1. Mở terminal hoặc command prompt.
2. Di chuyển đến thư mục dự án.
3. Chạy lệnh sau để thực thi script:

```bash
node fix_database_execute.js
```

Script sẽ tự động:
- Kết nối đến cơ sở dữ liệu
- Kiểm tra và chuẩn hóa trường danh mục
- Sửa lỗi tên sản phẩm
- Cập nhật danh mục cho các sản phẩm
- Hiển thị thống kê sản phẩm theo danh mục

## Chi tiết sửa lỗi

### 1. Chuẩn hóa trường danh mục

Script sẽ xử lý các trường hợp sau:

- Nếu cả hai trường `category_id` và `categories_id` cùng tồn tại: Dữ liệu sẽ được chuyển từ `categories_id` sang `category_id`, sau đó xóa trường `categories_id`.
- Nếu chỉ có trường `categories_id`: Đổi tên thành `category_id`.
- Nếu không có trường nào: Tạo trường `category_id` mới.

### 2. Sửa lỗi tên sản phẩm

Các tên sản phẩm sẽ được cập nhật với thông tin đầy đủ hơn, bao gồm thương hiệu và mã sản phẩm. Ví dụ:

- "Bút bi Thiên Long" → "Bút bi Thiên Long TL-027"
- "Bút gel màu" → "Bút gel màu Pentel Hybrid Dual Metallic"

### 3. Cập nhật danh mục

Sản phẩm sẽ được phân loại vào các danh mục phù hợp dựa trên tên sản phẩm. Các danh mục bao gồm:

- Dụng cụ Văn phòng
- Bút và Viết
- Dụng cụ Vẽ
- Dụng cụ Đo lường
- Sổ và Giấy
- Phụ kiện Học tập
- Khác

## Sau khi sửa lỗi

Sau khi chạy script thành công:

1. Tất cả sản phẩm sẽ có tên chính xác và đầy đủ thông tin hơn.
2. Mỗi sản phẩm sẽ được gán vào đúng danh mục.
3. Các danh mục sẽ hiển thị đầy đủ sản phẩm liên quan.
4. Ứng dụng sẽ hoạt động chính xác khi người dùng tìm kiếm hoặc lọc sản phẩm theo danh mục.