import React, { useState } from 'react';
import PaymentService from '../services/PaymentService';

const PaymentTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testPayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      // 테스트용 주문 데이터
      const testOrderData = {
        totalAmount: 100, // 100원 (테스트 금액)
        orderNumber: `TEST_${Date.now()}`,
        orderName: '테스트 상품',
        customerName: '홍길동',
        customerEmail: 'test@example.com',
        paymentMethod: '카드'
      };

      console.log('테스트 결제 시작:', testOrderData);

      // 토스페이먼츠 결제창 호출
      await PaymentService.requestTossPayment(testOrderData);
      
    } catch (error) {
      console.error('결제 테스트 실패:', error);
      setResult({
        success: false,
        message: error.message || '결제 테스트 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧪 토스페이먼츠 결제 테스트</h2>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3>테스트 정보</h3>
        <ul>
          <li><strong>결제 금액:</strong> 100원</li>
          <li><strong>결제 방법:</strong> 카드</li>
          <li><strong>환경:</strong> 테스트 모드</li>
        </ul>
        
        <div style={{ 
          background: '#e7f3ff', 
          padding: '15px', 
          borderRadius: '4px', 
          marginTop: '15px',
          borderLeft: '4px solid #007bff'
        }}>
          <h4>📋 테스트 카드 정보</h4>
          <p><strong>카드번호:</strong> 4242424242424242</p>
          <p><strong>유효기간:</strong> 12/25</p>
          <p><strong>CVC:</strong> 123</p>
          <p><strong>비밀번호:</strong> 1234 (앞 2자리)</p>
        </div>
      </div>

      <button
        onClick={testPayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '18px',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? '결제창 로딩 중...' : '🚀 테스트 결제 시작'}
      </button>

      {result && (
        <div style={{
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: result.success ? '#155724' : '#721c24'
        }}>
          <h4>{result.success ? '✅ 성공' : '❌ 실패'}</h4>
          <p>{result.message}</p>
        </div>
      )}

      <div style={{ 
        background: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #ffeaa7',
        marginTop: '20px'
      }}>
        <h4>⚠️ 주의사항</h4>
        <ul>
          <li>이것은 테스트 환경입니다. 실제 결제가 이루어지지 않습니다.</li>
          <li>테스트 카드 정보만 사용해주세요.</li>
          <li>결제 성공 시 /payment/success 페이지로 이동합니다.</li>
          <li>결제 실패 시 /payment/fail 페이지로 이동합니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentTest;
