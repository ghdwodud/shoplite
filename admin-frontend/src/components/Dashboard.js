import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 실제 API 호출 대신 모의 데이터 사용
      setTimeout(() => {
        setStats({
          totalProducts: 156,
          totalOrders: 89,
          totalUsers: 234,
          totalRevenue: 1250000
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // 모의 차트 데이터
  const salesData = [
    { name: '1월', sales: 4000 },
    { name: '2월', sales: 3000 },
    { name: '3월', sales: 5000 },
    { name: '4월', sales: 4500 },
    { name: '5월', sales: 6000 },
    { name: '6월', sales: 5500 }
  ];

  const productData = [
    { name: '전자제품', value: 45 },
    { name: '의류', value: 30 },
    { name: '도서', value: 15 },
    { name: '기타', value: 10 }
  ];

  if (loading) {
    return <div className="loading">대시보드 데이터를 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>관리자 대시보드</h1>
      </div>

      {/* 통계 카드 */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>총 상품 수</h3>
          <div className="number">{stats.totalProducts}</div>
          <div className="change">+12% 이번 달</div>
        </div>
        <div className="stat-card">
          <h3>총 주문 수</h3>
          <div className="number">{stats.totalOrders}</div>
          <div className="change">+8% 이번 주</div>
        </div>
        <div className="stat-card">
          <h3>총 사용자 수</h3>
          <div className="number">{stats.totalUsers}</div>
          <div className="change">+15% 이번 달</div>
        </div>
        <div className="stat-card">
          <h3>총 매출</h3>
          <div className="number">₩{stats.totalRevenue.toLocaleString()}</div>
          <div className="change">+22% 이번 달</div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* 매출 차트 */}
        <div className="content-section">
          <h2>월별 매출 현황</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, '매출']} />
                <Line type="monotone" dataKey="sales" stroke="#007bff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 상품 카테고리 분포 */}
        <div className="content-section">
          <h2>상품 카테고리 분포</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, '비율']} />
                <Bar dataKey="value" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="content-section">
        <h2>최근 활동</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>시간</th>
                <th>활동</th>
                <th>사용자</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-01-15 14:30</td>
                <td>새 상품 등록</td>
                <td>관리자</td>
                <td><span className="btn btn-success" style={{ padding: '4px 8px', fontSize: '12px' }}>완료</span></td>
              </tr>
              <tr>
                <td>2024-01-15 13:45</td>
                <td>주문 처리</td>
                <td>관리자</td>
                <td><span className="btn btn-warning" style={{ padding: '4px 8px', fontSize: '12px' }}>진행중</span></td>
              </tr>
              <tr>
                <td>2024-01-15 12:20</td>
                <td>사용자 가입</td>
                <td>김철수</td>
                <td><span className="btn btn-info" style={{ padding: '4px 8px', fontSize: '12px' }}>신규</span></td>
              </tr>
              <tr>
                <td>2024-01-15 11:15</td>
                <td>상품 수정</td>
                <td>관리자</td>
                <td><span className="btn btn-success" style={{ padding: '4px 8px', fontSize: '12px' }}>완료</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

