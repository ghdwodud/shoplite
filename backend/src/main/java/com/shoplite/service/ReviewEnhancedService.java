package com.shoplite.service;

import com.shoplite.dto.ReviewDTO;
import com.shoplite.dto.ReviewRequest;
import com.shoplite.dto.ReviewSummaryDTO;
import com.shoplite.model.Review;
import com.shoplite.model.ReviewAction;
import com.shoplite.model.User;
import com.shoplite.model.Product;
import com.shoplite.repository.ReviewRepository;
import com.shoplite.repository.ReviewActionRepository;
import com.shoplite.repository.UserRepository;
import com.shoplite.repository.ProductRepository;
import com.shoplite.repository.OrderRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewEnhancedService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ReviewActionRepository reviewActionRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // 고도화된 리뷰 작성 (이미지 포함)
    public ReviewDTO createReviewWithImages(Long productId, Long userId, ReviewRequest request, List<String> imageUrls) {
        // 기존 리뷰 중복 확인
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new RuntimeException("이미 해당 상품에 리뷰를 작성하셨습니다.");
        }
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Review review = new Review(request.getRating(), request.getComment(), product, user);
        
        // 이미지 URL들을 JSON으로 저장
        if (imageUrls != null && !imageUrls.isEmpty()) {
            try {
                review.setImageUrls(objectMapper.writeValueAsString(imageUrls));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("이미지 URL 저장 중 오류가 발생했습니다.");
            }
        }
        
        // 구매 확인 여부 체크
        review.setIsVerifiedPurchase(checkPurchaseVerification(productId, userId));
        
        Review savedReview = reviewRepository.save(review);
        
        // 상품의 평균 평점과 리뷰 개수 업데이트
        updateProductRating(productId);
        
        return convertToEnhancedDTO(savedReview, userId);
    }
    
    // 리뷰 좋아요
    public ReviewDTO likeReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 이미 좋아요했는지 확인
        if (reviewActionRepository.existsByReviewIdAndUserIdAndActionType(
                reviewId, userId, ReviewAction.ActionType.LIKE)) {
            throw new RuntimeException("이미 좋아요를 누르셨습니다.");
        }
        
        // 좋아요 액션 생성
        ReviewAction likeAction = new ReviewAction(review, user, ReviewAction.ActionType.LIKE);
        reviewActionRepository.save(likeAction);
        
        // 리뷰의 좋아요 수 업데이트
        Long likeCount = reviewActionRepository.countLikesByReviewId(reviewId);
        review.setLikeCount(likeCount.intValue());
        reviewRepository.save(review);
        
        return convertToEnhancedDTO(review, userId);
    }
    
    // 리뷰 좋아요 취소
    public ReviewDTO unlikeReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        // 좋아요 액션 찾기 및 삭제
        ReviewAction likeAction = reviewActionRepository
                .findByReviewIdAndUserIdAndActionType(reviewId, userId, ReviewAction.ActionType.LIKE)
                .orElseThrow(() -> new RuntimeException("좋아요를 누르지 않았습니다."));
        
        reviewActionRepository.delete(likeAction);
        
        // 리뷰의 좋아요 수 업데이트
        Long likeCount = reviewActionRepository.countLikesByReviewId(reviewId);
        review.setLikeCount(likeCount.intValue());
        reviewRepository.save(review);
        
        return convertToEnhancedDTO(review, userId);
    }
    
    // 리뷰 신고
    public void reportReview(Long reviewId, Long userId, String reason) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 이미 신고했는지 확인
        if (reviewActionRepository.existsByReviewIdAndUserIdAndActionType(
                reviewId, userId, ReviewAction.ActionType.REPORT)) {
            throw new RuntimeException("이미 신고하셨습니다.");
        }
        
        // 신고 액션 생성
        ReviewAction reportAction = new ReviewAction(review, user, ReviewAction.ActionType.REPORT, reason);
        reviewActionRepository.save(reportAction);
        
        // 리뷰의 신고 수 업데이트
        Long reportCount = reviewActionRepository.countReportsByReviewId(reviewId);
        review.setReportCount(reportCount.intValue());
        
        // 신고가 5개 이상이면 자동으로 숨김 처리
        if (reportCount >= 5) {
            review.setStatus(Review.ReviewStatus.HIDDEN);
        }
        
        reviewRepository.save(review);
    }
    
    // 고도화된 리뷰 목록 조회 (필터링 + 정렬)
    @Transactional(readOnly = true)
    public Page<ReviewDTO> getFilteredReviews(Long productId, Integer rating, Boolean verifiedOnly, 
                                            Boolean withImages, String sortBy, Pageable pageable, Long currentUserId) {
        Page<Review> reviews = reviewRepository.findByComplexFilter(
                productId, rating, verifiedOnly != null ? verifiedOnly : false, 
                withImages != null ? withImages : false, sortBy != null ? sortBy : "newest", pageable);
        
        return reviews.map(review -> convertToEnhancedDTO(review, currentUserId));
    }
    
    // 구매 확인 여부 체크
    private boolean checkPurchaseVerification(Long productId, Long userId) {
        // 해당 사용자가 이 상품을 실제로 구매했는지 확인
        return orderRepository.existsByUserIdAndOrderItemsProductId(userId, productId);
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
    
    // Review를 고도화된 DTO로 변환
    private ReviewDTO convertToEnhancedDTO(Review review, Long currentUserId) {
        ReviewDTO dto = new ReviewDTO(
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
        
        // 고도화된 필드들 추가
        dto.setLikeCount(review.getLikeCount());
        dto.setReportCount(review.getReportCount());
        dto.setHelpfulnessScore(review.getHelpfulnessScore());
        dto.setVerifiedPurchase(review.getIsVerifiedPurchase());
        dto.setStatus(review.getStatus().name());
        
        // 이미지 URL들 파싱
        if (review.getImageUrls() != null && !review.getImageUrls().isEmpty()) {
            try {
                List<String> imageUrls = objectMapper.readValue(review.getImageUrls(), List.class);
                dto.setImageUrls(imageUrls);
            } catch (JsonProcessingException e) {
                dto.setImageUrls(new ArrayList<>());
            }
        }
        
        // 현재 사용자의 액션 상태
        if (currentUserId != null) {
            dto.setUserLiked(reviewActionRepository.existsByReviewIdAndUserIdAndActionType(
                    review.getId(), currentUserId, ReviewAction.ActionType.LIKE));
            dto.setUserReported(reviewActionRepository.existsByReviewIdAndUserIdAndActionType(
                    review.getId(), currentUserId, ReviewAction.ActionType.REPORT));
        }
        
        return dto;
    }
}



