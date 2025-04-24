# Hướng dẫn tích hợp mã QR vào trang web

Tài liệu này mô tả chi tiết các bước để tích hợp mã QR thanh toán vào trang web thương mại điện tử, cho phép khách hàng thanh toán bằng các ví điện tử như MoMo, ZaloPay.

## 1. Tổng quan về hệ thống

Hệ thống thanh toán QR bao gồm các thành phần chính sau:

- **Backend API**: Tạo mã QR động, xử lý webhook từ các nhà cung cấp dịch vụ thanh toán
- **Frontend Component**: Hiển thị mã QR, kiểm tra trạng thái thanh toán
- **Nhà cung cấp dịch vụ thanh toán**: MoMo, ZaloPay, VNPAY, v.v.

## 2. Các bước tích hợp

### 2.1. Thiết lập API Backend

1. **Tạo API endpoint để tạo mã QR**
   - Endpoint: `/api/payments/generate-qr`
   - Phương thức: POST
   - Tham số: `amount`, `paymentMethod`, `orderId` (tùy chọn)
   - Kết quả trả về: Mã QR dạng base64, orderId, deeplink

2. **Tạo API endpoint để kiểm tra trạng thái thanh toán**
   - Endpoint: `/api/payments/status/:orderId`
   - Phương thức: GET
   - Kết quả trả về: Trạng thái thanh toán (pending, completed, failed)

3. **Tạo webhook để nhận thông báo từ nhà cung cấp dịch vụ thanh toán**
   - Endpoint: `/api/payments/ipn/:provider`
   - Phương thức: POST
   - Xử lý: Cập nhật trạng thái thanh toán trong cơ sở dữ liệu

### 2.2. Tích hợp với nhà cung cấp dịch vụ thanh toán

1. **Đăng ký tài khoản merchant với các nhà cung cấp dịch vụ thanh toán**
   - MoMo: https://business.momo.vn
   - ZaloPay: https://merchant.zalopay.vn
   - VNPAY: https://vnpay.vn

2. **Lấy thông tin xác thực API**
   - Partner Code/App ID
   - Access Key/Secret Key
   - Cấu hình URL callback (IPN URL)

3. **Cấu hình thông tin xác thực trong file .env**
   ```
   # MoMo
   MOMO_PARTNER_CODE=xxx
   MOMO_ACCESS_KEY=xxx
   MOMO_SECRET_KEY=xxx
   
   # ZaloPay
   ZALOPAY_APP_ID=xxx
   ZALOPAY_KEY1=xxx
   ZALOPAY_KEY2=xxx
   
   # VNPAY
   VNPAY_TMN_CODE=xxx
   VNPAY_HASH_SECRET=xxx
   ```

### 2.3. Tạo Component Frontend

1. **Tạo component React để hiển thị mã QR**
   - Gọi API để tạo mã QR
   - Hiển thị mã QR và hướng dẫn thanh toán
   - Kiểm tra trạng thái thanh toán định kỳ

2. **Tích hợp component vào trang thanh toán**
   - Thêm component vào form thanh toán
   - Xử lý các sự kiện khi thanh toán hoàn tất

## 3. Luồng thanh toán

1. **Khách hàng chọn phương thức thanh toán** (MoMo, ZaloPay, VNPAY)
2. **Frontend gọi API để tạo mã QR**
3. **Backend tạo mã QR và trả về cho Frontend**
4. **Frontend hiển thị mã QR cho khách hàng**
5. **Khách hàng quét mã QR bằng ứng dụng ví điện tử**
6. **Khách hàng xác nhận thanh toán trong ứng dụng**
7. **Nhà cung cấp dịch vụ thanh toán gửi webhook đến Backend**
8. **Backend cập nhật trạng thái thanh toán**
9. **Frontend kiểm tra trạng thái thanh toán và hiển thị kết quả**

## 4. Xử lý lỗi và tình huống đặc biệt

1. **Mất kết nối internet**
   - Hiển thị thông báo lỗi và cho phép thử lại
   - Lưu trạng thái thanh toán để khôi phục khi kết nối trở lại

2. **Thanh toán bị hủy hoặc thất bại**
   - Hiển thị thông báo lỗi và cho phép thử lại hoặc chọn phương thức thanh toán khác
   - Ghi log lỗi để phân tích nguyên nhân

3. **Webhook không được gửi đến**
   - Thiết lập cơ chế kiểm tra trạng thái thanh toán định kỳ
   - Cho phép khách hàng xác nhận thanh toán thủ công

## 5. Bảo mật

1. **Xác thực webhook**
   - Kiểm tra chữ ký số từ nhà cung cấp dịch vụ thanh toán
   - Xác minh thông tin giao dịch

2. **Bảo vệ thông tin thanh toán**
   - Sử dụng HTTPS cho tất cả các kết nối
   - Không lưu trữ thông tin nhạy cảm

3. **Ngăn chặn tấn công**
   - Giới hạn số lần thử lại
   - Sử dụng CSRF token

## 6. Kiểm thử

1. **Kiểm thử trong môi trường sandbox**
   - Sử dụng tài khoản test của nhà cung cấp dịch vụ thanh toán
   - Kiểm tra các tình huống thành công và thất bại

2. **Kiểm thử tích hợp**
   - Kiểm tra luồng thanh toán đầy đủ
   - Kiểm tra xử lý lỗi

## 7. Triển khai

1. **Cấu hình môi trường production**
   - Cập nhật thông tin xác thực API
   - Cấu hình URL callback

2. **Giám sát và bảo trì**
   - Thiết lập hệ thống giám sát
   - Cập nhật khi có thay đổi từ nhà cung cấp dịch vụ thanh toán

## 8. Tài liệu tham khảo

- [Tài liệu API MoMo](https://developers.momo.vn)
- [Tài liệu API ZaloPay](https://docs.zalopay.vn)
- [Tài liệu API VNPAY](https://sandbox.vnpayment.vn/apis)