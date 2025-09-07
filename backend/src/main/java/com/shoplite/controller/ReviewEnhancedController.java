package com.shoplite.controller;

import com.shoplite.dto.ReviewDTO;
import com.shoplite.dto.ReviewRequest;
import com.shoplite.security.JwtAuthenticationFilter;
import com.shoplite.service.ReviewEnhancedService;
import com.shoplite.service.UserService;
import com.shoplite.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/reviews/enhanced")
@Tag(name = "Review Enhanced", description = "고도화된 리뷰 관리 API")
@CrossOrigin(origins = "*")
public class ReviewEnhancedController {
    
    @Autowired
    private ReviewEnhancedService reviewEnhancedService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/products/{productId}")
    @Operation(summary = "이미지 포함 리뷰 작성", description = "이미지를 포함한 리뷰를 작성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "리뷰 작성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    public ResponseEntity<?> createReviewWithImages(
            @Parameter(description = "상품 ID") @PathVariable Long productId,
            @Valid @RequestBody ReviewWithImagesRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            ReviewDTO review = reviewEnhancedService.createReviewWithImages(
                    productId, userId, request.getReviewRequest(), request.getImageUrls());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "리뷰가 성공적으로 작성되었습니다.");
            response.put("data", review);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/{reviewId}/like")
    @Operation(summary = "리뷰 좋아요", description = "리뷰에 좋아요를 누릅니다.")
    public ResponseEntity<?> likeReview(
            @Parameter(description = "리뷰 ID") @PathVariable Long reviewId,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            ReviewDTO review = reviewEnhancedService.likeReview(reviewId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "좋아요를 눌렀습니다.");
            response.put("data", review);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{reviewId}/like")
    @Operation(summary = "리뷰 좋아요 취소", description = "리뷰 좋아요를 취소합니다.")
    public ResponseEntity<?> unlikeReview(
            @Parameter(description = "리뷰 ID") @PathVariable Long reviewId,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            ReviewDTO review = reviewEnhancedService.unlikeReview(reviewId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "좋아요를 취소했습니다.");
            response.put("data", review);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/{reviewId}/report")
    @Operation(summary = "리뷰 신고", description = "부적절한 리뷰를 신고합니다.")
    public ResponseEntity<?> reportReview(
            @Parameter(description = "리뷰 ID") @PathVariable Long reviewId,
            @RequestBody ReportRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            reviewEnhancedService.reportReview(reviewId, userId, request.getReason());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "신고가 접수되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/products/{productId}/filtered")
    @Operation(summary = "고급 필터링 리뷰 조회", description = "다양한 필터와 정렬로 리뷰를 조회합니다.")
    public ResponseEntity<?> getFilteredReviews(
            @Parameter(description = "상품 ID") @PathVariable Long productId,
            @Parameter(description = "평점 필터") @RequestParam(required = false) Integer rating,
            @Parameter(description = "구매확인 리뷰만") @RequestParam(required = false) Boolean verifiedOnly,
            @Parameter(description = "이미지 포함 리뷰만") @RequestParam(required = false) Boolean withImages,
            @Parameter(description = "정렬 방식") @RequestParam(defaultValue = "newest") String sortBy,
            @Parameter(description = "페이지 번호") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기") @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest) {
        try {
            Long currentUserId = null;
            try {
                currentUserId = getUserIdFromToken(httpRequest);
            } catch (Exception e) {
                // 로그인하지 않은 사용자도 조회 가능
            }
            
            Pageable pageable = PageRequest.of(page, size);
            Page<ReviewDTO> reviews = reviewEnhancedService.getFilteredReviews(
                    productId, rating, verifiedOnly, withImages, sortBy, pageable, currentUserId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", reviews.getContent());
            response.put("totalElements", reviews.getTotalElements());
            response.put("totalPages", reviews.getTotalPages());
            response.put("currentPage", reviews.getNumber());
            response.put("size", reviews.getSize());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // JWT 토큰에서 사용자 ID 추출
    private Long getUserIdFromToken(HttpServletRequest request) {
        String token = JwtAuthenticationFilter.getTokenFromRequest(request);
        if (token == null) {
            throw new RuntimeException("인증 토큰이 필요합니다.");
        }
        
        String username = jwtUtil.getUsernameFromToken(token);
        if (username == null) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
        
        // 토큰에서 userId 직접 추출 시도
        Long userId = jwtUtil.getUserIdFromToken(token);
        if (userId != null) {
            return userId;
        }
        
        // userId가 없으면 username으로 사용자 조회
        try {
            return userService.getUserByEmail(username).getId();
        } catch (Exception e) {
            throw new RuntimeException("사용자를 찾을 수 없습니다: " + username);
        }
    }
    
    // 내부 클래스들
    public static class ReviewWithImagesRequest {
        private ReviewRequest reviewRequest;
        private List<String> imageUrls;
        
        public ReviewRequest getReviewRequest() { return reviewRequest; }
        public void setReviewRequest(ReviewRequest reviewRequest) { this.reviewRequest = reviewRequest; }
        public List<String> getImageUrls() { return imageUrls; }
        public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    }
    
    public static class ReportRequest {
        private String reason;
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
