import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CartService from '../services/CartService';
import WishlistService from '../services/WishlistService';
import './Wishlist.css';
import WishlistButton from './WishlistButton';

const Wishlist = ({ user }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await WishlistService.getUserWishlist(user.id);
            setWishlistItems(response.data);
            setError(null);
        } catch (err) {
            setError('위시리스트를 불러오는데 실패했습니다.');
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWishlistChange = (productId, isAdded) => {
        if (!isAdded) {
            // 위시리스트에서 제거된 경우, 목록에서 해당 아이템 제거
            setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
        }
    };

    const handleAddToCart = async (product) => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            await CartService.addToCart({
                userId: user.id,
                productId: product.id,
                quantity: 1
            });
            alert('장바구니에 추가되었습니다!');
        } catch (error) {
            console.error('장바구니 추가 실패:', error);
            alert('장바구니 추가 중 오류가 발생했습니다.');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!user) {
        return (
            <div className="wishlist-container">
                <div className="wishlist-empty">
                    <h2>로그인이 필요합니다</h2>
                    <p>위시리스트를 확인하려면 로그인해주세요.</p>
                    <Link to="/login" className="login-link">
                        로그인하기
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="wishlist-container">
                <div className="wishlist-loading">
                    <div className="loading-spinner"></div>
                    <p>위시리스트를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wishlist-container">
                <div className="wishlist-error">
                    <h2>오류가 발생했습니다</h2>
                    <p>{error}</p>
                    <button onClick={fetchWishlist} className="retry-button">
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h1>내 위시리스트</h1>
                <p className="wishlist-count">
                    총 {wishlistItems.length}개의 상품
                </p>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="wishlist-empty">
                    <div className="empty-icon">🤍</div>
                    <h2>위시리스트가 비어있습니다</h2>
                    <p>마음에 드는 상품을 찜해보세요!</p>
                    <Link to="/" className="shop-link">
                        쇼핑하러 가기
                    </Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="wishlist-item">
                            <div className="item-image">
                                <Link to={`/product/${item.product.id}`}>
                                    <img 
                                        src={item.product.imageUrl || '/images/no-image.png'} 
                                        alt={item.product.name}
                                        onError={(e) => {
                                            e.target.src = '/images/no-image.png';
                                        }}
                                    />
                                </Link>
                                <WishlistButton
                                    user={user}
                                    productId={item.product.id}
                                    onWishlistChange={(isAdded) => handleWishlistChange(item.product.id, isAdded)}
                                />
                            </div>
                            
                            <div className="item-info">
                                <Link to={`/product/${item.product.id}`} className="item-name">
                                    {item.product.name}
                                </Link>
                                <p className="item-description">
                                    {item.product.description}
                                </p>
                                <div className="item-price">
                                    {formatPrice(item.product.price)}원
                                </div>
                                <div className="item-meta">
                                    <span className="added-date">
                                        {formatDate(item.createdAt)} 추가
                                    </span>
                                    <span className="stock-status">
                                        {item.product.stockQuantity > 0 ? 
                                            `재고 ${item.product.stockQuantity}개` : 
                                            '품절'
                                        }
                                    </span>
                                </div>
                                
                                <div className="item-actions">
                                    <button
                                        onClick={() => handleAddToCart(item.product)}
                                        className="add-to-cart-btn"
                                        disabled={item.product.stockQuantity === 0}
                                    >
                                        {item.product.stockQuantity > 0 ? '장바구니 담기' : '품절'}
                                    </button>
                                    <Link 
                                        to={`/product/${item.product.id}`}
                                        className="view-detail-btn"
                                    >
                                        상세보기
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;


