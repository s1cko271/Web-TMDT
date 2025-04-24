import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './DiscountBanner.css';

const DiscountBanner = () => {
  const { t } = useTranslation();
  
  // Discount data - in a real app, this might come from an API
  const discounts = [
    {
      id: 1,
      title: t('discount.flashSale', 'Flash Sale'),
      description: t('discount.flashSaleDesc', 'Giảm giá sốc đến 70% - Chỉ trong 24h'),
      buttonText: t('discount.shopNow', 'Mua ngay'),
      link: '/products',
      bgColor: 'linear-gradient(135deg, #ff6b6b, #ff8787)',
      image: '/images/sp10.jpg'
    },
    {
      id: 2,
      title: t('discount.seasonalSale', 'Khuyến mãi mùa tựu trường'),
      description: t('discount.seasonalSaleDesc', 'Ưu đãi đặc biệt cho học sinh, sinh viên'),
      buttonText: t('discount.viewOffers', 'Xem ưu đãi'),
      link: '/products?category=School%20Supplies',
      bgColor: 'linear-gradient(135deg, #4dabf7, #74c0fc)',
      image: '/images/sp20.jpg'
    }
  ];

  return (
    <section className="discount-banner-section">
      <div className="container">
        <h2 className="section-title">{t('discount.specialOffers', 'Ưu Đãi Đặc Biệt')}</h2>
        <div className="discount-banner-container">
          {discounts.map((discount) => (
            <div 
              key={discount.id} 
              className="discount-banner"
              style={{ background: discount.bgColor }}
            >
              <div className="discount-content">
                <h3 className="discount-title">{discount.title}</h3>
                <p className="discount-description">{discount.description}</p>
                <Link to={discount.link} className="discount-button">
                  {discount.buttonText}
                </Link>
              </div>
              <div className="discount-image">
                <img src={discount.image} alt={discount.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscountBanner;