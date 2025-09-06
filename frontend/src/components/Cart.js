import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../services/CartService';

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const items = await CartService.getCartItems(user.id);
      setCartItems(items);
      setError(null);
    } catch (err) {
      setError('장바구니를 불러오는데 실패했습니다.');
      console.error('Error fetching cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await CartService.updateCartItem(cartItemId, newQuantity);
      setCartItems(cartItems.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      setError('수량 변경에 실패했습니다.');
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (cartItemId) => {
    if (window.confirm('이 상품을 장바구니에서 제거하시겠습니까?')) {
      try {
        await CartService.removeFromCart(cartItemId);
        setCartItems(cartItems.filter(item => item.id !== cartItemId));
      } catch (err) {
        setError('상품 제거에 실패했습니다.');
        console.error('Error removing item:', err);
      }
    }
  };

  const clearCart = async () => {
    if (window.confirm('장바구니를 모두 비우시겠습니까?')) {
      try {
        await CartService.clearCart(user.id);
        setCartItems([]);
      } catch (err) {
        setError('장바구니 비우기에 실패했습니다.');
        console.error('Error clearing cart:', err);
      }
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    navigate('/payment', { state: { cartItems } });
  };


  if (loading) {
    return <div className="loading">장바구니를 불러오는 중...</div>;
  }

  return (
    <div className="container">
      <h1>장바구니</h1>
      
      {error && <div className="error">{error}</div>}

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>장바구니가 비어있습니다.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            쇼핑 계속하기
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span>{cartItems.length}개 상품</span>
            <button 
              className="btn btn-danger"
              onClick={clearCart}
            >
              장바구니 비우기
            </button>
          </div>

          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '20px', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                marginBottom: '10px',
                backgroundColor: 'white'
              }}>
                {item.productImageUrl && (
                  <img 
                    src={item.productImageUrl} 
                    alt={item.productName}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
                  />
                )}
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{item.productName}</h3>
                  <p style={{ color: '#666', margin: '0 0 10px 0' }}>{item.productDescription}</p>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>
                    ₩{item.productPrice.toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    style={{ padding: '5px 10px' }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '30px', textAlign: 'center', fontSize: '1.1rem' }}>
                    {item.quantity}
                  </span>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ padding: '5px 10px' }}
                  >
                    +
                  </button>
                </div>

                <div style={{ minWidth: '100px', textAlign: 'right', marginLeft: '15px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    ₩{(item.productPrice * item.quantity).toLocaleString()}
                  </div>
                  <button 
                    className="btn btn-danger"
                    onClick={() => removeItem(item.id)}
                    style={{ padding: '4px 8px', fontSize: '12px', marginTop: '5px' }}
                  >
                    제거
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3>총 결제금액: ₩{getTotalPrice().toLocaleString()}</h3>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                쇼핑 계속하기
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCheckout}
                style={{ fontSize: '1.1rem', padding: '12px 24px' }}
              >
                결제하기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
