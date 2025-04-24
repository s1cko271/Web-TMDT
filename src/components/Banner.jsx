import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Banner.css';

const Banner = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Banner data - in a real app, this might come from an API
  const banners = [
    {
      id: 1,
      title: t('banner.sale', 'Khuyến mãi lớn'),
      subtitle: t('banner.saleDesc', 'Giảm giá đến 50% cho tất cả sản phẩm'),
      buttonText: t('banner.shopNow', 'Mua ngay'),
      link: '/products',
      image: '/images/sp1.jpg',
      bgColor: '#ff6b6b'
    },
    {
      id: 2,
      title: t('banner.newArrival', 'Sản phẩm mới'),
      subtitle: t('banner.newArrivalDesc', 'Khám phá bộ sưu tập mới nhất của chúng tôi'),
      buttonText: t('banner.discover', 'Khám phá'),
      link: '/products',
      image: '/images/sp2.jpg',
      bgColor: '#4dabf7'
    },
    {
      id: 3,
      title: t('banner.limitedOffer', 'Ưu đãi có hạn'),
      subtitle: t('banner.limitedOfferDesc', 'Mua 1 tặng 1 - Chỉ trong tuần này'),
      buttonText: t('banner.getOffer', 'Nhận ưu đãi'),
      link: '/products',
      image: '/images/sp3.jpg',
      bgColor: '#38d9a9'
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="banner-container">
      <div className="banner-slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            className="banner-slide"
            style={{ backgroundColor: banner.bgColor }}
          >
            <div className="banner-content">
              <h2 className="banner-title">{banner.title}</h2>
              <p className="banner-subtitle">{banner.subtitle}</p>
              <Link to={banner.link} className="banner-button">
                {banner.buttonText}
              </Link>
            </div>
            <div className="banner-image">
              <img src={banner.image} alt={banner.title} />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button className="banner-nav banner-prev" onClick={prevSlide}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="banner-nav banner-next" onClick={nextSlide}>
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Dots indicator */}
      <div className="banner-dots">
        {banners.map((_, index) => (
          <button 
            key={index} 
            className={`banner-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Banner;