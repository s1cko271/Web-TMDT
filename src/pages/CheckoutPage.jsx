import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useShopContext } from '../context/ShopContext';
import { useTranslation } from 'react-i18next';
import './CheckoutPage.css';
import './PaymentIcons.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartTotals, clearCart, getSelectedItems, removeFromCart } = useShopContext();
  const { t } = useTranslation();
  
  // Get cart totals from context (only for selected items)
  const { subtotal, shipping, tax, total } = getCartTotals();
  
  // Get selected cart items
  const selectedItems = getSelectedItems();
  // Get all cart items
  const allCartItems = useShopContext().cart;
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would process the payment and create an order
    
    if (selectedItems.length > 0) {
      // Process the order and remove only the selected items from cart
      selectedItems.forEach(item => removeFromCart(item.id));
      alert(t('checkoutPage.orderSuccess'));
      navigate('/');
    } else {
      alert(t('checkoutPage.noItemsSelected'));
    }
  };

  
  return (
    <div className="checkout-page">




      <div className="container">
        <h1 className="page-title">{t('checkoutPage.checkout')}</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form className="checkout-form" onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="form-section">
                <h2 className="section-title">{t('checkoutPage.shippingInformation')}</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">{t('checkoutPage.firstName')}</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">{t('checkoutPage.lastName')}</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">{t('checkoutPage.emailAddress')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">{t('checkoutPage.address')}</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">{t('checkoutPage.city')}</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state">{t('checkoutPage.state')}</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="zipCode">{t('checkoutPage.zipCode')}</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">{t('checkoutPage.country')}</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="United States">{t('checkoutPage.unitedStates')}</option>
                    <option value="Canada">{t('checkoutPage.canada')}</option>
                    <option value="United Kingdom">{t('checkoutPage.unitedKingdom')}</option>
                    <option value="Australia">{t('checkoutPage.australia')}</option>
                    <option value="Germany">{t('checkoutPage.germany')}</option>
                    <option value="France">{t('checkoutPage.france')}</option>
                    <option value="Vietnam">Việt Nam</option>
                  </select>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="form-section">
                <h2 className="section-title">{t('checkoutPage.paymentInformation')}</h2>
                
                <div className="form-group">
                  <label htmlFor="cardName">{t('checkoutPage.nameOnCard')}</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="cardNumber">{t('checkoutPage.cardNumber')}</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expMonth">{t('checkoutPage.expirationMonth')}</label>
                    <select
                      id="expMonth"
                      name="expMonth"
                      value={formData.expMonth}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{t('checkoutPage.month')}</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="expYear">{t('checkoutPage.expirationYear')}</label>
                    <select
                      id="expYear"
                      name="expYear"
                      value={formData.expYear}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{t('checkoutPage.year')}</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">{t('checkoutPage.cvv')}</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <Link to="/cart" className="btn btn-secondary back-btn">
                  <i className="fas fa-arrow-left"></i> {t('checkoutPage.backToCart')}
                </Link>
                <button type="submit" className="btn btn-primary place-order-btn">
                  {t('checkoutPage.placeOrder')}
                </button>
              </div>
            </form>
          </div>
          
          <div className="order-summary">
            <h2 className="summary-title">{t('checkoutPage.orderSummary')}</h2>
            
            <div className="order-items">
              {selectedItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">{t('checkoutPage.qty')} {item.quantity}</div>
                  </div>
                  <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="summary-item">
              <span className="summary-label">{t('checkoutPage.subtotal')}</span>
              <span className="summary-value">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">{t('checkoutPage.shipping')}</span>
              <span className="summary-value">${shipping.toFixed(2)}</span>
            </div>
            
            <div className="summary-item">
              <span className="summary-label">{t('checkoutPage.tax')}</span>
              <span className="summary-value">${tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-item total">
              <span className="summary-label">{t('checkoutPage.total')}</span>
              <span className="summary-value">${total.toFixed(2)}</span>
            </div>
            
            <div className="payment-methods">
              <p>{t('checkoutPage.weAccept')}</p>
              <div className="payment-icons">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amex"></i>
                <i className="fab fa-cc-paypal"></i>
                <span className="payment-icon momo">MoMo</span>
                <span className="payment-icon vnpay">VNPay</span>
                <span className="payment-icon zalopay">ZaloPay</span>
                <span className="payment-icon cod">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;