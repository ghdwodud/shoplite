package com.shoplite.service;

import com.shoplite.model.Product;
import com.shoplite.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return product.get();
        }
        throw new RuntimeException("상품을 찾을 수 없습니다. ID: " + id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setStockQuantity(productDetails.getStockQuantity());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> getProductsByPriceRange(Double minPrice, Double maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Product> searchProducts(String keyword, Long categoryId, Double minPrice, Double maxPrice, String sortBy, String sortDirection) {
        // 정렬 방향 설정
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        
        // 유효한 정렬 필드인지 확인하고 기본값 설정
        String validSortBy;
        switch (sortBy) {
            case "name":
            case "price":
                validSortBy = sortBy;
                break;
            case "createdAt":
            default:
                validSortBy = "id"; // createdAt 대신 id 사용 (더 안전)
                break;
        }
        
        Sort sort = Sort.by(direction, validSortBy);
        
        // 모든 상품을 가져온 후 필터링 (간단한 구현)
        List<Product> allProducts = productRepository.findAll(sort);
        
        return allProducts.stream()
                .filter(product -> {
                    // 키워드 필터링
                    if (keyword != null && !keyword.trim().isEmpty()) {
                        String lowerKeyword = keyword.toLowerCase();
                        boolean matchesName = product.getName().toLowerCase().contains(lowerKeyword);
                        boolean matchesDescription = product.getDescription().toLowerCase().contains(lowerKeyword);
                        if (!matchesName && !matchesDescription) {
                            return false;
                        }
                    }
                    
                    // 카테고리 필터링
                    if (categoryId != null) {
                        if (product.getCategory() == null || !product.getCategory().getId().equals(categoryId)) {
                            return false;
                        }
                    }
                    
                    // 가격 범위 필터링
                    if (minPrice != null && product.getPrice() < minPrice) {
                        return false;
                    }
                    if (maxPrice != null && product.getPrice() > maxPrice) {
                        return false;
                    }
                    
                    // 활성화된 상품만
                    return product.getIsActive() == null || product.getIsActive();
                })
                .collect(Collectors.toList());
    }
}
