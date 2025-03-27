import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

// Available categories
const categories = ['All'];

// Price ranges
const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under10000', label: 'Under 10.000đ', min: 0, max: 10000 },
  { id: '10000to50000', label: '10.000đ - 50.000đ', min: 10000, max: 50000 },
  { id: 'over50000', label: 'Over 50.000đ', min: 50000, max: Infinity },
];

const ProductsPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'priceLow', 'priceHigh', 'rating'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
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
    
    if (categoryToSet && categories.includes(categoryToSet)) {
      setSelectedCategory(categoryToSet);
    }
  }, [location.search, location.pathname]);
  
  // Filter products based on search, category, and price range
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Price range filter
    const selectedRange = priceRanges.find(range => range.id === selectedPriceRange);
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
          {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Products`}
        </h1>
        
        {/* Filters and Search */}
        <div className="filters-container">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-options">
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category:</label>
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="filter-group">
              <label className="filter-label">Price Range:</label>
              <select
                className="filter-select"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
              >
                {priceRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div className="filter-group">
              <label className="filter-label">Sort By:</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
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
              Try Again
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
                    image: product.image_url || `/${product.image_url}`,
                    rating: 4.5, // Default rating since it's not in the database
                    stock: product.stock_quantity,
                    status: product.status
                  }} 
                />
              ))
            ) : (
              <div className="no-products-message">
                <p>No products found matching your criteria.</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedPriceRange('all');
                  }}
                >
                  Clear Filters
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