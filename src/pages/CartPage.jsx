import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useShopContext } from '../context/ShopContext';
import { formatCurrency } from '../utils/currencyUtils';
import './CartPage.css';
import './PaymentIcons.css';

const CartPage = () => {
  const { t } = useTranslation();
  const { 
    cart: cartItems, 
    updateCartItemQuantity: updateQuantity, 
    removeFromCart: removeItem, 
    clearCart,
    getCartTotals,
    toggleItemSelection,
    isItemSelected,
    selectAllItems,
    deselectAllItems
  } = useShopContext();
  
  // Get cart totals from context
  const { subtotal, shipping, tax, total } = getCartTotals();
  
  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">{t('cartPage.yourShoppingCart', 'Your Shopping Cart')}</h1>
        
        {cartItems.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-header">
                <div className="cart-header-select">{t('cartPage.select', 'Select')}</div>
                <div className="cart-header-product">{t('cartPage.product', 'Product')}</div>
                <div className="cart-header-price">{t('cartPage.price', 'Price')}</div>
                <div className="cart-header-quantity">{t('cartPage.quantity', 'Quantity')}</div>
                <div className="cart-header-total">{t('cartPage.total', 'Total')}</div>
                <div className="cart-header-actions"></div>
              </div>
              
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-select">
                    <input 
                      type="checkbox" 
                      checked={isItemSelected(item.id)} 
                      onChange={() => toggleItemSelection(item.id)}
                      className="item-checkbox"
                    />
                  </div>
                  <div className="cart-item-product">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <Link to={`/products/${item.id}`} className="view-product-link">{t('cartPage.viewProduct', 'View product')}</Link>
                    </div>
                  </div>
                  
                  <div className="cart-item-price">{formatCurrency(item.price, i18n.language)}</div>
                  
                  <div className="cart-item-quantity">
                    <div className="quantity-input">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} 
                        min="1" 
                      />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart-item-total">
                    {formatCurrency(item.price * item.quantity, i18n.language)}
                  </div>
                  
                  <div className="cart-item-actions">
                    <button className="remove-item-btn" onClick={() => removeItem(item.id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="cart-actions">
                <div className="selection-actions">
                  <button className="btn btn-secondary select-all" onClick={selectAllItems}>
                    <i className="fas fa-check-square"></i> {t('cartPage.selectAll', 'Select All')}
                  </button>
                  <button className="btn btn-secondary deselect-all" onClick={deselectAllItems}>
                    <i className="fas fa-square"></i> {t('cartPage.deselectAll', 'Deselect All')}
                  </button>
                </div>
                <div className="cart-main-actions">
                  <Link to="/products" className="btn btn-secondary continue-shopping">
                    <i className="fas fa-arrow-left"></i> {t('cartPage.continueShopping', 'Continue Shopping')}
                  </Link>
                  <button className="btn btn-secondary clear-cart" onClick={clearCart}>
                    <i className="fas fa-trash"></i> {t('cartPage.clearCart', 'Clear Cart')}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="cart-summary">
              <h2 className="summary-title">{t('cartPage.orderSummary', 'Order Summary')}</h2>
              
              <div className="summary-item">
                <span className="summary-label">{t('cartPage.subtotal', 'Subtotal')}</span>
                <span className="summary-value">{formatCurrency(subtotal, i18n.language)}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">{t('cartPage.shipping', 'Shipping')}</span>
                <span className="summary-value">{formatCurrency(shipping, i18n.language)}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">{t('cartPage.tax', 'Tax')}</span>
                <span className="summary-value">{formatCurrency(tax, i18n.language)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-item total">
                <span className="summary-label">{t('cartPage.total', 'Total')}</span>
                <span className="summary-value">{formatCurrency(total, i18n.language)}</span>
              </div>
              
              <Link 
                to="/checkout" 
                className="btn btn-primary checkout-btn"
              >
                {t('cartPage.checkout', 'Proceed to Checkout')}
              </Link>
              
              <div className="payment-methods">
                <p>{t('cartPage.weAccept', 'We Accept:')}</p>
                <div className="payment-icons">
                  <i className="fab fa-cc-visa"></i>
                  <span className="payment-icon momo"></span>
                  <span className="payment-icon vnpay"></span>
                  <span className="payment-icon zalopay"></span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-content">
              <i className="fas fa-shopping-cart empty-cart-icon"></i>
              <h2>{t('cartPage.emptyCart', 'Your cart is empty')}</h2>
              <p>{t('cartPage.emptyCartDesc', 'Looks like you haven\'t added any items to your cart yet.')}</p>
              <Link to="/products" className="btn btn-primary">{t('cartPage.startShopping', 'Start Shopping')}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;