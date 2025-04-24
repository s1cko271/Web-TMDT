import React, { useState, useEffect } from 'react';
import '../styles/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    is_admin: false
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await fetch('/api/admin/users', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải danh sách người dùng');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi tải người dùng:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open form to add new user
  const handleAddNew = () => {
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      is_admin: false
    });
    setShowForm(true);
  };

  // Open form to edit user
  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Không hiển thị mật khẩu hiện tại
      phone: user.phone || '',
      address: user.address || '',
      is_admin: user.is_admin || false
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

      // Nếu đang chỉnh sửa và không nhập mật khẩu mới, loại bỏ trường password
      const submitData = { ...formData };
      if (currentUser && !submitData.password) {
        delete submitData.password;
      }

      const url = currentUser
        ? `/api/admin/users/${currentUser.id}`
        : '/api/admin/users';

      const method = currentUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      const data = await response.json();

      if (currentUser) {
        // Cập nhật danh sách người dùng
        setUsers(users.map(user => user.id === currentUser.id ? data : user));
      } else {
        // Thêm người dùng mới vào danh sách
        setUsers([...users, data]);
      }

      // Đóng form
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Lỗi khi lưu người dùng:', err);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      // Cập nhật danh sách người dùng
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(err.message);
      console.error('Lỗi khi xóa người dùng:', err);
    }
  };

  if (isLoading) {
    return <div className="users-loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="users-page">
      <h1>Quản lý người dùng</h1>

      {error && <div className="users-error">{error}</div>}

      <div className="users-actions">
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm người dùng
        </button>
      </div>

      {showForm && (
        <div className="user-form-container">
          <div className="user-form">
            <h2>{currentUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Họ tên</label>
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
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  {currentUser ? 'Mật khẩu mới (để trống nếu không thay đổi)' : 'Mật khẩu'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!currentUser}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="is_admin"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleInputChange}
                />
                <label htmlFor="is_admin">Quyền quản trị viên</label>
              </div>

              <div className="form-buttons">
                <button type="submit" className="save-button">
                  {currentUser ? 'Cập nhật' : 'Thêm mới'}
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

      {users.length === 0 ? (
        <div className="no-users">
          <i className="fas fa-users"></i>
          <p>Chưa có người dùng nào</p>
        </div>
      ) : (
        <div className="users-list">
          <table className="users-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.address || '-'}</td>
                  <td>
                    <span className={`role-badge ${user.is_admin ? 'admin' : 'user'}`}>
                      {user.is_admin ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(user)}
                      title="Chỉnh sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(user.id)}
                      title="Xóa"
                      disabled={user.is_admin} // Không cho phép xóa tài khoản admin
                    >
                      <i className="fas fa-trash-alt"></i>
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

export default Users;