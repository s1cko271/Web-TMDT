// vite.proxy.js
// File này cấu hình proxy cho Vite để chuyển tiếp các yêu cầu API từ frontend đến backend

module.exports = {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    secure: false,
    ws: true,
  }
};