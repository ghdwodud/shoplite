package com.shoplite.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "리뷰 정보 DTO")
public class ReviewDTO {
    
    @Schema(description = "리뷰 ID", example = "1")
    private Long id;
    
    @NotNull(message = "평점은 필수입니다")
    @Min(value = 1, message = "평점은 1점 이상이어야 합니다")
    @Max(value = 5, message = "평점은 5점 이하여야 합니다")
    @Schema(description = "평점 (1-5)", example = "5", required = true)
    private Integer rating;
    
    @Schema(description = "리뷰 내용", example = "정말 좋은 상품입니다!")
    private String comment;
    
    @Schema(description = "상품 ID", example = "1")
    private Long productId;
    
    @Schema(description = "상품명", example = "iPhone 15")
    private String productName;
    
    @Schema(description = "사용자 ID", example = "1")
    private Long userId;
    
    @Schema(description = "사용자명", example = "홍길동")
    private String username;
    
    @Schema(description = "리뷰 작성일")
    private LocalDateTime createdAt;
    
    @Schema(description = "리뷰 수정일")
    private LocalDateTime updatedAt;
    
    // 고도화된 필드들
    @Schema(description = "리뷰 이미지 URL 목록")
    private List<String> imageUrls;

    @Schema(description = "좋아요 수", example = "15")
    private Integer likeCount = 0;

    @Schema(description = "신고 수", example = "2")
    private Integer reportCount = 0;

    @Schema(description = "도움이 된 점수", example = "13")
    private Integer helpfulnessScore = 0;

    @Schema(description = "구매 확인 여부", example = "true")
    private Boolean verifiedPurchase = false;

    @Schema(description = "리뷰 상태", example = "ACTIVE")
    private String status;

    // 현재 사용자의 액션 상태
    @Schema(description = "현재 사용자가 좋아요 했는지", example = "false")
    private Boolean userLiked = false;

    @Schema(description = "현재 사용자가 신고 했는지", example = "false")
    private Boolean userReported = false;

    // 기본 생성자
    public ReviewDTO() {}
    
    // 생성자
    public ReviewDTO(Long id, Integer rating, String comment, Long productId, String productName, 
                    Long userId, String username, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.productId = productId;
        this.productName = productName;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Integer getReportCount() {
        return reportCount;
    }

    public void setReportCount(Integer reportCount) {
        this.reportCount = reportCount;
    }

    public Integer getHelpfulnessScore() {
        return helpfulnessScore;
    }

    public void setHelpfulnessScore(Integer helpfulnessScore) {
        this.helpfulnessScore = helpfulnessScore;
    }

    public Boolean getVerifiedPurchase() {
        return verifiedPurchase;
    }

    public void setVerifiedPurchase(Boolean verifiedPurchase) {
        this.verifiedPurchase = verifiedPurchase;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getUserLiked() {
        return userLiked;
    }

    public void setUserLiked(Boolean userLiked) {
        this.userLiked = userLiked;
    }

    public Boolean getUserReported() {
        return userReported;
    }

    public void setUserReported(Boolean userReported) {
        this.userReported = userReported;
    }
}
