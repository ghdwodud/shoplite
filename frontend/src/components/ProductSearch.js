import React, { useEffect, useState } from 'react';
import CategoryService from '../services/CategoryService';
import ProductService from '../services/ProductService';
import './ProductSearch.css';

const ProductSearch = ({ onSearchResults, onLoading }) => {
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        categoryId: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt',
        sortDirection: 'desc'
    });
    const [categories, setCategories] = useState([]);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await CategoryService.getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('카테고리 로딩 실패:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        onLoading(true);
        
        try {
            const params = {};
            if (searchParams.keyword) params.keyword = searchParams.keyword;
            if (searchParams.categoryId) params.categoryId = searchParams.categoryId;
            if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
            if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;
            params.sortBy = searchParams.sortBy;
            params.sortDirection = searchParams.sortDirection;

            const response = await ProductService.searchProducts(params);
            onSearchResults(response.data);
        } catch (error) {
            console.error('검색 실패:', error);
            onSearchResults([]);
        } finally {
            onLoading(false);
        }
    };

    const handleReset = () => {
        setSearchParams({
            keyword: '',
            categoryId: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'createdAt',
            sortDirection: 'desc'
        });
    };

    const priceRanges = [
        { label: '전체', min: '', max: '' },
        { label: '10만원 이하', min: '', max: '100000' },
        { label: '10-50만원', min: '100000', max: '500000' },
        { label: '50-100만원', min: '500000', max: '1000000' },
        { label: '100만원 이상', min: '1000000', max: '' }
    ];

    return (
        <div className="product-search">
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-main">
                    <div className="search-input-group">
                        <input
                            type="text"
                            name="keyword"
                            value={searchParams.keyword}
                            onChange={handleInputChange}
                            placeholder="상품명이나 설명을 입력하세요..."
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            🔍 검색
                        </button>
                    </div>
                    
                    <div className="search-controls">
                        <select
                            name="sortBy"
                            value={searchParams.sortBy}
                            onChange={handleInputChange}
                            className="sort-select"
                        >
                            <option value="createdAt">최신순</option>
                            <option value="name">이름순</option>
                            <option value="price">가격순</option>
                        </select>
                        
                        <select
                            name="sortDirection"
                            value={searchParams.sortDirection}
                            onChange={handleInputChange}
                            className="sort-direction-select"
                        >
                            <option value="desc">내림차순</option>
                            <option value="asc">오름차순</option>
                        </select>
                        
                        <button
                            type="button"
                            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                            className="advanced-toggle"
                        >
                            {isAdvancedOpen ? '간단히' : '상세 검색'}
                        </button>
                    </div>
                </div>

                {isAdvancedOpen && (
                    <div className="search-advanced">
                        <div className="filter-group">
                            <label>카테고리</label>
                            <select
                                name="categoryId"
                                value={searchParams.categoryId}
                                onChange={handleInputChange}
                                className="category-select"
                            >
                                <option value="">전체 카테고리</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>가격 범위</label>
                            <div className="price-range-buttons">
                                {priceRanges.map((range, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setSearchParams(prev => ({
                                            ...prev,
                                            minPrice: range.min,
                                            maxPrice: range.max
                                        }))}
                                        className={`price-range-btn ${
                                            searchParams.minPrice === range.min && 
                                            searchParams.maxPrice === range.max ? 'active' : ''
                                        }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={searchParams.minPrice}
                                    onChange={handleInputChange}
                                    placeholder="최소 가격"
                                    className="price-input"
                                />
                                <span>~</span>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={searchParams.maxPrice}
                                    onChange={handleInputChange}
                                    placeholder="최대 가격"
                                    className="price-input"
                                />
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button type="button" onClick={handleReset} className="reset-button">
                                초기화
                            </button>
                            <button type="submit" className="apply-button">
                                필터 적용
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProductSearch;