import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products';

class ProductService {
  // 모든 상품 조회
  static async getAllProducts() {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // ID로 상품 조회
  static async getProductById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // 상품 생성
  static async createProduct(product) {
    try {
      const response = await axios.post(API_BASE_URL, product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // 상품 수정
  static async updateProduct(id, product) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, product);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // 상품 삭제
  static async deleteProduct(id) {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // 상품명으로 검색
  static async searchProductsByName(name) {
    try {
      const response = await axios.get(`${API_BASE_URL}/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // 가격 범위로 검색
  static async getProductsByPriceRange(minPrice, maxPrice) {
    try {
      const response = await axios.get(`${API_BASE_URL}/search?minPrice=${minPrice}&maxPrice=${maxPrice}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by price range:', error);
      throw error;
    }
  }
}

export default ProductService;





