import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import ReviewService from '../services/ReviewService';
import './ReviewForm.css';

const ReviewForm = ({ 
    productId, 
    existingReview = null, 
    onSubmit, 
    onCancel,
    isEditing = false 
}) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || '');
        }
    }, [existingReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            setError('평점을 선택해주세요.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const reviewData = { rating, comment };
            
            if (isEditing && existingReview) {
                await ReviewService.updateReview(existingReview.id, reviewData);
            } else {
                await ReviewService.createReview(productId, reviewData);
            }
            
            if (onSubmit) {
                onSubmit();
            }
        } catch (error) {
            setError(error.message || '리뷰 저장에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setRating(existingReview?.rating || 0);
        setComment(existingReview?.comment || '');
        setError('');
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="review-form">
            <h3>{isEditing ? '리뷰 수정' : '리뷰 작성'}</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>평점 *</label>
                    <StarRating
                        rating={rating}
                        interactive={true}
                        onChange={setRating}
                        size="large"
                    />
                    {rating > 0 && (
                        <span className="rating-text">{rating}점</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="comment">리뷰 내용</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="상품에 대한 솔직한 후기를 남겨주세요."
                        rows="4"
                        maxLength="500"
                    />
                    <div className="character-count">
                        {comment.length}/500
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancel"
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={isSubmitting || rating === 0}
                    >
                        {isSubmitting ? '저장 중...' : (isEditing ? '수정' : '등록')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
