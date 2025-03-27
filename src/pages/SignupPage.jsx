import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';
import './LoginPage.css'; // Reusing the same CSS file

const SignupPage = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { signup, error, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (password !== confirmPassword) {
      setFormError(t('signupPage.passwordsNotMatch', 'Passwords do not match'));
      return;
    }
    
    if (password.length < 6) {
      setFormError(t('signupPage.passwordLength', 'Password must be at least 6 characters long'));
      return;
    }
    
    setFormError('');
    const result = await signup(name, email, password);
    if (result) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>{t('signupPage.title', 'Create an Account')}</h2>
        <p className="auth-subtitle">{t('signupPage.subtitle', 'Join us today and start shopping!')}</p>
        
        {(formError || error) && (
          <div className="auth-error">{formError || error}</div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('profilePage.name', 'Full Name')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t('signupPage.namePlaceholder', 'Enter your full name')}
            />
          </div>
          
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
              placeholder={t('signupPage.passwordPlaceholder', 'Create a password')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('signupPage.confirmPassword', 'Confirm Password')}</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t('signupPage.confirmPasswordPlaceholder', 'Confirm your password')}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? t('signupPage.creatingAccount', 'Creating Account...') : t('navbar.signup', 'Sign Up')}
          </button>
        </form>
        
        <p className="auth-redirect">
          {t('signupPage.haveAccount', 'Already have an account?')} <Link to="/login">{t('navbar.login', 'Login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;