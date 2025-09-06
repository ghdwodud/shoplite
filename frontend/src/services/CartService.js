import apiClient from './ApiClient';

class CartService {
  // 장바구니 항목 조회
  static async getCartItems(userId) {
    return await apiClient.get(`/cart/user/${userId}`);
  }

  // 장바구니에 상품 추가
  static async addToCart(userId, productId, quantity = 1) {
    return await apiClient.post('/cart', {
      userId,
      productId,
      quantity
    });
  }

  // 장바구니 항목 수량 업데이트
  static async updateCartItem(cartItemId, quantity) {
    return await apiClient.put(`/cart/${cartItemId}`, {
      quantity
    });
  }

  // 장바구니에서 항목 제거
  static async removeFromCart(cartItemId) {
    return await apiClient.delete(`/cart/${cartItemId}`);
  }

  // 장바구니 비우기
  static async clearCart(userId) {
    return await apiClient.delete(`/cart/user/${userId}`);
  }

  // 장바구니 항목 개수 조회
  static async getCartItemCount(userId) {
    return await apiClient.get(`/cart/user/${userId}/count`);
  }

  // 장바구니 총 금액 조회
  static async getCartTotal(userId) {
    return await apiClient.get(`/cart/user/${userId}/total`);
  }
}

export default CartService;