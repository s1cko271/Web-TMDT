import React from 'react';
import { useTranslation } from 'react-i18next';
import momoQR from '../assets/payment-icons/momo-qr.svg';
import zalopayQR from '../assets/payment-icons/zalopay-qr.svg';
import vnpayQR from '../assets/payment-icons/vnpay-qr.svg';
import './QRCodePayment.css';

const QRCodePayment = ({ paymentMethod, amount }) => {
  const { t } = useTranslation();
  
  // Xác định mã QR và thông tin dựa trên phương thức thanh toán
  const getQRCodeInfo = () => {
    switch(paymentMethod) {
      case 'momo':
        return {
          qrImage: momoQR,
          title: 'MoMo',
          color: '#ae2070',
          instructions: t('checkoutPage.qrInstructions.momo', 'Quét mã QR bằng ứng dụng MoMo để thanh toán')
        };
      case 'zalopay':
        return {
          qrImage: zalopayQR,
          title: 'ZaloPay',
          color: '#0068ff',
          instructions: t('checkoutPage.qrInstructions.zalopay', 'Quét mã QR bằng ứng dụng ZaloPay để thanh toán')
        };
      case 'vnpay':
        return {
          qrImage: vnpayQR,
          title: 'VNPAY',
          color: '#e50019',
          instructions: t('checkoutPage.qrInstructions.vnpay', 'Quét mã QR bằng ứng dụng VNPAY để thanh toán')
        };
      default:
        return null;
    }
  };
  
  const qrInfo = getQRCodeInfo();
  
  if (!qrInfo) return null;
  
  return (
    <div className="qr-payment-container">
      <h3 className="qr-payment-title" style={{ color: qrInfo.color }}>
        {t('checkoutPage.payWith', 'Thanh toán với')} {qrInfo.title}
      </h3>
      
      <div className="qr-code-wrapper">
        <img src={qrInfo.qrImage} alt={`${qrInfo.title} QR Code`} className="qr-code-image" />
      </div>
      
      <div className="qr-payment-instructions">
        <p className="instruction-text">{qrInfo.instructions}</p>
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
      
      <div className="qr-payment-note">
        <p>{t('checkoutPage.qrNote', 'Đơn hàng sẽ được xác nhận tự động sau khi thanh toán thành công')}</p>
      </div>
    </div>
  );
};

export default QRCodePayment;