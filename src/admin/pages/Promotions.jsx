import React, { useState, useEffect } from 'react';
import '../styles/Promotions.css';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percent: '',
    start_date: '',
    end_date: '',
    code: '',
    is_active: true
  });

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await fetch('/api/admin/promotions', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải danh sách khuyến mãi');
        }

        const data = await response.json();
        setPromotions(data);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi tải khuyến mãi:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open form to add new promotion
  const handleAddNew = () => {
    setCurrentPromotion(null);
    setFormData({
      title: '',
      description: '',
      discount_percent: '',
      start_date: '',
      end_date: '',
      code: '',
      is_active: true
    });
    setShowForm(true);
  };

  // Open form to edit promotion
  const handleEdit = (promotion) => {
    setCurrentPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description || '',
      discount_percent: promotion.discount_percent,
      start_date: new Date(promotion.start_date).toISOString().split('T')[0],
      end_date: new Date(promotion.end_date).toISOString().split('T')[0],
      code: promotion.code,
      is_active: promotion.is_active
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

      const url = currentPromotion
        ? `/api/admin/promotions/${currentPromotion.id}`
        : '/api/admin/promotions';

      const method = currentPromotion ? 'PUT' : 'POST';

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

      const data = await response.json();

      if (currentPromotion) {
        // Cập nhật danh sách khuyến mãi
        setPromotions(promotions.map(promo => promo.id === currentPromotion.id ? data : promo));
      } else {
        // Thêm khuyến mãi mới vào danh sách
        setPromotions([...promotions, data]);
      }

      // Đóng form
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Lỗi khi lưu khuyến mãi:', err);
    }
  };

  // Delete promotion
  const handleDelete = async (promotionId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`/api/admin/promotions/${promotionId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      // Cập nhật danh sách khuyến mãi
      setPromotions(promotions.filter(promo => promo.id !== promotionId));
    } catch (err) {
      setError(err.message);
      console.error('Lỗi khi xóa khuyến mãi:', err);
    }
  };

  // Send promotion emails
  const handleSendEmails = async (promotionId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`/api/admin/promotions/${promotionId}/send-emails`, {
        method: 'POST',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      alert('Đã gửi email khuyến mãi thành công!');
    } catch (err) {
      setError(err.message);
      console.error('Lỗi khi gửi email khuyến mãi:', err);
    }
  };

  if (isLoading) {
    return <div className="promotions-loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="promotions-page">
      <h1>Quản lý khuyến mãi</h1>

      {error && <div className="promotions-error">{error}</div>}

      <div className="promotions-actions">
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm khuyến mãi
        </button>
      </div>

      {showForm && (
        <div className="promotion-form-container">
          <div className="promotion-form">
            <h2>{currentPromotion ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Tiêu đề</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
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
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="discount_percent">Phần trăm giảm giá (%)</label>
                <input
                  type="number"
                  id="discount_percent"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="code">Mã khuyến mãi</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date">Ngày bắt đầu</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">Ngày kết thúc</label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <label htmlFor="is_active">Kích hoạt</label>
              </div>

              <div className="form-buttons">
                <button type="submit" className="save-button">
                  {currentPromotion ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {promotions.length === 0 ? (
        <div className="no-promotions">
          <i className="fas fa-bullhorn"></i>
          <p>Chưa có khuyến mãi nào</p>
        </div>
      ) : (
        <div className="promotions-list">
          <table className="promotions-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Mã</th>
                <th>Giảm giá</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map(promotion => (
                <tr key={promotion.id}>
                  <td>{promotion.title}</td>
                  <td><span className="promotion-code">{promotion.code}</span></td>
                  <td>{promotion.discount_percent}%</td>
                  <td>
                    {new Date(promotion.start_date).toLocaleDateString('vi-VN')} - {new Date(promotion.end_date).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <span className={`status-badge ${promotion.is_active ? 'active' : 'inactive'}`}>
                      {promotion.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(promotion)}
                      title="Chỉnh sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(promotion.id)}
                      title="Xóa"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    <button
                      className="email-button"
                      onClick={() => handleSendEmails(promotion.id)}
                      title="Gửi email"
                    >
                      <i className="fas fa-envelope"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Promotions;