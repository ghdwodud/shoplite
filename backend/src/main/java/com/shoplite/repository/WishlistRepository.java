package com.shoplite.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.shoplite.model.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    
    // 사용자별 위시리스트 조회
    List<Wishlist> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // 특정 사용자의 특정 상품 위시리스트 조회
    Optional<Wishlist> findByUserIdAndProductId(Long userId, Long productId);
    
    // 특정 사용자의 위시리스트 개수
    long countByUserId(Long userId);
    
    // 특정 상품을 찜한 사용자 수
    long countByProductId(Long productId);
    
    // 사용자가 특정 상품을 찜했는지 확인
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    
    // 사용자별 위시리스트 삭제
    void deleteByUserIdAndProductId(Long userId, Long productId);
    
    // 인기 상품 (많이 찜한 상품) 조회
    @Query("SELECT w.product, COUNT(w) as wishCount FROM Wishlist w " +
           "GROUP BY w.product ORDER BY wishCount DESC")
    List<Object[]> findPopularProducts();
}

