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
    
    // 필터링 및 정렬 상태
    const [filters, setFilters] = useState({
        rating: null,
        verifiedOnly: false,
        withImages: false,
        sortBy: 'newest'
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
        loadReviews();
    }, [productId, currentPage, filters]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            // 필터가 적용된 경우 고도화된 API 사용
            const hasFilters = filters.rating || filters.verifiedOnly || filters.withImages || filters.sortBy !== 'newest';
            
            let response;
            if (hasFilters) {
                response = await ReviewService.getFilteredReviews(productId, filters, currentPage, 10);
            } else {
                response = await ReviewService.getProductReviews(productId, currentPage, 10);
            }
            
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

    // 좋아요 처리
    const handleLikeReview = async (reviewId, isLiked) => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            if (isLiked) {
                await ReviewService.unlikeReview(reviewId);
            } else {
                await ReviewService.likeReview(reviewId);
            }
            loadReviews(); // 리뷰 목록 새로고침
        } catch (error) {
            alert(error.message || '처리에 실패했습니다.');
        }
    };

    // 신고 처리
    const handleReportReview = async (reviewId) => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        const reason = prompt('신고 사유를 입력해주세요:');
        if (!reason) return;

        try {
            await ReviewService.reportReview(reviewId, reason);
            alert('신고가 접수되었습니다.');
            loadReviews(); // 리뷰 목록 새로고침
        } catch (error) {
            alert(error.message || '신고 처리에 실패했습니다.');
        }
    };

    // 필터 변경 처리
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(0); // 필터 변경 시 첫 페이지로
    };

    // 필터 초기화
    const resetFilters = () => {
        setFilters({
            rating: null,
            verifiedOnly: false,
            withImages: false,
            sortBy: 'newest'
        });
        setCurrentPage(0);
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
                <button 
                    className="filter-toggle-btn"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? '필터 숨기기' : '필터 보기'} 🔍
                </button>
            </div>

            {/* 필터링 UI */}
            {showFilters && (
                <div className="review-filters">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>평점 필터:</label>
                            <select 
                                value={filters.rating || ''} 
                                onChange={(e) => handleFilterChange('rating', e.target.value ? parseInt(e.target.value) : null)}
                            >
                                <option value="">전체</option>
                                <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
                                <option value="4">⭐⭐⭐⭐ (4점)</option>
                                <option value="3">⭐⭐⭐ (3점)</option>
                                <option value="2">⭐⭐ (2점)</option>
                                <option value="1">⭐ (1점)</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>정렬:</label>
                            <select 
                                value={filters.sortBy} 
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            >
                                <option value="newest">최신순</option>
                                <option value="oldest">오래된순</option>
                                <option value="helpful">도움순</option>
                                <option value="rating_desc">평점 높은순</option>
                                <option value="rating_asc">평점 낮은순</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-row">
                        <div className="filter-checkboxes">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={filters.verifiedOnly}
                                    onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                                />
                                구매확인 리뷰만
                            </label>
                            
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={filters.withImages}
                                    onChange={(e) => handleFilterChange('withImages', e.target.checked)}
                                />
                                사진 리뷰만
                            </label>
                        </div>

                        <button className="reset-filters-btn" onClick={resetFilters}>
                            필터 초기화
                        </button>
                    </div>
                </div>
            )}

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
                                        <span className="username">
                                            {review.username}
                                            {review.verifiedPurchase && (
                                                <span className="verified-badge" title="구매확인">✓</span>
                                            )}
                                        </span>
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

                                {/* 리뷰 이미지 표시 */}
                                {review.imageUrls && review.imageUrls.length > 0 && (
                                    <div className="review-images">
                                        {review.imageUrls.map((imageUrl, index) => (
                                            <img
                                                key={index}
                                                src={imageUrl}
                                                alt={`리뷰 이미지 ${index + 1}`}
                                                className="review-image"
                                                onClick={() => window.open(imageUrl, '_blank')}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* 좋아요/신고 버튼 */}
                                <div className="review-interactions">
                                    <div className="interaction-buttons">
                                        <button
                                            className={`like-btn ${review.userLiked ? 'liked' : ''}`}
                                            onClick={() => handleLikeReview(review.id, review.userLiked)}
                                            disabled={!currentUser}
                                        >
                                            👍 {review.likeCount || 0}
                                        </button>
                                        
                                        {currentUser && currentUser.id !== review.userId && (
                                            <button
                                                className={`report-btn ${review.userReported ? 'reported' : ''}`}
                                                onClick={() => handleReportReview(review.id)}
                                                disabled={review.userReported}
                                            >
                                                🚨 {review.userReported ? '신고됨' : '신고'}
                                            </button>
                                        )}
                                    </div>
                                    
                                    {review.helpfulnessScore > 0 && (
                                        <div className="helpfulness-score">
                                            도움이 됨: +{review.helpfulnessScore}
                                        </div>
                                    )}
                                </div>
                                
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
