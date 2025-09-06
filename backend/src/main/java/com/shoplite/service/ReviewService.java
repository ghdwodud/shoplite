package com.shoplite.service;

import com.shoplite.dto.ReviewDTO;
import com.shoplite.dto.ReviewRequest;
import com.shoplite.dto.ReviewSummaryDTO;
import com.shoplite.model.Product;
import com.shoplite.model.Review;
import com.shoplite.model.User;
import com.shoplite.repository.ProductRepository;
import com.shoplite.repository.ReviewRepository;
import com.shoplite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // 리뷰 작성
    public ReviewDTO createReview(Long productId, Long userId, ReviewRequest request) {
        // 이미 리뷰를 작성했는지 확인
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new RuntimeException("이미 해당 상품에 리뷰를 작성하셨습니다.");
        }
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Review review = new Review(request.getRating(), request.getComment(), product, user);
        Review savedReview = reviewRepository.save(review);
        
        // 상품의 평균 평점과 리뷰 개수 업데이트
        updateProductRating(productId);
        
        return convertToDTO(savedReview);
    }
    
    // 리뷰 수정
    public ReviewDTO updateReview(Long reviewId, Long userId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        // 작성자 확인
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("리뷰 수정 권한이 없습니다.");
        }
        
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        Review updatedReview = reviewRepository.save(review);
        
        // 상품의 평균 평점 업데이트
        updateProductRating(review.getProduct().getId());
        
        return convertToDTO(updatedReview);
    }
    
    // 리뷰 삭제
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        // 작성자 확인
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("리뷰 삭제 권한이 없습니다.");
        }
        
        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);
        
        // 상품의 평균 평점과 리뷰 개수 업데이트
        updateProductRating(productId);
    }
    
    // 특정 상품의 리뷰 목록 조회 (페이징)
    @Transactional(readOnly = true)
    public Page<ReviewDTO> getProductReviews(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        return reviews.map(this::convertToDTO);
    }
    
    // 특정 사용자의 리뷰 목록 조회
    @Transactional(readOnly = true)
    public List<ReviewDTO> getUserReviews(Long userId) {
        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviews.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    // 특정 상품의 리뷰 요약 정보 조회
    @Transactional(readOnly = true)
    public ReviewSummaryDTO getProductReviewSummary(Long productId) {
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.countByProductId(productId);
        
        // 평점별 리뷰 개수 조회
        List<Object[]> ratingCountsResult = reviewRepository.findRatingCountsByProductId(productId);
        Map<Integer, Long> ratingCounts = new HashMap<>();
        
        // 1-5점까지 초기화
        for (int i = 1; i <= 5; i++) {
            ratingCounts.put(i, 0L);
        }
        
        // 실제 데이터로 업데이트
        for (Object[] result : ratingCountsResult) {
            Integer rating = (Integer) result[0];
            Long count = (Long) result[1];
            ratingCounts.put(rating, count);
        }
        
        return new ReviewSummaryDTO(
                averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0,
                totalReviews,
                ratingCounts
        );
    }
    
    // 사용자가 특정 상품에 리뷰를 작성했는지 확인
    @Transactional(readOnly = true)
    public boolean hasUserReviewedProduct(Long productId, Long userId) {
        return reviewRepository.existsByProductIdAndUserId(productId, userId);
    }
    
    // 사용자의 특정 상품 리뷰 조회
    @Transactional(readOnly = true)
    public ReviewDTO getUserProductReview(Long productId, Long userId) {
        return reviewRepository.findByProductIdAndUserId(productId, userId)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    // 상품의 평균 평점과 리뷰 개수 업데이트
    private void updateProductRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        Long reviewCount = reviewRepository.countByProductId(productId);
        
        product.setAverageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);
        product.setReviewCount(reviewCount.intValue());
        
        productRepository.save(product);
    }
    
    // Review 엔티티를 ReviewDTO로 변환
    private ReviewDTO convertToDTO(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getProduct().getId(),
                review.getProduct().getName(),
                review.getUser().getId(),
                review.getUser().getUsername(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
