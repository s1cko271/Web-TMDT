import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './PromotionBanner.css';

const PromotionBanner = () => {
  const { t } = useTranslation();
  
  // Promotion data - in a real app, this might come from an API
  const promotions = [
    {
      id: 1,
      title: t('promotion.freeShipping', 'Miễn phí vận chuyển'),
      description: t('promotion.freeShippingDesc', 'Cho đơn hàng từ 200.000đ'),
      icon: 'fas fa-truck',
      link: '/products',
      color: '#4dabf7'
    },
    {
      id: 2,
      title: t('promotion.discount', 'Giảm 20%'),
      description: t('promotion.discountDesc', 'Cho học sinh, sinh viên'),
      icon: 'fas fa-graduation-cap',
      link: '/products?category=School%20Supplies',
      color: '#ff6b6b'
    },
    {
      id: 3,
      title: t('promotion.specialOffer', 'Ưu đãi đặc biệt'),
      description: t('promotion.specialOfferDesc', 'Mua 2 tặng 1'),
      icon: 'fas fa-gift',
      link: '/products',
      color: '#38d9a9'
    },
    {
      id: 4,
      title: t('promotion.newCustomer', 'Khách hàng mới'),
      description: t('promotion.newCustomerDesc', 'Giảm 10% đơn hàng đầu tiên'),
      icon: 'fas fa-user-plus',
      link: '/signup',
      color: '#f783ac'
    }
  ];

  return (
    <div className="promotion-container">
      {promotions.map((promo) => (
        <Link to={promo.link} key={promo.id} className="promotion-card">
          <div className="promotion-icon" style={{ backgroundColor: promo.color }}>
            <i className={promo.icon}></i>
          </div>
          <div className="promotion-content">
            <h3 className="promotion-title">{promo.title}</h3>
            <p className="promotion-description">{promo.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PromotionBanner;