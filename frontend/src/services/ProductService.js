import apiClient from './ApiClient';

class ProductService {
  // 모든 상품 조회
  static async getAllProducts() {
    return await apiClient.getPublic('/products');
  }

  // ID로 상품 조회
  static async getProductById(id) {
    return await apiClient.getPublic(`/products/${id}`);
  }

  // 상품 생성
  static async createProduct(product) {
    return await apiClient.post('/products', product);
  }

  // 상품 수정
  static async updateProduct(id, product) {
    return await apiClient.put(`/products/${id}`, product);
  }

  // 상품 삭제
  static async deleteProduct(id) {
    return await apiClient.delete(`/products/${id}`);
  }

  // 상품명으로 검색
  static async searchProductsByName(name) {
    return await apiClient.getPublic(`/products/search?name=${encodeURIComponent(name)}`);
  }

  // 가격 범위로 검색
  static async getProductsByPriceRange(minPrice, maxPrice) {
    return await apiClient.getPublic(`/products/search?minPrice=${minPrice}&maxPrice=${maxPrice}`);
  }

  static async searchProducts(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
    
    const queryString = params.toString();
    const url = queryString ? `/products/search?${queryString}` : '/products/search';
    
    return await apiClient.getPublic(url);
  }
}

export default ProductService;