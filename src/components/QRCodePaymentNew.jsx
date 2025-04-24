import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './QRCodePayment.css';

const QRCodePaymentNew = ({ paymentMethod, amount, onPaymentComplete }) => {
  const { t } = useTranslation();
  const [qrCode, setQrCode] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, completed, failed
  
  // Xác định thông tin dựa trên phương thức thanh toán
  const getPaymentInfo = () => {
    switch(paymentMethod) {
      case 'momo':
        return {
          title: 'MoMo',
          color: '#ae2070',
          instructions: t('checkoutPage.qrInstructions.momo', 'Quét mã QR bằng ứng dụng MoMo để thanh toán')
        };
      case 'zalopay':
        return {
          title: 'ZaloPay',
          color: '#0068ff',
          instructions: t('checkoutPage.qrInstructions.zalopay', 'Quét mã QR bằng ứng dụng ZaloPay để thanh toán')
        };
      case 'vnpay':
        return {
          title: 'VNPAY',
          color: '#e50019',
          instructions: t('checkoutPage.qrInstructions.vnpay', 'Quét mã QR bằng ứng dụng VNPAY để thanh toán')
        };
      default:
        return null;
    }
  };
  
  // Tạo mã QR khi component được tải
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.post('/api/payments/generate-qr', {
          amount,
          paymentMethod
        });
        
        if (response.data.success) {
          setQrCode(response.data.data.qrCode);
          setOrderId(response.data.data.orderId);
        } else {
          setError(t('checkoutPage.qrGenerationError', 'Không thể tạo mã QR. Vui lòng thử lại.'));
        }
      } catch (err) {
        console.error('Lỗi khi tạo mã QR:', err);
        setError(t('checkoutPage.qrGenerationError', 'Không thể tạo mã QR. Vui lòng thử lại.'));
      } finally {
        setLoading(false);
      }
    };
    
    generateQRCode();
  }, [paymentMethod, amount, t]);
  
  // Kiểm tra trạng thái thanh toán
  useEffect(() => {
    let intervalId;
    
    if (orderId && paymentStatus === 'pending') {
      // Kiểm tra trạng thái thanh toán mỗi 3 giây
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`/api/payments/status/${orderId}`);
          
          if (response.data.success) {
            const { status } = response.data.data;
            setPaymentStatus(status);
            
            if (status === 'completed') {
              // Thông báo cho component cha rằng thanh toán đã hoàn tất
              if (onPaymentComplete) {
                onPaymentComplete(orderId);
              }
              clearInterval(intervalId);
            }
          }
        } catch (err) {
          console.error('Lỗi khi kiểm tra trạng thái thanh toán:', err);
        }
      }, 3000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderId, paymentStatus, onPaymentComplete]);
  
  // Hàm mô phỏng thanh toán thành công (chỉ dùng cho demo)
  const simulatePayment = async () => {
    try {
      const response = await axios.post('/api/payments/simulate-payment', {
        orderId
      });
      
      if (response.data.success) {
        setPaymentStatus('completed');
        if (onPaymentComplete) {
          onPaymentComplete(orderId);
        }
      }
    } catch (err) {
      console.error('Lỗi khi mô phỏng thanh toán:', err);
    }
  };
  
  const paymentInfo = getPaymentInfo();
  
  if (!paymentInfo) return null;
  
  return (
    <div className="qr-payment-container">
      <h3 className="qr-payment-title" style={{ color: paymentInfo.color }}>
        {t('checkoutPage.payWith', 'Thanh toán với')} {paymentInfo.title}
      </h3>
      
      {loading ? (
        <div className="qr-loading">
          <p>{t('checkoutPage.generatingQR', 'Đang tạo mã QR...')}</p>
        </div>
      ) : error ? (
        <div className="qr-error">
          <p>{error}</p>
          <button 
            className="btn btn-primary retry-btn"
            onClick={() => window.location.reload()}
          >
            {t('checkoutPage.retry', 'Thử lại')}
          </button>
        </div>
      ) : (
        <>
          <div className="qr-code-wrapper">
            {paymentStatus === 'completed' ? (
              <div className="payment-success">
                <i className="fas fa-check-circle"></i>
                <p>{t('checkoutPage.paymentSuccess', 'Thanh toán thành công!')}</p>
              </div>
            ) : (
              <img src={qrCode} alt={`${paymentInfo.title} QR Code`} className="qr-code-image" />
            )}
          </div>
          
          {paymentStatus === 'pending' && (
            <div className="qr-payment-instructions">
              <p className="instruction-text">{paymentInfo.instructions}</p>
              <p className="amount-text">
                {t('checkoutPage.amount', 'Số tiền')}: <strong>{amount.toLocaleString()} VND</strong>
              </p>
              <div className="qr-payment-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <p>{t('checkoutPage.qrSteps.step1', 'Mở ứng dụng')}</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <p>{t('checkoutPage.qrSteps.step2', 'Quét mã QR')}</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <p>{t('checkoutPage.qrSteps.step3', 'Xác nhận thanh toán')}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="qr-payment-note">
            {paymentStatus === 'completed' ? (
              <p>{t('checkoutPage.qrNoteSuccess', 'Thanh toán đã được xác nhận. Đơn hàng của bạn đang được xử lý.')}</p>
            ) : (
              <p>{t('checkoutPage.qrNote', 'Đơn hàng sẽ được xác nhận tự động sau khi thanh toán thành công')}</p>
            )}
          </div>
          
          {/* Nút mô phỏng thanh toán (chỉ dùng cho demo) */}
          {process.env.NODE_ENV !== 'production' && paymentStatus === 'pending' && (
            <button 
              className="btn btn-primary simulate-btn" 
              onClick={simulatePayment}
              style={{ marginTop: '15px' }}
            >
              {t('checkoutPage.simulatePayment', 'Mô phỏng thanh toán thành công')}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default QRCodePaymentNew;