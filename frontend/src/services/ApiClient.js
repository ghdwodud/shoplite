import axios from 'axios';
import AuthService from './AuthService';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
  constructor() {
    // axios 인스턴스 생성
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 - 모든 요청에 JWT 토큰 자동 추가
    this.client.interceptors.request.use(
      (config) => {
        const user = AuthService.getCurrentUser();
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터 - 401 에러 시 자동 로그아웃
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // 토큰이 만료되었거나 유효하지 않음
          AuthService.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // GET 요청
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      console.error(`GET ${url} 요청 실패:`, error);
      throw error;
    }
  }

  // POST 요청
  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} 요청 실패:`, error);
      throw error;
    }
  }

  // PUT 요청
  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} 요청 실패:`, error);
      throw error;
    }
  }

  // DELETE 요청
  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} 요청 실패:`, error);
      throw error;
    }
  }

  // PATCH 요청
  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PATCH ${url} 요청 실패:`, error);
      throw error;
    }
  }

  // 파일 업로드용 POST 요청
  async postFormData(url, formData, config = {}) {
    try {
      const response = await this.client.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`POST FormData ${url} 요청 실패:`, error);
      throw error;
    }
  }

  // 인증이 필요하지 않은 요청 (로그인, 회원가입 등)
  async postPublic(url, data = {}, config = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}${url}`, data, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`POST Public ${url} 요청 실패:`, error);
      throw error;
    }
  }

  // 인증이 필요하지 않은 GET 요청 (상품 목록 등)
  async getPublic(url, config = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}${url}`, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`GET Public ${url} 요청 실패:`, error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
const apiClient = new ApiClient();

export default apiClient;



