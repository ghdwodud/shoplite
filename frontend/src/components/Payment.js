import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentService from '../services/PaymentService';
import CartService from '../services/CartService';

const Payment = ({ user }) => {
  const [orderData, setOrderData] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.username || '',
    phone: user?.phoneNumber || '',
    address: user?.address || '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('카드');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // 장바구니에서 온 경우 또는 직접 주문하는 경우
    const cartItems = location.state?.cartItems || [];
    
    if (cartItems.length === 0) {
      setError('장바구니에 상품이 없습니다. 상품을 추가한 후 결제해주세요.');
      return;
    }

    try {
      // 주문 데이터 설정 (Cart 데이터 구조에 맞게 수정)
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      setOrderData({
        userId: user.id,
        orderItems,
        totalAmount,
        orderName: `${cartItems[0].productName} 외 ${cartItems.length - 1}건`,
        customerName: user.username,
        customerEmail: user.email,
        cartItems
      });
    } catch (err) {
      console.error('Error setting order data:', err);
      setError('주문 데이터 설정 중 오류가 발생했습니다.');
    }
  }, [user, location.state, navigate]);

  // 폼 유효성 검사
  useEffect(() => {
    const isValid = shippingInfo.name.trim() && 
                   shippingInfo.phone.trim() && 
                   shippingInfo.address.trim();
    setIsFormValid(isValid);
  }, [shippingInfo]);

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePayment = async () => {
    if (!orderData) return;

    setLoading(true);
    setError(null);

    try {
      // 1. 결제용 주문 생성
      const order = await PaymentService.createOrderForPayment({
        userId: orderData.userId,
        orderItems: orderData.orderItems,
        shippingInfo
      });

      // 2. 토스페이먼츠 결제창 호출
      await PaymentService.requestTossPayment({
        ...orderData,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentMethod
      });

    } catch (err) {
      setError(err.response?.data?.message || '결제 처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  if (error && !orderData) {
    return (
      <div className="container">
        <div className="payment-container">
          <div className="error-state">
            <div className="error-icon">🛒</div>
            <h2>결제할 상품이 없습니다</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button 
                className="go-cart-btn"
                onClick={() => navigate('/cart')}
              >
                장바구니로 가기
              </button>
              <button 
                className="go-home-btn"
                onClick={() => navigate('/')}
              >
                쇼핑 계속하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return <div className="loading">주문 정보를 불러오는 중...</div>;
  }

  return (
    <div className="container">
      <div className="payment-container">
        <h2>결제하기</h2>

        {error && <div className="error-message">{error}</div>}

        {/* 주문 상품 정보 */}
        <div className="order-summary">
          <h3>주문 상품</h3>
          <div className="order-items">
            {orderData.cartItems.map(item => (
              <div key={item.id} className="order-item">
                <img 
                  src={item.productImageUrl || '/placeholder-image.jpg'} 
                  alt={item.productName}
                  className="product-image"
                />
                <div className="item-info">
                  <h4>{item.productName}</h4>
                  <p className="item-price">
                    {PaymentService.formatAmount(item.productPrice)} × {item.quantity}개
                  </p>
                  <p className="item-total">
                    {PaymentService.formatAmount(item.productPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="total-amount">
            <strong>총 결제금액: {PaymentService.formatAmount(orderData.totalAmount)}</strong>
          </div>
        </div>

        {/* 배송 정보 */}
        <div className="shipping-info">
          <h3>배송 정보</h3>
          <div className="form-group">
            <label htmlFor="name">받는 사람 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={shippingInfo.name}
              onChange={handleShippingInfoChange}
              required
              placeholder="받는 분의 성함을 입력해주세요"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">연락처 *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingInfoChange}
              required
              placeholder="010-0000-0000"
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">배송 주소 *</label>
            <textarea
              id="address"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingInfoChange}
              required
              rows="3"
              placeholder="상세 주소를 입력해주세요"
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">배송 메모</label>
            <textarea
              id="notes"
              name="notes"
              value={shippingInfo.notes}
              onChange={handleShippingInfoChange}
              rows="2"
              placeholder="배송 시 요청사항을 입력해주세요 (선택사항)"
            />
          </div>
        </div>

        {/* 결제 방법 선택 */}
        <div className="payment-method">
          <h3>결제 방법</h3>
          <div className="payment-options">
            {['카드', '계좌이체', '가상계좌', '휴대폰'].map(method => (
              <button
                key={method}
                type="button"
                className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodChange(method)}
              >
                <span className="method-icon">
                  {method === '카드' && '💳'}
                  {method === '계좌이체' && '🏦'}
                  {method === '가상계좌' && '🏧'}
                  {method === '휴대폰' && '📱'}
                </span>
                <span className="method-text">{method}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 결제 버튼 */}
        <div className="payment-actions">
          <button 
            className="cancel-btn"
            onClick={() => navigate('/cart')}
            disabled={loading}
          >
            취소
          </button>
          <button 
            className="payment-btn"
            onClick={handlePayment}
            disabled={loading || !isFormValid}
          >
            {loading ? '결제 처리 중...' : `${PaymentService.formatAmount(orderData.totalAmount)} ${paymentMethod}로 결제하기`}
          </button>
        </div>
      </div>

      <style jsx>{`
        .payment-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .payment-container h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #333;
        }

        .order-summary, .shipping-info, .payment-method {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .order-summary h3, .shipping-info h3, .payment-method h3 {
          margin-bottom: 15px;
          color: #495057;
        }

        .order-items {
          margin-bottom: 15px;
        }

        .order-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #dee2e6;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
          margin-right: 15px;
        }

        .item-info h4 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: #333;
        }

        .item-price, .item-total {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .item-total {
          font-weight: bold;
          color: #007bff;
        }

        .total-amount {
          text-align: right;
          padding-top: 15px;
          border-top: 2px solid #007bff;
          font-size: 18px;
          color: #007bff;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #555;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .payment-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 30px;
        }

        .cancel-btn, .payment-btn {
          padding: 12px 30px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .cancel-btn {
          background-color: #6c757d;
          color: white;
        }

        .cancel-btn:hover:not(:disabled) {
          background-color: #545b62;
        }

        .payment-btn {
          background-color: #007bff;
          color: white;
          font-weight: bold;
        }

        .payment-btn:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .payment-btn:disabled,
        .cancel-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          border: 1px solid #f5c6cb;
        }

        .loading {
          text-align: center;
          padding: 50px;
          font-size: 18px;
          color: #666;
        }

        /* 결제 방법 선택 스타일 */
        .payment-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .payment-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px 10px;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 80px;
        }

        .payment-option:hover {
          border-color: #007bff;
          background-color: #f8f9ff;
        }

        .payment-option.selected {
          border-color: #007bff;
          background-color: #e3f2fd;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
        }

        .method-icon {
          font-size: 24px;
          margin-bottom: 5px;
        }

        .method-text {
          font-size: 14px;
          font-weight: 500;
          color: #495057;
        }

        .payment-option.selected .method-text {
          color: #007bff;
          font-weight: 600;
        }

        /* 폼 개선 */
        .form-group label {
          font-size: 14px;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #adb5bd;
          font-style: italic;
        }

        .form-group input:invalid,
        .form-group textarea:invalid {
          border-color: #dc3545;
        }

        .form-group input:valid,
        .form-group textarea:valid {
          border-color: #28a745;
        }

        /* 에러 상태 스타일 */
        .error-state {
          text-align: center;
          padding: 60px 20px;
        }

        .error-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .error-state h2 {
          color: #dc3545;
          margin-bottom: 15px;
          font-size: 24px;
        }

        .error-state p {
          color: #666;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .error-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .go-cart-btn, .go-home-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 140px;
        }

        .go-cart-btn {
          background-color: #007bff;
          color: white;
        }

        .go-cart-btn:hover {
          background-color: #0056b3;
          transform: translateY(-1px);
        }

        .go-home-btn {
          background-color: #6c757d;
          color: white;
        }

        .go-home-btn:hover {
          background-color: #545b62;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default Payment;

