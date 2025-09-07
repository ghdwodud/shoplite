import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../services/ProductService';
import CartService from '../services/CartService';
import AuthService from '../services/AuthService';
import ProductReviews from './ProductReviews';
import StarRating from './StarRating';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await ProductService.getProductById(id);
            setProduct(data);
        } catch (error) {
            console.error('Error loading product:', error);
            if (error.response) {
                // 서버에서 응답을 받은 경우
                if (error.response.status === 404) {
                    setError('상품을 찾을 수 없습니다.');
                } else if (error.response.status === 500) {
                    setError('서버 오류가 발생했습니다.');
                } else {
                    setError(`오류가 발생했습니다: ${error.response.status}`);
                }
            } else if (error.request) {
                // 요청은 보냈지만 응답을 받지 못한 경우
                setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
            } else {
                // 요청을 설정하는 중에 오류가 발생한 경우
                setError('요청 처리 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (quantity <= 0 || quantity > product.stockQuantity) {
            alert('올바른 수량을 입력해주세요.');
            return;
        }

        try {
            setAddingToCart(true);
            await CartService.addToCart(currentUser.id, product.id, quantity);
            alert('장바구니에 추가되었습니다.');
        } catch (error) {
            alert('장바구니 추가에 실패했습니다.');
            console.error('Error adding to cart:', error);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 && value <= product.stockQuantity) {
            setQuantity(value);
        }
    };

    if (loading) {
        return <div className="product-detail-loading">상품 정보를 불러오는 중...</div>;
    }

    if (error) {
        return (
            <div className="product-detail-error">
                <p>{error}</p>
                <button onClick={() => navigate('/')} className="btn-back">
                    상품 목록으로 돌아가기
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-error">
                <p>상품을 찾을 수 없습니다.</p>
                <button onClick={() => navigate('/')} className="btn-back">
                    상품 목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="product-detail">
                <div className="product-detail-content">
                    <div className="product-image-section">
                        {product.imageUrl ? (
                            <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="product-detail-image"
                            />
                        ) : (
                            <div className="no-image-placeholder">
                                이미지 없음
                            </div>
                        )}
                    </div>

                    <div className="product-info-section">
                        <h1 className="product-title">{product.name}</h1>
                        
                        <div className="product-rating-section">
                            <StarRating 
                                rating={product.averageRating || 0} 
                                size="medium" 
                                showText={true} 
                            />
                            {product.reviewCount > 0 && (
                                <span className="review-count-detail">
                                    ({product.reviewCount}개 리뷰)
                                </span>
                            )}
                        </div>

                        <div className="product-price-section">
                            <span className="product-price-detail">
                                ₩{product.price?.toLocaleString()}
                            </span>
                        </div>

                        <div className="product-description-section">
                            <h3>상품 설명</h3>
                            <p className="product-description-detail">
                                {product.description || '상품 설명이 없습니다.'}
                            </p>
                        </div>

                        <div className="product-stock-section">
                            <span className="stock-label">재고:</span>
                            <span className={`stock-value ${product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {product.stockQuantity > 0 ? `${product.stockQuantity}개` : '품절'}
                            </span>
                        </div>

                        {product.stockQuantity > 0 && (
                            <div className="purchase-section">
                                <div className="quantity-section">
                                    <label htmlFor="quantity">수량:</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        max={product.stockQuantity}
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="quantity-input"
                                    />
                                </div>

                                <div className="action-buttons">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart || product.stockQuantity === 0}
                                        className="btn-add-to-cart"
                                    >
                                        {addingToCart ? '추가 중...' : '장바구니 담기'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="product-actions">
                            <button onClick={() => navigate('/')} className="btn-back">
                                상품 목록으로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>

                {/* 리뷰 섹션 */}
                <ProductReviews productId={product.id} />
            </div>
        </div>
    );
};

export default ProductDetail;
