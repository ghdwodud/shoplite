import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import ReviewService from '../services/ReviewService';
import './ReviewSummary.css';

const ReviewSummary = ({ productId, onSummaryLoad }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSummary();
    }, [productId]);

    const loadSummary = async () => {
        try {
            setLoading(true);
            const response = await ReviewService.getProductReviewSummary(productId);
            
            if (response.success) {
                setSummary(response.data);
                if (onSummaryLoad) {
                    onSummaryLoad(response.data);
                }
            }
        } catch (error) {
            setError(error.message || '리뷰 요약을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 외부에서 호출할 수 있도록 함수 노출
    React.useImperativeHandle(onSummaryLoad, () => ({
        refresh: loadSummary
    }));

    const getRatingPercentage = (rating) => {
        if (!summary || summary.totalReviews === 0) return 0;
        const count = summary.ratingCounts[rating] || 0;
        return Math.round((count / summary.totalReviews) * 100);
    };

    if (loading) {
        return <div className="review-summary-loading">평점 정보를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="review-summary-error">{error}</div>;
    }

    if (!summary || summary.totalReviews === 0) {
        return (
            <div className="review-summary">
                <div className="no-reviews-summary">
                    <h3>아직 리뷰가 없습니다</h3>
                    <p>첫 번째 리뷰를 작성해보세요!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="review-summary">
            <div className="summary-header">
                <h3>고객 리뷰</h3>
            </div>
            
            <div className="summary-content">
                <div className="overall-rating">
                    <div className="rating-score">
                        <span className="score-number">{summary.averageRating.toFixed(1)}</span>
                        <StarRating rating={summary.averageRating} size="large" showText={false} />
                    </div>
                    <div className="rating-info">
                        <span className="total-reviews">{summary.totalReviews}개의 리뷰</span>
                    </div>
                </div>
                
                <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="rating-row">
                            <div className="rating-label">
                                <span>{rating}점</span>
                                <StarRating rating={rating} size="small" />
                            </div>
                            <div className="rating-bar">
                                <div 
                                    className="rating-fill"
                                    style={{ width: `${getRatingPercentage(rating)}%` }}
                                ></div>
                            </div>
                            <div className="rating-count">
                                <span>{summary.ratingCounts[rating] || 0}</span>
                                <span className="percentage">({getRatingPercentage(rating)}%)</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewSummary;
