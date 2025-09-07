package com.shoplite.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.shoplite.model.Product;
import com.shoplite.model.User;
import com.shoplite.model.Wishlist;
import com.shoplite.repository.ProductRepository;
import com.shoplite.repository.UserRepository;
import com.shoplite.repository.WishlistRepository;

@Service
@Transactional
public class WishlistService {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    // 위시리스트에 상품 추가
    public Wishlist addToWishlist(Long userId, Long productId) {
        // 이미 위시리스트에 있는지 확인
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("이미 위시리스트에 추가된 상품입니다.");
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        
        Wishlist wishlist = new Wishlist(user, product);
        return wishlistRepository.save(wishlist);
    }
    
    // 위시리스트에서 상품 제거
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }
    
    // 사용자의 위시리스트 조회
    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    // 사용자가 특정 상품을 찜했는지 확인
    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }
    
    // 사용자의 위시리스트 개수
    public long getUserWishlistCount(Long userId) {
        return wishlistRepository.countByUserId(userId);
    }
    
    // 특정 상품을 찜한 사용자 수
    public long getProductWishlistCount(Long productId) {
        return wishlistRepository.countByProductId(productId);
    }
    
    // 위시리스트 토글 (있으면 제거, 없으면 추가)
    public boolean toggleWishlist(Long userId, Long productId) {
        if (isInWishlist(userId, productId)) {
            removeFromWishlist(userId, productId);
            return false; // 제거됨
        } else {
            addToWishlist(userId, productId);
            return true; // 추가됨
        }
    }
    
    // 인기 상품 조회 (많이 찜한 상품)
    public List<Object[]> getPopularProducts() {
        return wishlistRepository.findPopularProducts();
    }
}


