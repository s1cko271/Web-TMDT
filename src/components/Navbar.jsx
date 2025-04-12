import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useShopContext } from '../context/ShopContext';
import { useAuthContext } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { cart, selectedItems } = useShopContext();
  const { user, logout, isAuthenticated } = useAuthContext();
  
  // Calculate total items in cart (only selected items)
  const cartCount = cart
    .filter(item => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Add useEffect to log any potential issues
  useEffect(() => {
    console.log('Navbar rendered');
    console.log('Cart:', cart);
  }, [cart]);

  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">ShopEase</span>
        </Link>

        <div className="navbar-icons-mobile">
          <Link to="/cart" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>{t('navbar.home')}</Link></li>
            <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>{t('navbar.allProducts')}</Link></li>
            <li className="dropdown">
              <span className="dropdown-toggle">{t('navbar.categories')}</span>
              <ul className="dropdown-menu">
                {categoriesLoading ? (
                  <li>Loading...</li>
                ) : (
                  categories.map(category => (
                    <li key={category.id}>
                      <Link to={`/category/${category.name}`} onClick={() => setIsMenuOpen(false)}>
                        {category.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </li>
          </ul>
          <div className="navbar-icons">
            {isAuthenticated ? (
              <div className="user-menu-container">
                <div className="user-menu-toggle" onClick={toggleUserMenu}>
                  <i className="fas fa-user"></i>
                  <span className="user-name">{user.name}</span>
                  <i className={`fas fa-chevron-${isUserMenuOpen ? 'up' : 'down'}`}></i>
                </div>
                {isUserMenuOpen && (
                  <div className="user-dropdown-menu">
                    <Link to="/profile" className="profile-link" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fas fa-user-circle"></i> {t('navbar.myProfile')}
                    </Link>
                    <button onClick={handleLogout} className="logout-button">
                      <i className="fas fa-sign-out-alt"></i> {t('navbar.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="auth-link" onClick={() => setIsMenuOpen(false)}>{t('navbar.login')}</Link>
                <Link to="/signup" className="auth-link signup-link" onClick={() => setIsMenuOpen(false)}>{t('navbar.signup')}</Link>
              </div>
            )}

            <Link to="/cart" className="cart-icon" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;