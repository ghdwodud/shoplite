import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Cart from './components/Cart';
import Header from './components/Header';
import Login from './components/Login';
import OrderManagement from './components/OrderManagement';
import Orders from './components/Orders';
import Payment from './components/Payment';
import PaymentFail from './components/PaymentFail';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentTest from './components/PaymentTest';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Signup from './components/Signup';
import Wishlist from './components/Wishlist';
import AuthService from './services/AuthService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 로그인 상태 확인
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductList user={user} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="/cart" element={<Cart user={user} />} />
            <Route path="/payment" element={<Payment user={user} />} />
            <Route path="/payment/test" element={<PaymentTest />} />
            <Route path="/payment/success" element={<PaymentSuccess user={user} />} />
            <Route path="/payment/fail" element={<PaymentFail />} />
            <Route path="/orders" element={<Orders user={user} />} />
            <Route path="/wishlist" element={<Wishlist user={user} />} />
            {user && user.role === 'ADMIN' && (
              <>
                <Route path="/add" element={<ProductForm />} />
                <Route path="/edit/:id" element={<ProductForm />} />
                <Route path="/admin/orders" element={<OrderManagement user={user} />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
