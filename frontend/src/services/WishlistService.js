import apiClient from './ApiClient';

class WishlistService {
  // 위시리스트에 상품 추가
  static async addToWishlist(userId, productId) {
    return await apiClient.post(`/wishlist/add?userId=${userId}&productId=${productId}`);
  }

  // 위시리스트에서 상품 제거
  static async removeFromWishlist(userId, productId) {
    return await apiClient.delete(`/wishlist/remove?userId=${userId}&productId=${productId}`);
  }

  // 위시리스트 토글 (추가/제거)
  static async toggleWishlist(userId, productId) {
    return await apiClient.post(`/wishlist/toggle?userId=${userId}&productId=${productId}`);
  }

  // 사용자의 위시리스트 조회
  static async getUserWishlist(userId) {
    return await apiClient.get(`/wishlist/user/${userId}`);
  }

  // 위시리스트 상태 확인
  static async checkWishlistStatus(userId, productId) {
    return await apiClient.getPublic(`/wishlist/check?userId=${userId}&productId=${productId}`);
  }

  // 위시리스트 개수 조회
  static async getUserWishlistCount(userId) {
    return await apiClient.getPublic(`/wishlist/count/${userId}`);
  }
}

export default WishlistService;


