import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files
import enTranslation from './locales/en.json';
import viTranslation from './locales/vi.json';

// Add checkout page translations
viTranslation.checkoutPage = {
  checkout: 'Thanh toán',
  shippingInformation: 'Thông tin giao hàng',
  firstName: 'Tên',
  lastName: 'Họ',
  emailAddress: 'Địa chỉ email',
  address: 'Địa chỉ',
  city: 'Thành phố',
  state: 'Tỉnh/Thành phố',
  zipCode: 'Mã bưu điện',
  country: 'Quốc gia',
  unitedStates: 'Hoa Kỳ',
  canada: 'Canada',
  unitedKingdom: 'Vương quốc Anh',
  australia: 'Úc',
  germany: 'Đức',
  france: 'Pháp',
  paymentInformation: 'Thông tin thanh toán',
  paymentMethod: 'Phương thức thanh toán',
  nameOnCard: 'Tên trên thẻ',
  cardNumber: 'Số thẻ',
  expirationMonth: 'Tháng hết hạn',
  expirationYear: 'Năm hết hạn',
  cvv: 'CVV',
  month: 'Tháng',
  year: 'Năm',
  orderSummary: 'Tóm tắt đơn hàng',
  subtotal: 'Tạm tính',
  shipping: 'Phí vận chuyển',
  tax: 'Thuế',
  total: 'Tổng cộng',
  placeOrder: 'Đặt hàng',
  backToCart: 'Quay lại giỏ hàng',
  orderSuccess: 'Đặt hàng thành công! Cảm ơn bạn đã mua sắm.',
  noItemsSelected: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.',
  qty: 'SL:',
  weAccept: 'Chúng tôi chấp nhận',
  momoInstructions: 'Bạn sẽ được chuyển đến ứng dụng MoMo để hoàn tất thanh toán sau khi đặt hàng.',
  zalopayInstructions: 'Bạn sẽ được chuyển đến ứng dụng ZaloPay để hoàn tất thanh toán sau khi đặt hàng.',
  vnpayInstructions: 'Bạn sẽ được chuyển đến cổng thanh toán VNPAY để hoàn tất thanh toán sau khi đặt hàng.',
  payWith: 'Thanh toán với',
  amount: 'Số tiền',
  qrNote: 'Đơn hàng sẽ được xác nhận tự động sau khi thanh toán thành công',
  qrInstructions: {
    momo: 'Quét mã QR bằng ứng dụng MoMo để thanh toán',
    zalopay: 'Quét mã QR bằng ứng dụng ZaloPay để thanh toán',
    vnpay: 'Quét mã QR bằng ứng dụng VNPAY để thanh toán'
  },
  qrSteps: {
    step1: 'Mở ứng dụng',
    step2: 'Quét mã QR',
    step3: 'Xác nhận thanh toán'
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      vi: {
        translation: viTranslation
      }
    },
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;