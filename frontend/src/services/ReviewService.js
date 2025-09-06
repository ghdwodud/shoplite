import ApiClient from './ApiClient';

class ReviewService {
    // 리뷰 작성
    async createReview(productId, reviewData) {
        try {
            const response = await ApiClient.post(`/reviews/products/${productId}`, reviewData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: '리뷰 작성에 실패했습니다.' };
        }
    }

    // 리뷰 수정
    async updateReview(reviewId, reviewData) {
        try {
            const response = await ApiClient.put(`/reviews/${reviewId}`, reviewData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: '리뷰 수정에 실패했습니다.' };
        }
    }

    // 리뷰 삭제
    async deleteReview(reviewId) {
        try {
            const response = await ApiClient.delete(`/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: '리뷰 삭제에 실패했습니다.' };
        }
    }

    // 상품 리뷰 목록 조회
    async getProductReviews(productId, page = 0, size = 10) {
        try {
            const response = await ApiClient.get(`/reviews/products/${productId}`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: '리뷰 목록 조회에 실패했습니다.' };
        }
    }

    // 상품 리뷰 요약 조회
    async getProductReviewSummary(productId) {
        try {
            const response = await ApiClient.get(`/reviews/products/${productId}/summary`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: '리뷰 요약 조회에 실패했습니다.' };
        }
    }

    // 내 리뷰 목록 조회
    async getMyReviews() {
        try {
            const response = await ApiClient.get('/reviews/users/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: '내 리뷰 목록 조회에 실패했습니다.' };
        }
    }

    // 내 상품 리뷰 조회
    async getMyProductReview(productId) {
        try {
            const response = await ApiClient.get(`/reviews/products/${productId}/my-review`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: '내 리뷰 조회에 실패했습니다.' };
        }
    }
}

export default new ReviewService();
