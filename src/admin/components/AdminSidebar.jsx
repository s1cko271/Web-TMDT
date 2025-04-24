import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>School Store</h2>
        <p>Trang quản trị</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-tachometer-alt"></i>
              <span>Tổng quan</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-box"></i>
              <span>Sản phẩm</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-tags"></i>
              <span>Danh mục</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-shopping-cart"></i>
              <span>Đơn hàng</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-users"></i>
              <span>Người dùng</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/promotions" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-bullhorn"></i>
              <span>Khuyến mãi</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <NavLink to="/" className="back-to-site">
          <i className="fas fa-arrow-left"></i>
          <span>Về trang chủ</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;