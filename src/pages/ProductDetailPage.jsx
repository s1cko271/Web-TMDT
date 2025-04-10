import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useShopContext } from '../context/ShopContext';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { formatCurrency } from '../utils/currencyUtils';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        
        // Transform the data to match our component's expectations
        const productData = {
          ...response.data,
          price: response.data.unit_price,
          stock: response.data.stock_quantity,
          image: response.data.image_url ? (response.data.image_url.startsWith('/') ? response.data.image_url : `/${response.data.image_url}`) : '/images/sp1.jpg',
          rating: 4.5, // Default rating since it's not in the database
          category: 'School Supplies',
          features: [response.data.status]
        };
        
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetail();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const { addToCart: contextAddToCart } = useShopContext();
  
  const addToCart = () => {
    contextAddToCart(product, quantity);
    alert(`${t('productDetail.addToCart')}: ${quantity} ${product.name}`);
  };
  
  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <h2>{t('productDetail.productNotFound')}</h2>
          <p>{t('productDetail.productNotFoundDesc')}</p>
          <Link to="/products" className="btn btn-primary">{t('productDetail.backToProducts')}</Link>
        </div>
      </div>
    );
  }
  
  // Generate star rating
  const renderStars = (rating) => {
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
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">{t('productDetail.home')}</Link>
          <Link to="/products">{t('productDetail.products')}</Link>
          <Link to={`/category/${product.category}`}>{product.category}</Link>
          <span>{product.name}</span>
        </div>
        
        <div className="product-detail">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            
            <div className="product-meta">
              <div className="product-rating">
                {renderStars(product.rating)}
                <span className="rating-text">({product.rating})</span>
              </div>
              <div className="product-category">{t('productDetail.category')}: {product.category}</div>
              <div className="product-stock">
                {product.stock > 0 ? (
                  <span className="in-stock">{t('productDetail.inStock')} ({product.stock} {t('productDetail.available')})</span>
                ) : (
                  <span className="out-of-stock">{t('productPage.outOfStock')}</span>
                )}
              </div>
            </div>
            
            <div className="product-price">{formatCurrency(product.price, i18n.language)}</div>
            
            <div className="quantity-selector">
              <label>{t('productDetail.quantity')}:</label>
              <div className="quantity-input">
                <button onClick={decrementQuantity} disabled={quantity <= 1}>
                  <i className="fas fa-minus"></i>
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={handleQuantityChange} 
                  min="1" 
                  max={product.stock} 
                />
                <button onClick={incrementQuantity} disabled={quantity >= product.stock}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
            
            <div className="product-actions">
              <button className="btn btn-primary add-to-cart-btn" onClick={addToCart}>
                <i className="fas fa-shopping-cart"></i> {t('productDetail.addToCart')}
              </button>
              <button className="btn btn-secondary wishlist-btn">
                <i className="far fa-heart"></i> {t('productDetail.addToWishlist')}
              </button>
            </div>
          </div>
        </div>
        
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              {t('productDetail.description')}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              {t('productDetail.features')}
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              {t('productDetail.reviews')}
            </button>
          </div>
          
          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <p>{t(`products.${product.id}.description`) || product.description}</p>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div className="tab-pane">
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index}><i className="fas fa-check"></i> {t(`products.${product.id}.features.${index}`) || feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <p>{t('productDetail.noReviews')}</p>
                <button className="btn btn-secondary">{t('productDetail.writeReview')}</button>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products section would go here */}
      </div>
    </div>
  );
};

export default ProductDetailPage;