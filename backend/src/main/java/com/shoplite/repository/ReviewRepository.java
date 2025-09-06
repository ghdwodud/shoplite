package com.shoplite.repository;

import com.shoplite.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // 특정 상품의 리뷰 목록 조회 (페이징)
    Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);
    
    // 특정 상품의 리뷰 목록 조회
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    
    // 특정 사용자의 리뷰 목록 조회
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // 특정 사용자가 특정 상품에 작성한 리뷰 조회
    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);
    
    // 특정 상품의 평균 평점 계산
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);
    
    // 특정 상품의 리뷰 개수 조회
    Long countByProductId(Long productId);
    
    // 특정 평점의 리뷰 개수 조회 (상품별)
    Long countByProductIdAndRating(Long productId, Integer rating);
    
    // 특정 상품의 평점별 리뷰 개수 조회
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> findRatingCountsByProductId(@Param("productId") Long productId);
    
    // 사용자가 해당 상품에 리뷰를 작성했는지 확인
    boolean existsByProductIdAndUserId(Long productId, Long userId);
}
