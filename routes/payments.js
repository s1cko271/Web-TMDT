const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Lưu trữ tạm thời thông tin thanh toán (trong thực tế nên lưu vào database)
const paymentTransactions = {};

/**
 * @route   POST /api/payments/generate-qr
 * @desc    Tạo mã QR cho thanh toán
 * @access  Public
 */
router.post('/generate-qr', async (req, res) => {
  try {
    const { amount, paymentMethod, orderId = uuidv4() } = req.body;
    
    if (!amount || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp số tiền và phương thức thanh toán' 
      });
    }
    
    // Tạo thông tin thanh toán dựa trên phương thức
    let paymentInfo;
    let deeplink;
    
    switch(paymentMethod) {
      case 'momo':
        // Trong thực tế, đây sẽ là thông tin từ MoMo API
        paymentInfo = {
          partnerCode: 'MOMOXXX',
          amount: amount,
          orderId: orderId,
          orderInfo: `Thanh toán đơn hàng #${orderId}`,
          redirectUrl: `${req.protocol}://${req.get('host')}/checkout/confirm`,
          ipnUrl: `${req.protocol}://${req.get('host')}/api/payments/ipn/momo`,
          requestType: 'captureWallet'
        };
        deeplink = `momo://app?action=payment&amount=${amount}&orderId=${orderId}`;
        break;
      
      case 'zalopay':
        // Trong thực tế, đây sẽ là thông tin từ ZaloPay API
        paymentInfo = {
          appid: 'ZALOPAYYY',
          amount: amount,
          apptransid: orderId,
          apptime: Date.now(),
          appuser: 'user',
          embeddata: JSON.stringify({
            orderId: orderId,
            redirecturl: `${req.protocol}://${req.get('host')}/checkout/confirm`
          })
        };
        deeplink = `zalopay://app?zptoken=${orderId}&amount=${amount}`;
        break;
      
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Phương thức thanh toán không được hỗ trợ' 
        });
    }
    
    // Tạo chuỗi dữ liệu cho mã QR
    const qrData = JSON.stringify({
      paymentMethod,
      orderId,
      amount,
      timestamp: Date.now(),
      deeplink
    });
    
    // Tạo mã QR dạng base64
    const qrCodeBase64 = await QRCode.toDataURL(qrData);
    
    // Lưu thông tin giao dịch
    paymentTransactions[orderId] = {
      paymentMethod,
      amount,
      status: 'pending',
      createdAt: new Date(),
      qrCode: qrCodeBase64
    };
    
    res.json({
      success: true,
      data: {
        orderId,
        qrCode: qrCodeBase64,
        deeplink,
        amount,
        paymentMethod
      }
    });
  } catch (error) {
    console.error('Lỗi khi tạo mã QR:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi tạo mã QR' 
    });
  }
});

/**
 * @route   GET /api/payments/status/:orderId
 * @desc    Kiểm tra trạng thái thanh toán
 * @access  Public
 */
router.get('/status/:orderId', (req, res) => {
  const { orderId } = req.params;
  
  if (!paymentTransactions[orderId]) {
    return res.status(404).json({ 
      success: false, 
      message: 'Không tìm thấy thông tin thanh toán' 
    });
  }
  
  res.json({
    success: true,
    data: {
      orderId,
      status: paymentTransactions[orderId].status,
      paymentMethod: paymentTransactions[orderId].paymentMethod,
      amount: paymentTransactions[orderId].amount
    }
  });
});

/**
 * @route   POST /api/payments/ipn/:provider
 * @desc    Webhook cho các dịch vụ thanh toán (IPN - Instant Payment Notification)
 * @access  Public
 */
router.post('/ipn/:provider', (req, res) => {
  const { provider } = req.params;
  const payload = req.body;
  
  // Trong thực tế, cần xác thực chữ ký từ nhà cung cấp dịch vụ thanh toán
  // và cập nhật trạng thái đơn hàng trong database
  
  try {
    let orderId;
    let status;
    
    switch(provider) {
      case 'momo':
        orderId = payload.orderId;
        status = payload.resultCode === 0 ? 'completed' : 'failed';
        break;
        
      case 'zalopay':
        orderId = payload.apptransid;
        status = payload.status === 1 ? 'completed' : 'failed';
        break;
        
      default:
        return res.status(400).json({ message: 'Nhà cung cấp không được hỗ trợ' });
    }
    
    if (paymentTransactions[orderId]) {
      paymentTransactions[orderId].status = status;
      paymentTransactions[orderId].updatedAt = new Date();
    }
    
    // Trả về response theo định dạng mà nhà cung cấp yêu cầu
    if (provider === 'momo') {
      return res.json({ status: 0, message: 'Thành công' });
    } else if (provider === 'zalopay') {
      return res.json({ return_code: 1, return_message: 'Thành công' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(`Lỗi xử lý IPN từ ${provider}:`, error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

/**
 * @route   POST /api/payments/simulate-payment
 * @desc    API giả lập để mô phỏng thanh toán thành công (chỉ dùng cho demo)
 * @access  Public
 */
router.post('/simulate-payment', (req, res) => {
  const { orderId } = req.body;
  
  if (!orderId || !paymentTransactions[orderId]) {
    return res.status(404).json({ 
      success: false, 
      message: 'Không tìm thấy thông tin thanh toán' 
    });
  }
  
  // Cập nhật trạng thái thanh toán thành công
  paymentTransactions[orderId].status = 'completed';
  paymentTransactions[orderId].updatedAt = new Date();
  
  res.json({
    success: true,
    message: 'Thanh toán đã được mô phỏng thành công',
    data: {
      orderId,
      status: 'completed'
    }
  });
});

module.exports = router;