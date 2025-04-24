import React, { useState, useEffect } from 'react';
import '../styles/Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await fetch('/api/admin/categories', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải danh sách danh mục');
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi tải danh mục:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open form to add new category
  const handleAddNew = () => {
    setCurrentCategory(null);
    setFormData({
      name: '',
      description: '',
      image_url: ''
    });
    setShowForm(true);
  };

  // Open form to edit category
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || ''
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

      const url = currentCategory
        ? `/api/admin/categories/${currentCategory.id}`
        : '/api/admin/categories';

      const method = currentCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      const updatedCategory = await response.json();

      // Update categories list
      if (currentCategory) {
        setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      } else {
        setCategories([...categories, updatedCategory]);
      }

      // Close form
      setShowForm(false);
      setCurrentCategory(null);
      setFormData({
        name: '',
        description: '',
        image_url: ''
      });
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
      console.error('Lỗi khi lưu danh mục:', err);
    }
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      // Remove category from list
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
      console.error('Lỗi khi xóa danh mục:', err);
    }
  };

  if (isLoading) {
    return <div className="categories-loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="categories-error">Lỗi: {error}</div>;
  }

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Quản lý Danh mục</h1>
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm danh mục mới
        </button>
      </div>

      {showForm && (
        <div className="category-form-container">
          <div className="category-form">
            <h2>{currentCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Tên danh mục</label>
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
                  {currentCategory ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="categories-grid">
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                {category.image_url ? (
                  <img src={category.image_url} alt={category.name} />
                ) : (
                  <div className="no-image">
                    <i className="fas fa-folder"></i>
                  </div>
                )}
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description || 'Không có mô tả'}</p>
                <div className="category-actions">
                  <button className="edit-button" onClick={() => handleEdit(category)}>
                    <i className="fas fa-edit"></i> Sửa
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(category.id)}>
                    <i className="fas fa-trash"></i> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">Không có danh mục nào</div>
        )}
      </div>
    </div>
  );
};

export default Categories;