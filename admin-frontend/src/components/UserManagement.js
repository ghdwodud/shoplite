import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // 모의 사용자 데이터
      const mockUsers = [
        {
          id: 1,
          name: '김철수',
          email: 'kim@example.com',
          role: 'customer',
          joinDate: '2024-01-10',
          lastLogin: '2024-01-15',
          status: 'active',
          totalOrders: 5,
          totalSpent: 750000
        },
        {
          id: 2,
          name: '이영희',
          email: 'lee@example.com',
          role: 'customer',
          joinDate: '2024-01-08',
          lastLogin: '2024-01-14',
          status: 'active',
          totalOrders: 3,
          totalSpent: 450000
        },
        {
          id: 3,
          name: '박민수',
          email: 'park@example.com',
          role: 'admin',
          joinDate: '2024-01-01',
          lastLogin: '2024-01-15',
          status: 'active',
          totalOrders: 0,
          totalSpent: 0
        },
        {
          id: 4,
          name: '정수진',
          email: 'jung@example.com',
          role: 'customer',
          joinDate: '2024-01-05',
          lastLogin: '2024-01-12',
          status: 'inactive',
          totalOrders: 1,
          totalSpent: 50000
        },
        {
          id: 5,
          name: '최관리',
          email: 'admin@example.com',
          role: 'admin',
          joinDate: '2023-12-01',
          lastLogin: '2024-01-15',
          status: 'active',
          totalOrders: 0,
          totalSpent: 0
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'btn-danger';
      case 'customer': return 'btn-primary';
      default: return 'btn-secondary';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return '관리자';
      case 'customer': return '고객';
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'btn-success';
      case 'inactive': return 'btn-warning';
      case 'banned': return 'btn-danger';
      default: return 'btn-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '활성';
      case 'inactive': return '비활성';
      case 'banned': return '차단';
      default: return status;
    }
  };

  const handleStatusUpdate = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handleRoleUpdate = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="loading">사용자를 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>사용자 관리</h1>
      </div>

      <div className="content-section">
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="이름 또는 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '10px', border: '1px solid #ced4da', borderRadius: '4px' }}
          >
            <option value="all">모든 역할</option>
            <option value="admin">관리자</option>
            <option value="customer">고객</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>상태</th>
                <th>가입일</th>
                <th>마지막 로그인</th>
                <th>주문 수</th>
                <th>총 구매액</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`btn ${getRoleColor(user.role)}`} style={{ padding: '4px 8px', fontSize: '12px' }}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`btn ${getStatusColor(user.status)}`} style={{ padding: '4px 8px', fontSize: '12px' }}>
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>{user.lastLogin}</td>
                  <td>{user.totalOrders}</td>
                  <td>₩{user.totalSpent.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusUpdate(user.id, e.target.value)}
                        style={{ padding: '4px', fontSize: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                      >
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                        <option value="banned">차단</option>
                      </select>
                      {user.role !== 'admin' && (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                          style={{ padding: '4px', fontSize: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                        >
                          <option value="customer">고객</option>
                          <option value="admin">관리자</option>
                        </select>
                      )}
                      <button 
                        className="btn btn-primary"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        상세보기
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {searchTerm || roleFilter !== 'all' ? '검색 결과가 없습니다.' : '등록된 사용자가 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;


