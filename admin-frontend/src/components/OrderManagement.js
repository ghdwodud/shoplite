import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // 모의 주문 데이터
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-2024-001',
          customerName: '김철수',
          customerEmail: 'kim@example.com',
          totalAmount: 150000,
          status: 'pending',
          orderDate: '2024-01-15',
          items: [
            { name: '스마트폰', quantity: 1, price: 150000 }
          ]
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-002',
          customerName: '이영희',
          customerEmail: 'lee@example.com',
          totalAmount: 75000,
          status: 'shipped',
          orderDate: '2024-01-14',
          items: [
            { name: '헤드폰', quantity: 1, price: 75000 }
          ]
        },
        {
          id: 3,
          orderNumber: 'ORD-2024-003',
          customerName: '박민수',
          customerEmail: 'park@example.com',
          totalAmount: 200000,
          status: 'delivered',
          orderDate: '2024-01-13',
          items: [
            { name: '노트북', quantity: 1, price: 200000 }
          ]
        },
        {
          id: 4,
          orderNumber: 'ORD-2024-004',
          customerName: '정수진',
          customerEmail: 'jung@example.com',
          totalAmount: 50000,
          status: 'cancelled',
          orderDate: '2024-01-12',
          items: [
            { name: '마우스', quantity: 2, price: 25000 }
          ]
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'btn-warning';
      case 'shipped': return 'btn-info';
      case 'delivered': return 'btn-success';
      case 'cancelled': return 'btn-danger';
      default: return 'btn-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'shipped': return '배송중';
      case 'delivered': return '배송완료';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">주문을 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>주문 관리</h1>
      </div>

      <div className="content-section">
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="주문번호, 고객명, 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
          >
            <option value="all">모든 상태</option>
            <option value="pending">대기중</option>
            <option value="shipped">배송중</option>
            <option value="delivered">배송완료</option>
            <option value="cancelled">취소됨</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>주문번호</th>
                <th>고객 정보</th>
                <th>주문 상품</th>
                <th>총 금액</th>
                <th>상태</th>
                <th>주문일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.orderNumber}</strong>
                  </td>
                  <td>
                    <div>
                      <div><strong>{order.customerName}</strong></div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>{order.customerEmail}</div>
                    </div>
                  </td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index} style={{ fontSize: '0.9rem' }}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>₩{order.totalAmount.toLocaleString()}</td>
                  <td>
                    <span className={`btn ${getStatusColor(order.status)}`} style={{ padding: '4px 8px', fontSize: '12px' }}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td>{order.orderDate}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                      {order.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                            className="btn btn-info"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            배송시작
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            className="btn btn-danger"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                          >
                            취소
                          </button>
                        </>
                      )}
                      {order.status === 'shipped' && (
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          className="btn btn-success"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          배송완료
                        </button>
                      )}
                      <button 
                        className="btn btn-primary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        상세보기
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {searchTerm || statusFilter !== 'all' ? '검색 결과가 없습니다.' : '등록된 주문이 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;


