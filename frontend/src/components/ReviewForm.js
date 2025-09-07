import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import ImageUpload from './ImageUpload';
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
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || '');
            // 기존 리뷰의 이미지가 있다면 설정
            if (existingReview.imageUrls && existingReview.imageUrls.length > 0) {
                const existingImages = existingReview.imageUrls.map(url => ({
                    url: url,
                    preview: url,
                    file: null
                }));
                setImages(existingImages);
            }
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
            
            // 이미지가 있는 경우 고도화된 API 사용
            if (images.length > 0) {
                // 실제 파일이 있는 이미지들만 업로드 (새로 추가된 이미지)
                const newImages = images.filter(img => img.file !== null);
                const existingImageUrls = images.filter(img => img.file === null).map(img => img.url);
                
                // 임시로 base64 URL을 사용 (실제로는 파일 업로드 서비스 필요)
                const imageUrls = [
                    ...existingImageUrls,
                    ...newImages.map(img => img.preview)
                ];
                
                const enhancedReviewData = {
                    reviewRequest: reviewData,
                    imageUrls: imageUrls
                };
                
                if (isEditing && existingReview) {
                    // 기존 API 사용 (이미지 업데이트는 별도 구현 필요)
                    await ReviewService.updateReview(existingReview.id, reviewData);
                } else {
                    await ReviewService.createReviewWithImages(productId, enhancedReviewData);
                }
            } else {
                // 이미지가 없는 경우 기존 API 사용
                if (isEditing && existingReview) {
                    await ReviewService.updateReview(existingReview.id, reviewData);
                } else {
                    await ReviewService.createReview(productId, reviewData);
                }
            }
            
            if (onSubmit) {
                onSubmit();
            }
        } catch (error) {
            console.error('Review submission error:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || '리뷰 저장에 실패했습니다.');
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('리뷰 저장에 실패했습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setRating(existingReview?.rating || 0);
        setComment(existingReview?.comment || '');
        setImages([]);
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

                <ImageUpload
                    images={images}
                    onImagesChange={setImages}
                    maxImages={5}
                />

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
