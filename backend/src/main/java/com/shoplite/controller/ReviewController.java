package com.shoplite.controller;

import com.shoplite.dto.ReviewDTO;
import com.shoplite.dto.ReviewRequest;
import com.shoplite.dto.ReviewSummaryDTO;
import com.shoplite.security.JwtAuthenticationFilter;
import com.shoplite.service.ReviewService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Review", description = "리뷰 관리 API")
@CrossOrigin(origins = "*")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/products/{productId}")
    @Operation(summary = "리뷰 작성", description = "특정 상품에 대한 리뷰를 작성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "리뷰 작성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "409", description = "이미 리뷰 작성함")
    })
    public ResponseEntity<?> createReview(
            @Parameter(description = "상품 ID") @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            ReviewDTO review = reviewService.createReview(productId, userId, request);
            
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
    
    @PutMapping("/{reviewId}")
    @Operation(summary = "리뷰 수정", description = "작성한 리뷰를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 수정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "403", description = "권한 없음"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음")
    })
    public ResponseEntity<?> updateReview(
            @Parameter(description = "리뷰 ID") @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            ReviewDTO review = reviewService.updateReview(reviewId, userId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "리뷰가 성공적으로 수정되었습니다.");
            response.put("data", review);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{reviewId}")
    @Operation(summary = "리뷰 삭제", description = "작성한 리뷰를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "403", description = "권한 없음"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음")
    })
    public ResponseEntity<?> deleteReview(
            @Parameter(description = "리뷰 ID") @PathVariable Long reviewId,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            reviewService.deleteReview(reviewId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "리뷰가 성공적으로 삭제되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/products/{productId}")
    @Operation(summary = "상품 리뷰 목록 조회", description = "특정 상품의 리뷰 목록을 페이징으로 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "상품을 찾을 수 없음")
    })
    public ResponseEntity<?> getProductReviews(
            @Parameter(description = "상품 ID") @PathVariable Long productId,
            @Parameter(description = "페이지 번호 (0부터 시작)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기") @RequestParam(defaultValue = "10") int size) {
        try {
            Page<ReviewDTO> reviews = reviewService.getProductReviews(productId, page, size);
            
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
    
    @GetMapping("/products/{productId}/summary")
    @Operation(summary = "상품 리뷰 요약 조회", description = "특정 상품의 리뷰 요약 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리뷰 요약 조회 성공"),
            @ApiResponse(responseCode = "404", description = "상품을 찾을 수 없음")
    })
    public ResponseEntity<?> getProductReviewSummary(
            @Parameter(description = "상품 ID") @PathVariable Long productId) {
        try {
            ReviewSummaryDTO summary = reviewService.getProductReviewSummary(productId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", summary);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/users/me")
    @Operation(summary = "내 리뷰 목록 조회", description = "현재 사용자가 작성한 리뷰 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 리뷰 목록 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    public ResponseEntity<?> getMyReviews(HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            List<ReviewDTO> reviews = reviewService.getUserReviews(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", reviews);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/products/{productId}/my-review")
    @Operation(summary = "내 상품 리뷰 조회", description = "특정 상품에 대한 내 리뷰를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 리뷰 조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "리뷰를 찾을 수 없음")
    })
    public ResponseEntity<?> getMyProductReview(
            @Parameter(description = "상품 ID") @PathVariable Long productId,
            HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            ReviewDTO review = reviewService.getUserProductReview(productId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", review);
            response.put("hasReview", review != null);
            
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
}
