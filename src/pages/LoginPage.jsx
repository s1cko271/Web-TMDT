import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    if (result) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>{t('loginPage.title', 'Login to Your Account')}</h2>
        <p className="auth-subtitle">{t('loginPage.subtitle', 'Welcome back! Please enter your details.')}</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('profilePage.email', 'Email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('loginPage.emailPlaceholder', 'Enter your email')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('loginPage.password', 'Password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('loginPage.passwordPlaceholder', 'Enter your password')}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? t('loginPage.loggingIn', 'Logging in...') : t('navbar.login', 'Login')}
          </button>
        </form>
        
        <p className="auth-redirect">
          {t('loginPage.noAccount', 'Don\'t have an account?')} <Link to="/signup">{t('navbar.signup', 'Sign up')}</Link>
        </p>
        
        <div className="auth-demo-info">
          <p><strong>{t('loginPage.demoAccount', 'Demo Account:')}</strong></p>
          <p>{t('profilePage.email', 'Email')}: user@example.com</p>
          <p>{t('loginPage.password', 'Password')}: password123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;