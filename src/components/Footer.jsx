import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories for footer:', err);
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">ShopEase</h3>
            <p className="footer-description">
              {t('footer.description', 'Your one-stop destination for all your shopping needs. Quality products, competitive prices, and excellent customer service.')}
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">{t('footer.quickLinks', 'Quick Links')}</h3>
            <ul className="footer-links">
              <li><Link to="/">{t('navbar.home', 'Home')}</Link></li>
              <li><Link to="/products">{t('footer.products', 'Products')}</Link></li>
              <li><Link to="/cart">{t('cartPage.cart', 'Cart')}</Link></li>
              <li><a href="#">{t('footer.about', 'About Us')}</a></li>
              <li><a href="#">{t('footer.contact', 'Contact')}</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">{t('navbar.categories', 'Categories')}</h3>
            <ul className="footer-links">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#">{t('navbar.electronics', 'Electronics')}</a></li>
                  <li><a href="#">{t('footer.clothing', 'Clothing')}</a></li>
                  <li><a href="#">{t('navbar.homeAndKitchen', 'Home & Kitchen')}</a></li>
                  <li><a href="#">{t('footer.beautyPersonalCare', 'Beauty & Personal Care')}</a></li>
                  <li><a href="#">{t('footer.sportsOutdoors', 'Sports & Outdoors')}</a></li>
                </>
              )}
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">{t('footer.contactUs', 'Contact Us')}</h3>
            <ul className="contact-info">
              <li><i className="fas fa-map-marker-alt"></i> {t('footer.address', '123 Shopping St, Retail City')}</li>
              <li><i className="fas fa-phone"></i> {t('footer.phone', '+1 234 567 8900')}</li>
              <li><i className="fas fa-envelope"></i> {t('footer.email', 'info@shopease.com')}</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">{t('footer.copyright', '© {{year}} ShopEase. All rights reserved.').replace('{{year}}', new Date().getFullYear())}</p>
          <div className="footer-bottom-links">
            <a href="#">{t('footer.privacy', 'Privacy Policy')}</a>
            <a href="#">{t('footer.terms', 'Terms of Service')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;