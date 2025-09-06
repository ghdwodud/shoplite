import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PaymentService from '../services/PaymentService';
import CartService from '../services/CartService';

const PaymentSuccess = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        const paymentKey = searchParams.get('paymentKey');
        const orderId = searchParams.get('orderId');
        const amount = searchParams.get('amount');

        console.log('결제 성공 페이지 파라미터:', { paymentKey, orderId, amount });
        console.log('전체 URL 파라미터:', Object.fromEntries(searchParams));

        if (!paymentKey || !orderId || !amount) {
          console.error('필수 파라미터 누락:', { paymentKey, orderId, amount });
          setError('결제 정보가 올바르지 않습니다. 파라미터를 확인해주세요.');
          setLoading(false);
          return;
        }

        // 결제 승인 처리
        console.log('결제 승인 처리 시작...');
        const paymentResult = await PaymentService.confirmPayment(
          paymentKey, 
          orderId, 
          parseFloat(amount)
        );

        console.log('결제 승인 성공:', paymentResult);
        setPaymentInfo(paymentResult);

        // 장바구니 비우기 (결제 성공 시)
        if (user) {
          try {
            await CartService.clearCart(user.id);
            console.log('장바구니 비우기 성공');
          } catch (cartError) {
            console.error('장바구니 비우기 실패:', cartError);
          }
        }

      } catch (err) {
        console.error('결제 승인 실패:', err);
        console.error('에러 상세:', err.response?.data);
        
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           '결제 승인 처리 중 오류가 발생했습니다.';
        
        setError(`결제 승인 실패: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, user]);

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="payment-result">
          <div className="loading">
            <div className="spinner"></div>
            <p>결제를 처리하고 있습니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="payment-result">
          <div className="error-content">
            <div className="error-icon">❌</div>
            <h2>결제 처리 실패</h2>
            <p>{error}</p>
            <div className="actions">
              <button onClick={handleGoToHome} className="home-btn">
                홈으로 가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="payment-result">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h2>결제가 완료되었습니다!</h2>
          
          {paymentInfo && (
            <div className="payment-details">
              <div className="detail-item">
                <span className="label">주문번호:</span>
                <span className="value">{paymentInfo.orderIdString}</span>
              </div>
              <div className="detail-item">
                <span className="label">결제금액:</span>
                <span className="value">{PaymentService.formatAmount(paymentInfo.amount)}</span>
              </div>
              <div className="detail-item">
                <span className="label">결제방법:</span>
                <span className="value">{PaymentService.getPaymentMethodText(paymentInfo.method)}</span>
              </div>
              <div className="detail-item">
                <span className="label">결제상태:</span>
                <span className="value status-approved">
                  {PaymentService.getPaymentStatusText(paymentInfo.status)}
                </span>
              </div>
            </div>
          )}

          <div className="success-message">
            <p>주문이 성공적으로 접수되었습니다.</p>
            <p>빠른 시일 내에 배송해드리겠습니다.</p>
          </div>

          <div className="actions">
            <button onClick={handleGoToOrders} className="orders-btn">
              주문 내역 보기
            </button>
            <button onClick={handleGoToHome} className="home-btn">
              쇼핑 계속하기
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .payment-result {
          max-width: 600px;
          margin: 50px auto;
          padding: 40px;
          text-align: center;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .success-icon, .error-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .success-content h2 {
          color: #28a745;
          margin-bottom: 30px;
          font-size: 28px;
        }

        .error-content h2 {
          color: #dc3545;
          margin-bottom: 20px;
          font-size: 28px;
        }

        .payment-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
          text-align: left;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #dee2e6;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: bold;
          color: #495057;
        }

        .value {
          color: #212529;
        }

        .status-approved {
          color: #28a745;
          font-weight: bold;
        }

        .success-message {
          margin: 30px 0;
          color: #666;
          line-height: 1.6;
        }

        .success-message p {
          margin: 5px 0;
        }

        .actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }

        .orders-btn, .home-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 140px;
        }

        .orders-btn {
          background-color: #007bff;
          color: white;
        }

        .orders-btn:hover {
          background-color: #0056b3;
          transform: translateY(-1px);
        }

        .home-btn {
          background-color: #6c757d;
          color: white;
        }

        .home-btn:hover {
          background-color: #545b62;
          transform: translateY(-1px);
        }

        .loading {
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading p {
          color: #666;
          font-size: 16px;
        }

        .error-content p {
          color: #666;
          margin-bottom: 30px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;

