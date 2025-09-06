import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';

const OrderManagement = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let orderData;
      
      if (filterStatus === 'ALL') {
        orderData = await OrderService.getAllOrders();
      } else {
        orderData = await OrderService.getOrdersByStatus(filterStatus);
      }
      
      setOrders(orderData);
      setError(null);
    } catch (err) {
      console.error('주문 목록 조회 실패:', err);
      setError('주문 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm(`주문 상태를 '${OrderService.getOrderStatusText(newStatus)}'로 변경하시겠습니까?`)) {
      return;
    }

    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      alert('주문 상태가 업데이트되었습니다.');
      fetchOrders();
    } catch (err) {
      console.error('주문 상태 업데이트 실패:', err);
      alert('주문 상태 업데이트에 실패했습니다.');
    }
  };

  const handleOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  if (loading) {
    return <div className="loading">주문 목록을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>오류 발생</h2>
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-btn">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="order-management-container">
        <div className="management-header">
          <h1>📦 주문 관리</h1>
          
          <div className="filter-section">
            <label htmlFor="statusFilter">상태 필터:</label>
            <select 
              id="statusFilter"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="ALL">전체</option>
              <option value="PENDING">결제 대기</option>
              <option value="CONFIRMED">주문 확정</option>
              <option value="SHIPPED">배송 중</option>
              <option value="DELIVERED">배송 완료</option>
              <option value="CANCELLED">주문 취소</option>
            </select>
          </div>
        </div>

        <div className="orders-stats">
          <div className="stat-card">
            <h3>전체 주문</h3>
            <p className="stat-number">{orders.length}</p>
          </div>
          <div className="stat-card">
            <h3>결제 대기</h3>
            <p className="stat-number pending">
              {orders.filter(o => o.status === 'PENDING').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>배송 중</h3>
            <p className="stat-number shipped">
              {orders.filter(o => o.status === 'SHIPPED').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>완료</h3>
            <p className="stat-number delivered">
              {orders.filter(o => o.status === 'DELIVERED').length}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📋</div>
            <h3>주문이 없습니다</h3>
            <p>현재 {filterStatus === 'ALL' ? '전체' : OrderService.getOrderStatusText(filterStatus)} 주문이 없습니다.</p>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>고객명</th>
                  <th>주문일시</th>
                  <th>금액</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="order-number">
                      <button 
                        className="link-btn"
                        onClick={() => handleOrderDetail(order)}
                      >
                        {order.orderNumber}
                      </button>
                    </td>
                    <td>{order.user?.username || order.shippingName || '-'}</td>
                    <td>{OrderService.formatDate(order.createdAt)}</td>
                    <td className="amount">{OrderService.formatAmount(order.totalAmount)}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: OrderService.getOrderStatusColor(order.status),
                          color: 'white'
                        }}
                      >
                        {OrderService.getOrderStatusText(order.status)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <select 
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusUpdate(order.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="status-select"
                          defaultValue=""
                        >
                          <option value="">상태 변경</option>
                          {getStatusOptions(order.status).map(status => (
                            <option key={status} value={status}>
                              {OrderService.getOrderStatusText(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 주문 상세 모달 */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>주문 상세 정보</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>주문 정보</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">주문번호:</span>
                    <span className="value">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">고객명:</span>
                    <span className="value">{selectedOrder.user?.username || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">주문일시:</span>
                    <span className="value">{OrderService.formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">주문상태:</span>
                    <span 
                      className="value status-badge"
                      style={{ 
                        backgroundColor: OrderService.getOrderStatusColor(selectedOrder.status),
                        color: 'white'
                      }}
                    >
                      {OrderService.getOrderStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">총 결제금액:</span>
                    <span className="value amount">{OrderService.formatAmount(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>배송 정보</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">받는 사람:</span>
                    <span className="value">{selectedOrder.shippingName || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">연락처:</span>
                    <span className="value">{selectedOrder.shippingPhone || '-'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="label">배송 주소:</span>
                    <span className="value">{selectedOrder.shippingAddress || '-'}</span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="detail-item full-width">
                      <span className="label">배송 메모:</span>
                      <span className="value">{selectedOrder.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                <div className="detail-section">
                  <h3>주문 상품</h3>
                  <div className="order-items-detail">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} className="item-detail">
                        <div className="item-info">
                          <h4>{item.product?.name || '상품명 없음'}</h4>
                          <p className="item-price">
                            {OrderService.formatAmount(item.price)} × {item.quantity}개
                          </p>
                        </div>
                        <div className="item-total">
                          {OrderService.formatAmount(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      handleStatusUpdate(selectedOrder.id, e.target.value);
                      e.target.value = '';
                      closeModal();
                    }
                  }}
                  className="status-select-large"
                  defaultValue=""
                >
                  <option value="">상태 변경</option>
                  {getStatusOptions(selectedOrder.status).map(status => (
                    <option key={status} value={status}>
                      {OrderService.getOrderStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .order-management-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .management-header h1 {
          margin: 0;
          color: #333;
        }

        .filter-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-section label {
          font-weight: bold;
          color: #555;
        }

        .status-filter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .orders-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }

        .stat-number {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
          color: #333;
        }

        .stat-number.pending { color: #ffc107; }
        .stat-number.shipped { color: #17a2b8; }
        .stat-number.delivered { color: #28a745; }

        .empty-orders {
          text-align: center;
          padding: 60px 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .orders-table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th,
        .orders-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
        }

        .orders-table th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #495057;
        }

        .orders-table tr:hover {
          background-color: #f8f9fa;
        }

        .order-number {
          font-family: monospace;
        }

        .link-btn {
          background: none;
          border: none;
          color: #007bff;
          text-decoration: underline;
          cursor: pointer;
          font-family: monospace;
        }

        .link-btn:hover {
          color: #0056b3;
        }

        .amount {
          font-weight: bold;
          color: #007bff;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .action-buttons {
          display: flex;
          gap: 5px;
        }

        .status-select, .status-select-large {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .status-select-large {
          padding: 10px 15px;
          font-size: 14px;
          width: 100%;
        }

        /* 모달 스타일 (Orders.js와 동일) */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #dee2e6;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: #333;
        }

        .modal-body {
          padding: 20px;
        }

        .detail-section {
          margin-bottom: 30px;
        }

        .detail-section h3 {
          margin: 0 0 15px 0;
          color: #333;
          border-bottom: 2px solid #007bff;
          padding-bottom: 5px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
        }

        .detail-item .label {
          font-weight: bold;
          color: #555;
        }

        .detail-item .value {
          color: #333;
        }

        .detail-item .value.amount {
          color: #007bff;
          font-weight: bold;
          font-size: 18px;
        }

        .order-items-detail {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .item-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .item-detail .item-info h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .item-detail .item-price {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .item-detail .item-total {
          font-weight: bold;
          color: #007bff;
          font-size: 16px;
        }

        .modal-actions {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
        }

        .loading {
          text-align: center;
          padding: 50px;
          font-size: 18px;
          color: #666;
        }

        .error-message {
          text-align: center;
          padding: 50px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          color: #721c24;
        }

        .retry-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 15px;
        }

        .retry-btn:hover {
          background-color: #c82333;
        }

        @media (max-width: 768px) {
          .management-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .orders-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .orders-table-container {
            overflow-x: auto;
          }

          .orders-table {
            min-width: 800px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            width: 95%;
            margin: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;

