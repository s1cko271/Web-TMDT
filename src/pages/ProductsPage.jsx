import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

// Price ranges
const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under10000', label: 'Under 10.000đ', min: 0, max: 10000 },
  { id: '10000to50000', label: '10.000đ - 50.000đ', min: 10000, max: 50000 },
  { id: 'over50000', label: 'Over 50.000đ', min: 50000, max: Infinity },
];

// Function to get translated price range labels
const getTranslatedPriceRanges = (t) => [
  { id: 'all', label: t('productPage.allPrices', 'All Prices'), min: 0, max: Infinity },
  { id: 'under10000', label: t('productPage.under10000', 'Under 10.000đ'), min: 0, max: 10000 },
  { id: '10000to50000', label: t('productPage.between10000to50000', '10.000đ - 50.000đ'), min: 10000, max: 50000 },
  { id: 'over50000', label: t('productPage.over50000', 'Over 50.000đ'), min: 50000, max: Infinity },
];

const ProductsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'priceLow', 'priceHigh', 'rating'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for categories
  const [availableCategories, setAvailableCategories] = useState(['All']);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  
  // Get translated price ranges - memoize this to prevent recreation on every render
  const translatedPriceRanges = React.useMemo(() => getTranslatedPriceRanges(t), [t]);
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axios.get('http://localhost:5000/api/categories');
        const categoriesData = response.data;
        
        // Add 'All' category at the beginning
        setAvailableCategories(['All', ...categoriesData.map(cat => cat.name)]);
        setCategoriesError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategoriesError('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch products from API with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;
        
        // Nếu có categoryId, sử dụng API lấy sản phẩm theo danh mục
        if (categoryId) {
          console.log('Fetching products for category ID:', categoryId);
          try {
            response = await axios.get(`http://localhost:5000/api/categories/id/${categoryId}/products`);
            console.log('Category products response:', response.data);
            
            // Kiểm tra nếu response.data là mảng rỗng
            if (!response.data || response.data.length === 0) {
              console.log('No products found for this category');
              setProducts([]);
            } else {
              setProducts(response.data);
            }
          } catch (categoryErr) {
            console.error('Error fetching category products:', categoryErr);
            // Nếu API danh mục lỗi, thử lấy tất cả sản phẩm và lọc theo danh mục
            const allProductsResponse = await axios.get('http://localhost:5000/api/products');
            // Lọc sản phẩm theo danh mục nếu có thể
            setProducts(allProductsResponse.data);
          }
        } else {
          // Nếu không có categoryId, sử dụng API sản phẩm thông thường với các bộ lọc
          const params = {};
          
          // Add search query if present
          if (searchQuery) {
            params.search = searchQuery;
          }
          
          // Add price range filters
          const selectedRange = translatedPriceRanges.find(range => range.id === selectedPriceRange);
          if (selectedRange && selectedRange.id !== 'all') {
            params.minPrice = selectedRange.min;
            params.maxPrice = selectedRange.max;
          }
          
          // Add sorting parameters
          if (sortBy === 'priceLow') {
            params.sortBy = 'unit_price';
            params.sortOrder = 'asc';
          } else if (sortBy === 'priceHigh') {
            params.sortBy = 'unit_price';
            params.sortOrder = 'desc';
          }
          
          // Make API request with query parameters
          response = await axios.get('http://localhost:5000/api/products', { params });
          console.log('All products fetched:', response.data.length);
          setProducts(response.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery, selectedPriceRange, sortBy, categoryId, t]);
  
  // Parse URL query parameters and route parameters to get category
  useEffect(() => {
    // Check for query parameters (from CategoryCard links)
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    // Check for route parameters (from /category/:categoryName route)
    const pathParts = location.pathname.split('/');
    const categoryFromRoute = pathParts[2]; // /category/:categoryName -> categoryName will be at index 2
    
    // Set category from either source
    const categoryToSet = categoryParam || categoryFromRoute;
    
    if (categoryToSet) {
      // Decode the category name to handle spaces and special characters
      const decodedCategoryName = decodeURIComponent(categoryToSet);
      setSelectedCategory(decodedCategoryName);
      
      // Nếu không phải là 'All', tìm category_id tương ứng
      if (decodedCategoryName !== 'All') {
        const fetchCategoryId = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/categories');
            console.log('Categories data:', response.data);
            
            // Tìm danh mục phù hợp, không phân biệt chữ hoa/thường
            const category = response.data.find(cat => 
              cat.name && cat.name.toLowerCase() === decodedCategoryName.toLowerCase());
            
            if (category) {
              setCategoryId(category.id);
              console.log('Found category ID:', category.id, 'for category:', decodedCategoryName);
            } else {
              console.error('Category not found:', decodedCategoryName);
              setCategoryId(null);
              // Nếu không tìm thấy danh mục, vẫn hiển thị tất cả sản phẩm
              setSelectedCategory('All');
            }
          } catch (err) {
            console.error('Error fetching category ID:', err);
            setCategoryId(null);
            // Nếu có lỗi, hiển thị tất cả sản phẩm
            setSelectedCategory('All');
          }
        };
        
        fetchCategoryId();
      } else {
        setCategoryId(null);
      }
    }
  }, [location.search, location.pathname, availableCategories]);
  
  // Filter products based on search, category, and price range
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Price range filter
    const selectedRange = translatedPriceRanges.find(range => range.id === selectedPriceRange);
    const matchesPriceRange = product.unit_price >= selectedRange.min && product.unit_price <= selectedRange.max;
    
    return matchesSearch && matchesPriceRange;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLow':
        return a.unit_price - b.unit_price;
      case 'priceHigh':
        return b.unit_price - a.unit_price;
      default: // 'featured'
        return 0; // Keep original order
    }
  });
  
  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">
          {selectedCategory === 'All' ? t('navbar.allProducts', 'All Products') : `${selectedCategory} ${t('homePage.products', 'Products')}`}
        </h1>
        
        {/* Filters and Search */}
        <div className="filters-container">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder={t('productPage.searchPlaceholder', 'Search products...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-options">
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">{t('productPage.category', 'Category')}:</label>
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  
                  // Nếu chọn 'All', reset category_id
                  if (e.target.value === 'All') {
                    setCategoryId(null);
                  } else {
                    // Tìm category_id tương ứng với tên danh mục
                    const fetchCategoryId = async () => {
                      try {
                        const response = await axios.get('http://localhost:5000/api/categories');
                        console.log('Categories for dropdown:', response.data);
                        const category = response.data.find(cat => cat.name === e.target.value);
                        if (category) {
                          console.log('Selected category:', category);
                          setCategoryId(category.id);
                        } else {
                          console.error('Category not found in dropdown selection:', e.target.value);
                          setCategoryId(null);
                        }
                      } catch (err) {
                        console.error('Error fetching category ID:', err);
                        setCategoryId(null);
                      }
                    };
                    
                    fetchCategoryId();
                  }
                }}
              >
                {categoriesLoading ? (
                  <option value="All">Loading categories...</option>
                ) : categoriesError ? (
                  <option value="All">Error loading categories</option>
                ) : (
                  availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))
                )}
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="filter-group">
              <label className="filter-label">{t('productPage.price', 'Price Range')}:</label>
              <select
                className="filter-select"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              >
                {translatedPriceRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div className="filter-group">
              <label className="filter-label">{t('productPage.sortBy', 'Sort By')}:</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">{t('productPage.featured', 'Featured')}</option>
                <option value="priceLow">{t('productPage.priceLow', 'Price: Low to High')}</option>
                <option value="priceHigh">{t('productPage.priceHigh', 'Price: High to Low')}</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="loading-message">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              {t('productPage.tryAgain', 'Try Again')}
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {sortedProducts.length > 0 ? (
              sortedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.unit_price,
                    image: product.image_url ? (product.image_url.startsWith('/') ? product.image_url : `/${product.image_url}`) : (product.image ? `/${product.image}` : '/images/sp1.jpg'),
                    rating: 4.5, // Default rating since it's not in the database
                    stock: product.stock_quantity,
                    status: product.status
                  }} 
                />
              ))
            ) : (
              <div className="no-products-message">
                <p>{t('productPage.noProductsFound', 'No products found matching your criteria.')}</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedPriceRange('all');
                  }}
                >
                  {t('productPage.clearFilters', 'Clear Filters')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;