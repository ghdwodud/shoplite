import React, { useState, useEffect, useRef } from 'react';
import ReviewSummary from './ReviewSummary';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewService from '../services/ReviewService';
import AuthService from '../services/AuthService';
import './ProductReviews.css';

const ProductReviews = ({ productId }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userReview, setUserReview] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const reviewSummaryRef = useRef();
    const reviewListRef = useRef();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
            loadUserReview();
        } else {
            setLoading(false);
        }
    }, [productId]);

    const loadUserReview = async () => {
        try {
            const response = await ReviewService.getMyProductReview(productId);
            if (response.success && response.data) {
                setUserReview(response.data);
            }
        } catch (error) {
            console.error('Error loading user review:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async () => {
        // 리뷰 작성/수정 후 처리
        setShowReviewForm(false);
        setIsEditingReview(false);
        
        // 사용자 리뷰 새로고침
        await loadUserReview();
        
        // 리뷰 요약과 목록 새로고침
        if (reviewSummaryRef.current?.refresh) {
            reviewSummaryRef.current.refresh();
        }
        if (reviewListRef.current?.refresh) {
            reviewListRef.current.refresh();
        }
    };

    const handleReviewUpdate = () => {
        // 리뷰 목록에서 리뷰가 업데이트된 경우 (삭제 등)
        loadUserReview();
        if (reviewSummaryRef.current?.refresh) {
            reviewSummaryRef.current.refresh();
        }
    };

    const handleWriteReview = () => {
        setIsEditingReview(false);
        setShowReviewForm(true);
    };

    const handleEditReview = () => {
        setIsEditingReview(true);
        setShowReviewForm(true);
    };

    const handleCancelReview = () => {
        setShowReviewForm(false);
        setIsEditingReview(false);
    };

    if (loading) {
        return <div className="product-reviews-loading">리뷰 정보를 불러오는 중...</div>;
    }

    return (
        <div className="product-reviews">
            {/* 리뷰 요약 */}
            <ReviewSummary 
                productId={productId} 
                ref={reviewSummaryRef}
            />

            {/* 사용자 리뷰 작성/수정 영역 */}
            {currentUser && (
                <div className="user-review-section">
                    {!showReviewForm && (
                        <div className="review-action-area">
                            {userReview ? (
                                <div className="existing-review-info">
                                    <h4>내가 작성한 리뷰</h4>
                                    <div className="my-review-preview">
                                        <div className="my-review-rating">
                                            평점: {userReview.rating}점
                                        </div>
                                        {userReview.comment && (
                                            <div className="my-review-comment">
                                                "{userReview.comment}"
                                            </div>
                                        )}
                                        <div className="my-review-date">
                                            작성일: {new Date(userReview.createdAt).toLocaleDateString('ko-KR')}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleEditReview}
                                        className="btn-edit-review"
                                    >
                                        리뷰 수정
                                    </button>
                                </div>
                            ) : (
                                <div className="no-review-info">
                                    <h4>리뷰 작성하기</h4>
                                    <p>이 상품에 대한 솔직한 후기를 남겨주세요.</p>
                                    <button 
                                        onClick={handleWriteReview}
                                        className="btn-write-review"
                                    >
                                        리뷰 작성
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 리뷰 작성/수정 폼 */}
                    {showReviewForm && (
                        <ReviewForm
                            productId={productId}
                            existingReview={isEditingReview ? userReview : null}
                            isEditing={isEditingReview}
                            onSubmit={handleReviewSubmit}
                            onCancel={handleCancelReview}
                        />
                    )}
                </div>
            )}

            {/* 로그인하지 않은 사용자를 위한 안내 */}
            {!currentUser && (
                <div className="login-prompt">
                    <p>리뷰를 작성하려면 <a href="/login">로그인</a>이 필요합니다.</p>
                </div>
            )}

            {/* 리뷰 목록 */}
            <ReviewList 
                productId={productId} 
                onReviewUpdate={handleReviewUpdate}
                ref={reviewListRef}
            />
        </div>
    );
};

export default ProductReviews;

