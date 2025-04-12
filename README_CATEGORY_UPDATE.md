# Hướng dẫn cập nhật danh mục sản phẩm

File này hướng dẫn cách thực hiện cập nhật danh mục cho các sản phẩm trong cơ sở dữ liệu của ứng dụng.

## Vấn đề hiện tại

Hiện tại, các danh mục đã được tạo trong bảng `categories` nhưng chưa có sản phẩm nào được gán vào các danh mục đó. Điều này dẫn đến việc khi chọn một danh mục, không có sản phẩm nào được hiển thị.

## Giải pháp

File `update_categories.sql` đã được tạo để cập nhật trường `category_id` (hoặc `categories_id`) trong bảng `school_supplies`, gán mỗi sản phẩm vào danh mục phù hợp dựa trên tên sản phẩm.

## Cách thực hiện

### Bước 1: Mở MySQL Workbench

- Mở MySQL Workbench và kết nối đến cơ sở dữ liệu của ứng dụng.

### Bước 2: Kiểm tra tên trường danh mục

- Trước khi chạy các câu lệnh UPDATE, bạn cần xác định tên trường chính xác được sử dụng trong bảng `school_supplies`. Chạy câu lệnh sau:

```sql
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'school_supplies' 
AND COLUMN_NAME IN ('category_id', 'categories_id');
```

### Bước 3: Chỉnh sửa file SQL

- Mở file `update_categories.sql` trong một trình soạn thảo văn bản.
- Thay thế tất cả các phần `[CATEGORY_FIELD]` bằng tên trường chính xác (là `category_id` hoặc `categories_id`) dựa trên kết quả từ Bước 2.

### Bước 4: Chạy file SQL

- Trong MySQL Workbench, mở file `update_categories.sql` đã chỉnh sửa.
- Chạy các câu lệnh SQL để cập nhật danh mục cho các sản phẩm hiện có.
- Nếu bảng `school_supplies` chưa có dữ liệu, các câu lệnh INSERT sẽ thêm các sản phẩm mẫu vào các danh mục tương ứng.

## Cấu trúc file SQL

File SQL bao gồm các phần chính:

1. **Kiểm tra tên trường danh mục**: Xác định tên trường chính xác (`category_id` hoặc `categories_id`).
2. **Cập nhật danh mục cho sản phẩm hiện có**: Các câu lệnh UPDATE để gán sản phẩm vào danh mục dựa trên tên sản phẩm.
3. **Thêm sản phẩm mẫu**: Các câu lệnh INSERT để thêm sản phẩm mẫu vào các danh mục nếu bảng chưa có dữ liệu.

## Danh mục và sản phẩm

File SQL cập nhật và thêm sản phẩm cho 5 danh mục chính:

1. **Dụng cụ Văn phòng**: Kẹp giấy, ghim bấm, băng keo, giấy note, kéo...
2. **Bút và Viết**: Bút bi, bút gel, bút chì, bút highlight...
3. **Dụng cụ Vẽ**: Màu nước, cọ vẽ, giấy vẽ, bút chì màu...
4. **Dụng cụ Đo lường**: Thước kẻ, compa, ê-ke, thước đo độ...
5. **Phụ kiện Học tập**: Balo, hộp bút, tẩy, gọt bút chì, vở...

## Sau khi chạy SQL

Sau khi chạy thành công file SQL, các sản phẩm sẽ được gán vào danh mục tương ứng và sẽ hiển thị khi người dùng chọn danh mục trên trang web.