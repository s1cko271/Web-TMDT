import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    productCount: 0,
    orderCount: 0,
    revenue: 0,
    topProducts: [],
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu dashboard');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Lỗi: {error}</div>;
  }

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="dashboard">
      <h1>Tổng quan</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon users-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Người dùng</h3>
            <p>{stats.userCount}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon products-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-info">
            <h3>Sản phẩm</h3>
            <p>{stats.productCount}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-info">
            <h3>Đơn hàng</h3>
            <p>{stats.orderCount}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="stat-info">
            <h3>Doanh thu</h3>
            <p>{formatCurrency(stats.revenue)}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Sản phẩm bán chạy</h2>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Đã bán</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.length > 0 ? (
                stats.topProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.unit_price)}</td>
                    <td>{product.total_sold}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="dashboard-card">
          <h2>Đơn hàng gần đây</h2>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user_name}</td>
                    <td>{formatCurrency(order.total_amount)}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;