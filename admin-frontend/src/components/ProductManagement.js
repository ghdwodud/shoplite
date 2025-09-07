import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../services/ProductService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('상품을 불러오는데 실패했습니다.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
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

  const handleStockUpdate = async (id, newStock) => {
    try {
      const product = products.find(p => p.id === id);
      if (product) {
        const updatedProduct = { ...product, stockQuantity: newStock };
        await ProductService.updateProduct(id, updatedProduct);
        setProducts(products.map(p => p.id === id ? updatedProduct : p));
      }
    } catch (err) {
      setError('재고 수정에 실패했습니다.');
      console.error('Error updating stock:', err);
    }
  };

  if (loading) {
    return <div className="loading">상품을 불러오는 중...</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>상품 관리</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="content-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="상품명 또는 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/products/add" className="btn btn-primary">
            새 상품 추가
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이미지</th>
                <th>상품명</th>
                <th>가격</th>
                <th>재고</th>
                <th>설명</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        📦
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>₩{product.price?.toLocaleString()}</td>
                  <td>
                    <input
                      type="number"
                      value={product.stockQuantity || 0}
                      onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                      style={{ width: '80px', padding: '4px', border: '1px solid #ced4da', borderRadius: '4px' }}
                      min="0"
                    />
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.description}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <Link to={`/products/edit/${product.id}`} className="btn btn-warning" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        수정
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-danger"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 상품이 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;



