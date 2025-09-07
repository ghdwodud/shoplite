import apiClient from './ApiClient';

class OrderService {
  // 사용자별 주문 내역 조회
  static async getUserOrders(userId) {
    return await apiClient.get(`/orders/user/${userId}`);
  }

  // 주문 상세 조회
  static async getOrderById(orderId) {
    return await apiClient.get(`/orders/${orderId}`);
  }

  // 모든 주문 조회 (관리자용)
  static async getAllOrders() {
    return await apiClient.get('/orders');
  }

  // 상태별 주문 조회
  static async getOrdersByStatus(status) {
    return await apiClient.get(`/orders/status/${status}`);
  }

  // 주문 상태 업데이트
  static async updateOrderStatus(orderId, status) {
    return await apiClient.put(`/orders/${orderId}/status`, { status });
  }

  // 주문 취소
  static async cancelOrder(orderId) {
    return await apiClient.delete(`/orders/${orderId}`);
  }

  // 주문 확정
  static async confirmOrder(orderId) {
    return await apiClient.post(`/orders/${orderId}/confirm`);
  }

  // 주문 상태 한글 변환
  static getOrderStatusText(status) {
    const statusMap = {
      'PENDING': '결제 대기',
      'CONFIRMED': '주문 확정',
      'SHIPPED': '배송 중',
      'DELIVERED': '배송 완료',
      'CANCELLED': '주문 취소'
    };
    return statusMap[status] || status;
  }

  // 주문 상태 색상
  static getOrderStatusColor(status) {
    const colorMap = {
      'PENDING': '#ffc107',
      'CONFIRMED': '#007bff',
      'SHIPPED': '#17a2b8',
      'DELIVERED': '#28a745',
      'CANCELLED': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  }

  // 날짜 포맷팅
  static formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 금액 포맷팅
  static formatAmount(amount) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  }
}

export default OrderService;




