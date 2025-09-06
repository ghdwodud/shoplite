import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrderService';
import PaymentService from '../services/PaymentService';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orderData = await OrderService.getUserOrders(user.id);
      setOrders(orderData);
      setError(null);
    } catch (err) {
      console.error('주문 내역 조회 실패:', err);
      setError('주문 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('정말로 주문을 취소하시겠습니까?')) {
      return;
    }

    try {
      await OrderService.cancelOrder(orderId);
      alert('주문이 취소되었습니다.');
      fetchOrders(); // 목록 새로고침
    } catch (err) {
      console.error('주문 취소 실패:', err);
      alert('주문 취소에 실패했습니다.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <div className="loading">주문 내역을 불러오는 중...</div>;
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
      <div className="orders-container">
        <h1>주문 내역</h1>
        
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>주문 내역이 없습니다</h3>
            <p>첫 번째 주문을 해보세요!</p>
            <button 
              className="shop-btn"
              onClick={() => navigate('/')}
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>주문번호: {order.orderNumber}</h3>
                    <p className="order-date">
                      {OrderService.formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: OrderService.getOrderStatusColor(order.status),
                        color: 'white'
                      }}
                    >
                      {OrderService.getOrderStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-content">
                  <div className="order-items">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      <div className="items-summary">
                        <span>{order.orderItems[0].product?.name || '상품'}</span>
                        {order.orderItems.length > 1 && (
                          <span> 외 {order.orderItems.length - 1}건</span>
                        )}
                      </div>
                    ) : (
                      <span>주문 상품 정보 없음</span>
                    )}
                  </div>

                  <div className="order-amount">
                    <strong>{OrderService.formatAmount(order.totalAmount)}</strong>
                  </div>
                </div>

                <div className="order-actions">
                  <button 
                    className="detail-btn"
                    onClick={() => handleOrderDetail(order)}
                  >
                    상세보기
                  </button>
                  
                  {order.status === 'PENDING' && (
                    <button 
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      주문취소
                    </button>
                  )}
                </div>
              </div>
            ))}
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
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .orders-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .orders-container h1 {
          text-align: center;
          margin-bottom: 30px;
          color: #333;
        }

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

        .empty-orders h3 {
          color: #666;
          margin-bottom: 10px;
        }

        .empty-orders p {
          color: #999;
          margin-bottom: 30px;
        }

        .shop-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .shop-btn:hover {
          background-color: #0056b3;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: box-shadow 0.2s;
        }

        .order-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .order-info h3 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 18px;
        }

        .order-date {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .order-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .items-summary {
          color: #666;
        }

        .order-amount {
          font-size: 18px;
          color: #007bff;
        }

        .order-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .detail-btn, .cancel-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .detail-btn {
          background-color: #007bff;
          color: white;
        }

        .detail-btn:hover {
          background-color: #0056b3;
        }

        .cancel-btn {
          background-color: #dc3545;
          color: white;
        }

        .cancel-btn:hover {
          background-color: #c82333;
        }

        /* 모달 스타일 */
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
          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .order-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .order-actions {
            justify-content: flex-start;
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

export default Orders;

