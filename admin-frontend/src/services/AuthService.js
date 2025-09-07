import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

class AuthService {
  // 로그인
  static async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('admin', JSON.stringify(response.data));
        this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // 회원가입 (관리자용)
  static async signup(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        ...userData,
        role: 'ADMIN' // 관리자 역할 설정
      });
      
      if (response.data.token) {
        localStorage.setItem('admin', JSON.stringify(response.data));
        this.setAuthToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // 로그아웃
  static logout() {
    localStorage.removeItem('admin');
    delete axios.defaults.headers.common['Authorization'];
  }

  // 현재 관리자 정보 가져오기
  static getCurrentUser() {
    const adminStr = localStorage.getItem('admin');
    if (adminStr) {
      const admin = JSON.parse(adminStr);
      this.setAuthToken(admin.token);
      return admin;
    }
    return null;
  }

  // 토큰 검증
  static async validateToken() {
    try {
      const admin = this.getCurrentUser();
      if (!admin || !admin.token) {
        return false;
      }

      const response = await axios.get(`${API_BASE_URL}/validate`);
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      this.logout();
      return false;
    }
  }

  // 인증 토큰 설정
  static setAuthToken(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  // 로그인 상태 확인
  static isLoggedIn() {
    const admin = this.getCurrentUser();
    return admin && admin.token;
  }

  // 관리자 권한 확인
  static isAdmin() {
    const admin = this.getCurrentUser();
    return admin && admin.role === 'ADMIN';
  }

  // 토큰 만료 확인
  static isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

// 앱 시작 시 토큰 설정
const admin = AuthService.getCurrentUser();
if (admin && admin.token) {
  AuthService.setAuthToken(admin.token);
}

export default AuthService;





