import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import CartService from '../services/CartService';

const Header = ({ user, onLogout }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCartItemCount();
    }
  }, [user]);

  const fetchCartItemCount = async () => {
    try {
      const count = await CartService.getCartItemCount(user.id);
      setCartItemCount(count);
    } catch (error) {
      console.error('Error fetching cart item count:', error);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    onLogout();
    navigate('/');
  };

  const handleDevLogin = async () => {
    try {
      const response = await AuthService.login('customer@test.com', 'test123');
      if (response.token) {
        // 사용자 정보를 부모 컴포넌트에 전달
        const userData = {
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role
        };
        // App.js의 setUser 함수 호출을 위해 새로고침
        window.location.reload();
      }
    } catch (error) {
      console.error('개발용 로그인 실패:', error);
      alert('개발용 로그인에 실패했습니다.');
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            ShopLite
          </Link>
          <nav className="nav">
            <Link to="/">상품 목록</Link>
            {user ? (
              <>
                <Link to="/cart">
                  장바구니 {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
                <Link to="/payment/test" style={{ color: '#28a745', fontWeight: 'bold' }}>
                  🧪 결제 테스트
                </Link>
                <Link to="/orders">주문 내역</Link>
                <Link to="/profile">내 정보</Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin/orders" style={{ color: '#dc3545', fontWeight: 'bold' }}>
                    🔧 주문 관리
                  </Link>
                )}
                <span style={{ color: '#adb5bd' }}>
                  {user.username}님
                </span>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#adb5bd', 
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px'
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login">로그인</Link>
                <Link to="/signup">회원가입</Link>
                <button 
                  onClick={handleDevLogin}
                  style={{ 
                    background: '#28a745', 
                    border: 'none', 
                    color: 'white', 
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    marginLeft: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                  title="개발용 테스트 계정으로 바로 로그인"
                >
                  🔧 개발로그인
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
