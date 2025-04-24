import React, { useState, useEffect } from 'react';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit_price: '',
    stock_quantity: '',
    category_id: '',
    image_url: ''
  });

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        // Fetch products
        const productsResponse = await fetch('/api/admin/products', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!productsResponse.ok) {
          throw new Error('Không thể tải danh sách sản phẩm');
        }

        const productsData = await productsResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch('/api/admin/categories', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!categoriesResponse.ok) {
          throw new Error('Không thể tải danh sách danh mục');
        }

        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open form to add new product
  const handleAddNew = () => {
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      unit_price: '',
      stock_quantity: '',
      category_id: '',
      image_url: ''
    });
    setShowForm(true);
  };

  // Open form to edit product
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      unit_price: product.unit_price,
      stock_quantity: product.stock_quantity,
      category_id: product.category_id,
      image_url: product.image_url || ''
    });
    setShowForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const url = currentProduct
        ? `/api/admin/products/${currentProduct.id}`
        : '/api/admin/products';

      const method = currentProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          ...formData,
          unit_price: parseFloat(formData.unit_price),
          stock_quantity: parseInt(formData.stock_quantity, 10)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      const updatedProduct = await response.json();

      // Update products list
      if (currentProduct) {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        setProducts([...products, updatedProduct]);
      }

      // Close form
      setShowForm(false);
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        unit_price: '',
        stock_quantity: '',
        category_id: '',
        image_url: ''
      });
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
      console.error('Lỗi khi lưu sản phẩm:', err);
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      // Remove product from list
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
      console.error('Lỗi khi xóa sản phẩm:', err);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) {
    return <div className="products-loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="products-error">Lỗi: {error}</div>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Quản lý Sản phẩm</h1>
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm sản phẩm mới
        </button>
      </div>

      {showForm && (
        <div className="product-form-container">
          <div className="product-form">
            <h2>{currentProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Tên sản phẩm</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="unit_price">Giá (VNĐ)</label>
                  <input
                    type="number"
                    id="unit_price"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock_quantity">Số lượng tồn kho</label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category_id">Danh mục</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="image_url">URL hình ảnh</label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-buttons">
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Hủy
                </button>
                <button type="submit" className="save-button">
                  {currentProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="product-thumbnail" />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category_name || 'Chưa phân loại'}</td>
                  <td>{formatCurrency(product.unit_price)}</td>
                  <td>{product.stock_quantity}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-button" onClick={() => handleEdit(product)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(product.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">Không có sản phẩm nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;