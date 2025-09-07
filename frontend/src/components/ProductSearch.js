import React, { useState, useEffect } from 'react';
import CategoryService from '../services/CategoryService';

const ProductSearch = ({ onSearch, filters, onFiltersChange }) => {
  const [categories, setCategories] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    keyword: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortDirection: 'desc',
    ...filters
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await CategoryService.getActiveCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = () => {
    onSearch(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortDirection: 'desc'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onSearch(resetFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="product-search" style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* 검색바 */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="상품명이나 설명으로 검색..."
            value={localFilters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <button 
            onClick={handleSearch}
            className="btn btn-primary"
            style={{ padding: '10px 20px' }}
          >
            🔍 검색
          </button>
        </div>
      </div>

      {/* 필터 옵션들 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '15px'
      }}>
        {/* 카테고리 필터 */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            카테고리
          </label>
          <select
            value={localFilters.categoryId}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="">전체 카테고리</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 가격 범위 */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            최소 가격
          </label>
          <input
            type="number"
            placeholder="0"
            value={localFilters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            최대 가격
          </label>
          <input
            type="number"
            placeholder="무제한"
            value={localFilters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        {/* 정렬 옵션 */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            정렬 기준
          </label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="createdAt">등록일순</option>
            <option value="name">상품명순</option>
            <option value="price">가격순</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            정렬 방향
          </label>
          <select
            value={localFilters.sortDirection}
            onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="desc">내림차순</option>
            <option value="asc">오름차순</option>
          </select>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleReset}
          className="btn btn-secondary"
          style={{ padding: '8px 16px' }}
        >
          🔄 초기화
        </button>
        <button 
          onClick={handleSearch}
          className="btn btn-primary"
          style={{ padding: '8px 16px' }}
        >
          ✨ 필터 적용
        </button>
      </div>

      {/* 현재 필터 상태 표시 */}
      {(localFilters.keyword || localFilters.categoryId || localFilters.minPrice || localFilters.maxPrice) && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>현재 필터:</strong>
          {localFilters.keyword && <span style={{ marginLeft: '10px' }}>키워드: "{localFilters.keyword}"</span>}
          {localFilters.categoryId && (
            <span style={{ marginLeft: '10px' }}>
              카테고리: {categories.find(c => c.id.toString() === localFilters.categoryId)?.name}
            </span>
          )}
          {localFilters.minPrice && <span style={{ marginLeft: '10px' }}>최소: ₩{Number(localFilters.minPrice).toLocaleString()}</span>}
          {localFilters.maxPrice && <span style={{ marginLeft: '10px' }}>최대: ₩{Number(localFilters.maxPrice).toLocaleString()}</span>}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;



