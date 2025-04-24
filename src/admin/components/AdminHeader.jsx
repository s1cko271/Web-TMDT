import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminHeader.css';

const AdminHeader = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin admin từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setAdminInfo(user);
    }
  }, []);

  const handleLogout = () => {
    // Xóa token admin và thông tin người dùng
    localStorage.removeItem('adminToken');
    // Chuyển hướng về trang đăng nhập admin
    navigate('/admin/login');
  };

  return (
    <header className="admin-header">
      <div className="header-search">
        <i className="fas fa-search"></i>
        <input type="text" placeholder="Tìm kiếm..." />
      </div>
      <div className="header-right">
        <div className="header-notifications">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </div>
        <div className="header-user">
          {adminInfo && (
            <>
              <span className="user-name">{adminInfo.name}</span>
              <div className="user-avatar">
                <span>{adminInfo.name.charAt(0)}</span>
              </div>
            </>
          )}
          <div className="user-dropdown">
            <button onClick={handleLogout} className="logout-button">
              <i className="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;