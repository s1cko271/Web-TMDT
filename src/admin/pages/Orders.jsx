import React, { useState, useEffect } from 'react';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await fetch('/api/admin/orders', {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải danh sách đơn hàng');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi tải đơn hàng:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải chi tiết đơn hàng');
      }

      const data = await response.json();
      setOrderDetails(data);
      setSelectedOrder(orderId);
    } catch (err) {
      setError(err.message);
      console.error('Lỗi khi tải chi tiết đơn hàng:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }

      const updatedOrder = await response.json();

      // Update orders list
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));

      // Update order details if viewing this order
      if (selectedOrder === orderId && orderDetails) {
        setOrderDetails({
          ...orderDetails,
          order: { ...orderDetails.order, status: newStatus }
        });
      }

      alert('Cập nhật trạng thái đơn hàng thành công!');
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter orders by status
  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status.toLowerCase() === statusFilter);

  if (isLoading && !orderDetails) {
    return <div className="orders-loading">Đang tải dữ liệu...</div>;
  }

  if (error && !orderDetails) {
    return <div className="orders-error">Lỗi: {error}</div>;
  }

  return (
    <div className="orders-page">
      <h1>Quản lý Đơn hàng</h1>

      <div className="orders-container">
        <div className="orders-list-container">
          <div className="orders-filter">
            <label htmlFor="status-filter">Lọc theo trạng thái:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đang giao hàng</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="orders-list">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className={`order-item ${selectedOrder === order.id ? 'selected' : ''}`}
                  onClick={() => fetchOrderDetails(order.id)}
                >
                  <div className="order-header">
                    <span className="order-id">#{order.id}</span>
                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-customer">
                    <i className="fas fa-user"></i> {order.user_name}
                  </div>
                  <div className="order-info">
                    <div className="order-date">
                      <i className="fas fa-calendar-alt"></i> {formatDate(order.created_at)}
                    </div>
                    <div className="order-amount">
                      <i className="fas fa-money-bill-wave"></i> {formatCurrency(order.total_amount)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-orders">Không có đơn hàng nào</div>
            )}
          </div>
        </div>

        <div className="order-details-container">
          {selectedOrder && orderDetails ? (
            <div className="order-details">
              <h2>Chi tiết đơn hàng #{orderDetails.order.id}</h2>
              
              <div className="order-details-section">
                <h3>Thông tin khách hàng</h3>
                <div className="customer-info">
                  <p><strong>Tên:</strong> {orderDetails.order.user_name}</p>
                  <p><strong>Email:</strong> {orderDetails.order.user_email}</p>
                  <p><strong>Địa chỉ:</strong> {orderDetails.order.user_address || 'Không có'}</p>
                  <p><strong>Điện thoại:</strong> {orderDetails.order.user_phone || 'Không có'}</p>
                </div>
              </div>
              
              <div className="order-details-section">
                <h3>Thông tin đơn hàng</h3>
                <div className="order-info-details">
                  <p><strong>Ngày đặt hàng:</strong> {formatDate(orderDetails.order.created_at)}</p>
                  <p><strong>Trạng thái:</strong> 
                    <span className={`status-badge status-${orderDetails.order.status.toLowerCase()}`}>
                      {orderDetails.order.status}
                    </span>
                  </p>
                  <p><strong>Tổng tiền:</strong> {formatCurrency(orderDetails.order.total_amount)}</p>
                </div>
              </div>
              
              <div className="order-details-section">
                <h3>Sản phẩm</h3>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items.map(item => (
                      <tr key={item.id}>
                        <td className="product-cell">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="product-thumbnail" />
                          )}
                          <span>{item.name}</span>
                        </td>
                        <td>{formatCurrency(item.unit_price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unit_price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3">Tổng cộng</td>
                      <td>{formatCurrency(orderDetails.order.total_amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="order-actions">
                <h3>Cập nhật trạng thái</h3>
                <div className="status-buttons">
                  <button
                    className={`status-button pending ${orderDetails.order.status.toLowerCase() === 'pending' ? 'active' : ''}`}
                    onClick={() => updateOrderStatus(orderDetails.order.id, 'Pending')}
                    disabled={orderDetails.order.status.toLowerCase() === 'pending'}
                  >
                    Chờ xử lý
                  </button>
                  <button
                    className={`status-button processing ${orderDetails.order.status.toLowerCase() === 'processing' ? 'active' : ''}`}
                    onClick={() => updateOrderStatus(orderDetails.order.id, 'Processing')}
                    disabled={orderDetails.order.status.toLowerCase() === 'processing'}
                  >
                    Đang xử lý
                  </button>
                  <button
                    className={`status-button shipped ${orderDetails.order.status.toLowerCase() === 'shipped' ? 'active' : ''}`}
                    onClick={() => updateOrderStatus(orderDetails.order.id, 'Shipped')}
                    disabled={orderDetails.order.status.toLowerCase() === 'shipped'}
                  >
                    Đang giao hàng
                  </button>
                  <button
                    className={`status-button completed ${orderDetails.order.status.toLowerCase() === 'completed' ? 'active' : ''}`}
                    onClick={() => updateOrderStatus(orderDetails.order.id, 'Completed')}
                    disabled={orderDetails.order.status.toLowerCase() === 'completed'}
                  >
                    Hoàn thành
                  </button>
                  <button
                    className={`status-button cancelled ${orderDetails.order.status.toLowerCase() === 'cancelled' ? 'active' : ''}`}
                    onClick={() => updateOrderStatus(orderDetails.order.id, 'Cancelled')}
                    disabled={orderDetails.order.status.toLowerCase() === 'cancelled'}
                  >
                    Hủy đơn
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-order-selected">
              <i className="fas fa-shopping-cart"></i>
              <p>Chọn một đơn hàng để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;