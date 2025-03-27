import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const { t } = useTranslation();
  const { id, name, count, image } = category;
  
  return (
    <Link to={`/category/${name}`} className="category-card">
      <img src={image} alt={name} className="category-img" />
      <div className="category-info">
        <h3 className="category-name">{name}</h3>
        <p className="category-count">{count} {t('homePage.products', 'Products')}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;