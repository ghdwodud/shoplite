import React, { useEffect, useState } from 'react';
import WishlistService from '../services/WishlistService';
import './WishlistButton.css';

const WishlistButton = ({ user, productId, onWishlistChange }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && productId) {
            checkWishlistStatus();
        }
    }, [user, productId]);

    const checkWishlistStatus = async () => {
        try {
            const response = await WishlistService.checkWishlistStatus(user.id, productId);
            setIsInWishlist(response.data.isInWishlist);
        } catch (error) {
            console.error('위시리스트 상태 확인 실패:', error);
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        setLoading(true);
        try {
            const response = await WishlistService.toggleWishlist(user.id, productId);
            setIsInWishlist(response.data.added);
            
            if (onWishlistChange) {
                onWishlistChange(response.data.added);
            }
            
            // 성공 메시지 표시
            const message = response.data.added ? '위시리스트에 추가되었습니다!' : '위시리스트에서 제거되었습니다.';
            // 간단한 토스트 메시지 (나중에 토스트 컴포넌트로 교체 가능)
            showToast(message);
        } catch (error) {
            console.error('위시리스트 토글 실패:', error);
            alert('위시리스트 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message) => {
        // 간단한 토스트 메시지 구현
        const toast = document.createElement('div');
        toast.className = 'wishlist-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    };

    if (!user) {
        return null; // 로그인하지 않은 사용자에게는 표시하지 않음
    }

    return (
        <button
            className={`wishlist-button ${isInWishlist ? 'active' : ''} ${loading ? 'loading' : ''}`}
            onClick={handleToggleWishlist}
            disabled={loading}
            title={isInWishlist ? '위시리스트에서 제거' : '위시리스트에 추가'}
        >
            <span className="heart-icon">
                {isInWishlist ? '❤️' : '🤍'}
            </span>
            <span className="wishlist-text">
                {loading ? '처리중...' : (isInWishlist ? '찜 해제' : '찜하기')}
            </span>
        </button>
    );
};

export default WishlistButton;


