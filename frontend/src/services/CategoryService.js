import apiClient from './ApiClient';

class CategoryService {
  static async getAllCategories() {
    return await apiClient.getPublic('/categories');
  }

  static async getActiveCategories() {
    return await apiClient.getPublic('/categories/active');
  }

  static async getCategoryById(id) {
    return await apiClient.getPublic(`/categories/${id}`);
  }

  static async createCategory(category) {
    return await apiClient.post('/categories', category);
  }

  static async updateCategory(id, category) {
    return await apiClient.put(`/categories/${id}`, category);
  }

  static async deleteCategory(id) {
    return await apiClient.delete(`/categories/${id}`);
  }
}

export default CategoryService;



