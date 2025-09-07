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

    // 활성 상태의 리뷰만 조회 (페이징)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.status = 'ACTIVE' ORDER BY r.createdAt DESC")
    Page<Review> findActiveReviewsByProductId(@Param("productId") Long productId, Pageable pageable);

    // 평점별 필터링 (페이징)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.rating = :rating AND r.status = 'ACTIVE' ORDER BY r.createdAt DESC")
    Page<Review> findByProductIdAndRatingAndStatusActive(@Param("productId") Long productId,
            @Param("rating") Integer rating, Pageable pageable);

    // 구매 확인 리뷰만 조회 (페이징)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.isVerifiedPurchase = true AND r.status = 'ACTIVE' ORDER BY r.createdAt DESC")
    Page<Review> findVerifiedReviewsByProductId(@Param("productId") Long productId, Pageable pageable);

    // 이미지가 있는 리뷰만 조회 (페이징)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.imageUrls IS NOT NULL AND r.imageUrls != '' AND r.status = 'ACTIVE' ORDER BY r.createdAt DESC")
    Page<Review> findReviewsWithImagesByProductId(@Param("productId") Long productId, Pageable pageable);

    // 도움이 된 순으로 정렬 (페이징)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.status = 'ACTIVE' ORDER BY r.helpfulnessScore DESC, r.createdAt DESC")
    Page<Review> findByProductIdOrderByHelpfulnessScore(@Param("productId") Long productId, Pageable pageable);

    // 최신순 정렬 (페이징)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.status = 'ACTIVE' ORDER BY r.createdAt DESC")
    Page<Review> findByProductIdOrderByNewest(@Param("productId") Long productId, Pageable pageable);

    // 오래된 순 정렬 (페이징)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.status = 'ACTIVE' ORDER BY r.createdAt ASC")
    Page<Review> findByProductIdOrderByOldest(@Param("productId") Long productId, Pageable pageable);

    // 평점 높은 순 정렬 (페이징)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.status = 'ACTIVE' ORDER BY r.rating DESC, r.createdAt DESC")
    Page<Review> findByProductIdOrderByRatingDesc(@Param("productId") Long productId, Pageable pageable);

    // 평점 낮은 순 정렬 (페이징)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.status = 'ACTIVE' ORDER BY r.rating ASC, r.createdAt DESC")
    Page<Review> findByProductIdOrderByRatingAsc(@Param("productId") Long productId, Pageable pageable);

    // 복합 필터링 (평점 + 구매확인 + 이미지)
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId " +
            "AND (:rating IS NULL OR r.rating = :rating) " +
            "AND (:verifiedOnly = false OR r.isVerifiedPurchase = true) " +
            "AND (:withImages = false OR (r.imageUrls IS NOT NULL AND r.imageUrls != '')) " +
            "AND r.status = 'ACTIVE' " +
            "ORDER BY " +
            "CASE WHEN :sortBy = 'helpful' THEN r.helpfulnessScore END DESC, " +
            "CASE WHEN :sortBy = 'newest' THEN r.createdAt END DESC, " +
            "CASE WHEN :sortBy = 'oldest' THEN r.createdAt END ASC, " +
            "CASE WHEN :sortBy = 'rating_desc' THEN r.rating END DESC, " +
            "CASE WHEN :sortBy = 'rating_asc' THEN r.rating END ASC, " +
            "r.createdAt DESC")
    Page<Review> findByComplexFilter(@Param("productId") Long productId,
            @Param("rating") Integer rating,
            @Param("verifiedOnly") Boolean verifiedOnly,
            @Param("withImages") Boolean withImages,
            @Param("sortBy") String sortBy,
            Pageable pageable);
}
