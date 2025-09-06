import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '대시보드', icon: '📊' },
    { path: '/products', label: '상품 관리', icon: '📦' },
    { path: '/orders', label: '주문 관리', icon: '🛒' },
    { path: '/users', label: '사용자 관리', icon: '👥' },
    { path: '/analytics', label: '분석', icon: '📈' }
  ];

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>ShopLite Admin</h2>
        </div>
        <nav>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span style={{ marginRight: '10px' }}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

