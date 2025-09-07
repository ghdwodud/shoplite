package com.shoplite.dto;

import java.time.LocalDateTime;
import com.shoplite.model.Wishlist;

public class WishlistDTO {
    private Long id;
    private Long userId;
    private ProductDTO product;
    private LocalDateTime createdAt;
    
    // 기본 생성자
    public WishlistDTO() {}
    
    // Wishlist 엔티티로부터 생성하는 생성자
    public WishlistDTO(Wishlist wishlist) {
        this.id = wishlist.getId();
        this.userId = wishlist.getUser().getId();
        this.product = new ProductDTO(wishlist.getProduct());
        this.createdAt = wishlist.getCreatedAt();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public ProductDTO getProduct() {
        return product;
    }
    
    public void setProduct(ProductDTO product) {
        this.product = product;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


