import React from 'react';
import './StarRating.css';

const StarRating = ({ 
    rating = 0, 
    maxRating = 5, 
    size = 'medium', 
    interactive = false, 
    onChange = null,
    showText = false 
}) => {
    const handleStarClick = (starValue) => {
        if (interactive && onChange) {
            onChange(starValue);
        }
    };

    const renderStar = (starValue) => {
        const isFilled = starValue <= rating;
        const isHalfFilled = starValue - 0.5 <= rating && rating < starValue;

        return (
            <span
                key={starValue}
                className={`star ${size} ${interactive ? 'interactive' : ''} ${
                    isFilled ? 'filled' : isHalfFilled ? 'half-filled' : 'empty'
                }`}
                onClick={() => handleStarClick(starValue)}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
                ★
            </span>
        );
    };

    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
        stars.push(renderStar(i));
    }

    return (
        <div className="star-rating">
            <div className="stars">
                {stars}
            </div>
            {showText && (
                <span className="rating-text">
                    {rating > 0 ? `${rating.toFixed(1)}` : '평점 없음'}
                </span>
            )}
        </div>
    );
};

export default StarRating;
