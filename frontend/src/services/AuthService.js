import apiClient from './ApiClient';

class AuthService {
  // 로그인
  static async login(email, password) {
    const response = await apiClient.postPublic('/auth/login', {
      email,
      password
    });
    
    if (response.token) {
      localStorage.setItem('user', JSON.stringify(response));
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  // 회원가입
  static async signup(userData) {
    const response = await apiClient.postPublic('/auth/signup', userData);
    
    if (response.token) {
      localStorage.setItem('user', JSON.stringify(response));
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  // 로그아웃
  static logout() {
    localStorage.removeItem('user');
    this.setAuthToken(null);
  }

  // 현재 사용자 정보 가져오기
  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // 토큰 만료 확인
        if (user.token && this.isTokenExpired(user.token)) {
          this.logout();
          return null;
        }
        return user;
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        this.logout();
        return null;
      }
    }
    return null;
  }

  // 토큰 검증
  static async validateToken() {
    try {
      const user = this.getCurrentUser();
      if (!user || !user.token) {
        return false;
      }

      // 토큰 만료 확인
      if (this.isTokenExpired(user.token)) {
        this.logout();
        return false;
      }

      return await apiClient.get('/auth/validate');
    } catch (error) {
      console.error('토큰 검증 실패:', error);
      this.logout();
      return false;
    }
  }

  // axios 기본 헤더에 토큰 설정
  static setAuthToken(token) {
    // ApiClient에서 인터셉터로 처리하므로 여기서는 제거
    // 하지만 호환성을 위해 메서드는 유지
  }

  // 로그인 상태 확인
  static isLoggedIn() {
    const user = this.getCurrentUser();
    return user && user.token;
  }

  // 관리자 권한 확인
  static isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'ADMIN';
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

export default AuthService;