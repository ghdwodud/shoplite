import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFail = () => {
  const [failureInfo, setFailureInfo] = useState(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const orderId = searchParams.get('orderId');

    setFailureInfo({
      code,
      message,
      orderId
    });
  }, [searchParams]);

  const handleRetryPayment = () => {
    // 장바구니로 돌아가서 다시 결제 시도
    navigate('/cart');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const getFailureMessage = (code, message) => {
    // 토스페이먼츠 에러 코드에 따른 사용자 친화적 메시지
    const errorMessages = {
      'PAY_PROCESS_CANCELED': '사용자가 결제를 취소했습니다.',
      'PAY_PROCESS_ABORTED': '결제 진행 중 오류가 발생했습니다.',
      'REJECT_CARD_COMPANY': '카드사에서 결제를 거절했습니다.',
      'INSUFFICIENT_FUNDS': '잔액이 부족합니다.',
      'INVALID_CARD_EXPIRATION': '카드 유효기간을 확인해주세요.',
      'INVALID_STOPPED_CARD': '정지된 카드입니다.',
      'EXCEED_MAX_DAILY_PAYMENT_COUNT': '일일 결제 한도를 초과했습니다.',
      'NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT': '할부가 지원되지 않는 카드입니다.',
      'INVALID_CARD_INSTALLMENT_PLAN': '잘못된 할부 개월수입니다.',
      'NOT_AVAILABLE_PAYMENT': '결제가 불가능한 시간입니다.',
      'SYSTEM_ERROR': '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    };

    return errorMessages[code] || message || '결제 처리 중 오류가 발생했습니다.';
  };

  return (
    <div className="container">
      <div className="payment-result">
        <div className="fail-content">
          <div className="fail-icon">❌</div>
          <h2>결제에 실패했습니다</h2>
          
          {failureInfo && (
            <div className="failure-details">
              <div className="failure-message">
                <p>{getFailureMessage(failureInfo.code, failureInfo.message)}</p>
              </div>
              
              {failureInfo.orderId && (
                <div className="detail-item">
                  <span className="label">주문번호:</span>
                  <span className="value">{failureInfo.orderId}</span>
                </div>
              )}
              
              {failureInfo.code && (
                <div className="error-code">
                  <small>오류 코드: {failureInfo.code}</small>
                </div>
              )}
            </div>
          )}

          <div className="help-message">
            <p>결제에 문제가 있으시면 다음을 확인해보세요:</p>
            <ul>
              <li>카드 정보가 정확한지 확인</li>
              <li>카드 한도 및 잔액 확인</li>
              <li>인터넷 연결 상태 확인</li>
              <li>다른 결제 방법으로 시도</li>
            </ul>
          </div>

          <div className="actions">
            <button onClick={handleRetryPayment} className="retry-btn">
              다시 결제하기
            </button>
            <button onClick={handleGoToHome} className="home-btn">
              홈으로 가기
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

        .fail-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .fail-content h2 {
          color: #dc3545;
          margin-bottom: 30px;
          font-size: 28px;
        }

        .failure-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
          border-left: 4px solid #dc3545;
        }

        .failure-message {
          margin-bottom: 15px;
        }

        .failure-message p {
          color: #dc3545;
          font-weight: bold;
          font-size: 16px;
          margin: 0;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #dee2e6;
          text-align: left;
        }

        .label {
          font-weight: bold;
          color: #495057;
        }

        .value {
          color: #212529;
        }

        .error-code {
          margin-top: 10px;
          text-align: right;
        }

        .error-code small {
          color: #6c757d;
          font-size: 12px;
        }

        .help-message {
          margin: 30px 0;
          text-align: left;
          background: #e7f3ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }

        .help-message p {
          margin: 0 0 15px 0;
          font-weight: bold;
          color: #495057;
        }

        .help-message ul {
          margin: 0;
          padding-left: 20px;
          color: #666;
        }

        .help-message li {
          margin: 8px 0;
          line-height: 1.4;
        }

        .actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }

        .retry-btn, .home-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 140px;
        }

        .retry-btn {
          background-color: #007bff;
          color: white;
        }

        .retry-btn:hover {
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
      `}</style>
    </div>
  );
};

export default PaymentFail;





