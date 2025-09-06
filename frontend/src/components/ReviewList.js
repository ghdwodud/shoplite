import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import ReviewService from '../services/ReviewService';
import AuthService from '../services/AuthService';
import './ReviewList.css';

const ReviewList = ({ productId, onReviewUpdate }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
        loadReviews();
    }, [productId, currentPage]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const response = await ReviewService.getProductReviews(productId, currentPage, 10);
            
            if (response.success) {
                setReviews(response.data);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            }
        } catch (error) {
            setError(error.message || '리뷰를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
            return;
        }

        try {
            await ReviewService.deleteReview(reviewId);
            loadReviews(); // 리뷰 목록 새로고침
            if (onReviewUpdate) {
                onReviewUpdate(); // 상품 평점 업데이트
            }
        } catch (error) {
            alert(error.message || '리뷰 삭제에 실패했습니다.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className="review-list-loading">리뷰를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="review-list-error">{error}</div>;
    }

    return (
        <div className="review-list">
            <div className="review-list-header">
                <h3>상품 리뷰 ({totalElements}개)</h3>
            </div>

            {reviews.length === 0 ? (
                <div className="no-reviews">
                    <p>아직 작성된 리뷰가 없습니다.</p>
                    <p>첫 번째 리뷰를 작성해보세요!</p>
                </div>
            ) : (
                <>
                    <div className="reviews">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <div className="review-user-info">
                                        <span className="username">{review.username}</span>
                                        <span className="review-date">{formatDate(review.createdAt)}</span>
                                    </div>
                                    <div className="review-actions">
                                        <StarRating rating={review.rating} size="small" />
                                        {currentUser && currentUser.id === review.userId && (
                                            <button
                                                onClick={() => handleDeleteReview(review.id)}
                                                className="delete-btn"
                                                title="리뷰 삭제"
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {review.comment && (
                                    <div className="review-comment">
                                        {review.comment}
                                    </div>
                                )}
                                
                                {review.updatedAt !== review.createdAt && (
                                    <div className="review-updated">
                                        (수정됨: {formatDate(review.updatedAt)})
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="page-btn"
                            >
                                이전
                            </button>
                            
                            <div className="page-numbers">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="page-btn"
                            >
                                다음
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewList;
