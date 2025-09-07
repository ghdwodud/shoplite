import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../services/ProductService';
import CartService from '../services/CartService';
import ProductSearch from './ProductSearch';
import StarRating from './StarRating';

const ProductList = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (searchFilters = null) => {
    try {
      setLoading(true);
      let data;
      
      if (searchFilters && (searchFilters.keyword || searchFilters.categoryId || searchFilters.minPrice || searchFilters.maxPrice)) {
        // 검색 필터가 있으면 검색 API 사용
        setIsSearching(true);
        data = await ProductService.searchProducts(searchFilters);
      } else {
        // 필터가 없으면 전체 상품 조회
        setIsSearching(false);
        data = await ProductService.getAllProducts();
      }
      
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('상품을 불러오는데 실패했습니다.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchFilters) => {
    fetchProducts(searchFilters);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await ProductService.deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('상품 삭제에 실패했습니다.');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await CartService.addToCart(user.id, productId, 1);
      alert('장바구니에 추가되었습니다.');
    } catch (err) {
      setError('장바구니 추가에 실패했습니다.');
      console.error('Error adding to cart:', err);
    }
  };

  if (loading) {
    return <div className="loading">상품을 불러오는 중...</div>;
  }

  return (
    <div className="container">
      <h1>상품 목록</h1>
      
      {/* 검색 및 필터 컴포넌트 */}
      <ProductSearch 
        onSearch={handleSearch}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      
      {error && <div className="error">{error}</div>}
      
      {/* 검색 결과 정보 */}
      {isSearching && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          color: '#1976d2'
        }}>
          🔍 검색 결과: {products.length}개의 상품을 찾았습니다.
        </div>
      )}
      
      {products.length === 0 ? (
        <div className="loading">등록된 상품이 없습니다.</div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="product-image"
                />
              )}
              <div className="product-info">
                <Link to={`/product/${product.id}`} className="product-name-link">
                  <h3 className="product-name">{product.name}</h3>
                </Link>
                <p className="product-description">{product.description}</p>
                <div className="product-price">₩{product.price?.toLocaleString()}</div>
                <div className="product-rating">
                  <StarRating 
                    rating={product.averageRating || 0} 
                    size="small" 
                    showText={true} 
                  />
                  {product.reviewCount > 0 && (
                    <span className="review-count">({product.reviewCount}개 리뷰)</span>
                  )}
                </div>
                <div className="product-stock">
                  재고: {product.stockQuantity}개
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                  >
                    장바구니 담기
                  </button>
                  {user && user.role === 'ADMIN' && (
                    <>
                      <Link to={`/edit/${product.id}`} className="btn-edit">
                        수정
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="btn-delete"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
