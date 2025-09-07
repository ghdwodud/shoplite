import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // 모의 분석 데이터
      const mockData = {
        salesData: [
          { name: '1월', sales: 4000, orders: 45 },
          { name: '2월', sales: 3000, orders: 32 },
          { name: '3월', sales: 5000, orders: 58 },
          { name: '4월', sales: 4500, orders: 52 },
          { name: '5월', sales: 6000, orders: 68 },
          { name: '6월', sales: 5500, orders: 62 }
        ],
        categoryData: [
          { name: '전자제품', value: 45, color: '#0088FE' },
          { name: '의류', value: 30, color: '#00C49F' },
          { name: '도서', value: 15, color: '#FFBB28' },
          { name: '기타', value: 10, color: '#FF8042' }
        ],
        topProducts: [
          { name: '스마트폰', sales: 120, revenue: 18000000 },
          { name: '노트북', sales: 85, revenue: 17000000 },
          { name: '헤드폰', sales: 200, revenue: 15000000 },
          { name: '마우스', sales: 300, revenue: 9000000 },
          { name: '키보드', sales: 150, revenue: 7500000 }
        ],
        userGrowth: [
          { name: '1월', users: 100 },
          { name: '2월', users: 150 },
          { name: '3월', users: 200 },
          { name: '4월', users: 250 },
          { name: '5월', users: 300 },
          { name: '6월', users: 350 }
        ]
      };
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">분석 데이터를 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>분석 및 통계</h1>
      </div>

      {/* 매출 및 주문 현황 */}
      <div className="content-section">
        <h2>월별 매출 및 주문 현황</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? `₩${value.toLocaleString()}` : value,
                  name === 'sales' ? '매출' : '주문수'
                ]}
              />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#007bff" strokeWidth={2} name="sales" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#28a745" strokeWidth={2} name="orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* 상품 카테고리 분포 */}
        <div className="content-section">
          <h2>상품 카테고리 분포</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 사용자 증가 현황 */}
        <div className="content-section">
          <h2>사용자 증가 현황</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [value, '사용자 수']} />
                <Bar dataKey="users" fill="#17a2b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 인기 상품 TOP 5 */}
      <div className="content-section">
        <h2>인기 상품 TOP 5</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>순위</th>
                <th>상품명</th>
                <th>판매량</th>
                <th>매출액</th>
                <th>평균 단가</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topProducts.map((product, index) => (
                <tr key={index}>
                  <td>
                    <span className={`btn ${index < 3 ? 'btn-warning' : 'btn-secondary'}`} style={{ padding: '4px 8px', fontSize: '12px' }}>
                      {index + 1}위
                    </span>
                  </td>
                  <td><strong>{product.name}</strong></td>
                  <td>{product.sales}개</td>
                  <td>₩{product.revenue.toLocaleString()}</td>
                  <td>₩{(product.revenue / product.sales).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 주요 지표 요약 */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>총 매출</h3>
          <div className="number">₩28,000,000</div>
          <div className="change">+15% 이번 달</div>
        </div>
        <div className="stat-card">
          <h3>총 주문 수</h3>
          <div className="number">317</div>
          <div className="change">+8% 이번 주</div>
        </div>
        <div className="stat-card">
          <h3>평균 주문 금액</h3>
          <div className="number">₩88,000</div>
          <div className="change">+5% 이번 달</div>
        </div>
        <div className="stat-card">
          <h3>고객 만족도</h3>
          <div className="number">4.8/5</div>
          <div className="change">+0.2 이번 주</div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;





