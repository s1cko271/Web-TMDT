import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { formatCurrency } from '../utils/currencyUtils';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { id, name, price, rating, image } = product;
  
  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-star-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };
  
  return (
    <div className="product-card">
      <Link to={`/products/${id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={image} 
            alt={t(`products.names.${id}`, name)} 
            className="product-image" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/sp1.jpg'; // Ảnh dự phòng khi không tải được ảnh chính
            }}
          />
          <div className="product-overlay">
            <button className="quick-view-btn">{t('productPage.quickView', 'Quick View')}</button>
          </div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{t(`products.names.${id}`, name)}</h3>
          <div className="product-price">{formatCurrency(price, i18n.language)}</div>
          <div className="product-rating">
            {renderStars()}
            <span className="rating-text">({rating})</span>
          </div>
        </div>
      </Link>
      <button className="add-to-cart-btn">
        <i className="fas fa-shopping-cart"></i> {t('productPage.addToCart', 'Add to Cart')}
      </button>
    </div>
  );
};

export default ProductCard;