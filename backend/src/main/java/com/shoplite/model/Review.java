package com.shoplite.model;

import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "reviews")
@Schema(description = "상품 리뷰 정보")
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(description = "리뷰 ID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @NotNull(message = "평점은 필수입니다")
    @Min(value = 1, message = "평점은 1점 이상이어야 합니다")
    @Max(value = 5, message = "평점은 5점 이하여야 합니다")
    @Column(nullable = false)
    @Schema(description = "평점 (1-5)", example = "5", required = true)
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    @Schema(description = "리뷰 내용", example = "정말 좋은 상품입니다!")
    private String comment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @Schema(description = "상품 정보")
    private Product product;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(description = "사용자 정보")
    private User user;
    
    @Column(name = "created_at")
    @Schema(description = "리뷰 작성일", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @Schema(description = "리뷰 수정일", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime updatedAt;
    
    // 리뷰 이미지 URL들 (JSON 배열로 저장)
    @Column(name = "image_urls", columnDefinition = "TEXT")
    @Schema(description = "리뷰 이미지 URL 목록 (JSON 배열)")
    private String imageUrls;

    // 좋아요 수
    @Column(name = "like_count")
    @Schema(description = "좋아요 수", example = "15")
    private Integer likeCount = 0;

    // 신고 수
    @Column(name = "report_count")
    @Schema(description = "신고 수", example = "0")
    private Integer reportCount = 0;

    // 구매 확인 여부
    @Column(name = "is_verified_purchase")
    @Schema(description = "구매 확인 여부", example = "true")
    private Boolean isVerifiedPurchase = false;

    // 리뷰 상태 (활성, 숨김, 삭제)
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Schema(description = "리뷰 상태")
    private ReviewStatus status = ReviewStatus.ACTIVE;

    // 도움이 된 점수 (좋아요 - 신고)
    @Column(name = "helpfulness_score")
    @Schema(description = "도움이 된 점수", example = "12")
    private Integer helpfulnessScore = 0;

    // 기본 생성자
    public Review() {}
    
    // 생성자
    public Review(Integer rating, String comment, Product product, User user) {
        this.rating = rating;
        this.comment = comment;
        this.product = product;
        this.user = user;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
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

    public String getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(String imageUrls) {
        this.imageUrls = imageUrls;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
        updateHelpfulnessScore();
    }

    public Integer getReportCount() {
        return reportCount;
    }

    public void setReportCount(Integer reportCount) {
        this.reportCount = reportCount;
        updateHelpfulnessScore();
    }

    public Boolean getIsVerifiedPurchase() {
        return isVerifiedPurchase;
    }

    public void setIsVerifiedPurchase(Boolean isVerifiedPurchase) {
        this.isVerifiedPurchase = isVerifiedPurchase;
    }

    public ReviewStatus getStatus() {
        return status;
    }

    public void setStatus(ReviewStatus status) {
        this.status = status;
    }

    public Integer getHelpfulnessScore() {
        return helpfulnessScore;
    }

    public void setHelpfulnessScore(Integer helpfulnessScore) {
        this.helpfulnessScore = helpfulnessScore;
    }

    // 도움이 된 점수 자동 계산
    private void updateHelpfulnessScore() {
        this.helpfulnessScore = (this.likeCount != null ? this.likeCount : 0) -
                (this.reportCount != null ? this.reportCount : 0);
    }

    // 리뷰 상태 열거형
    public enum ReviewStatus {
        ACTIVE, // 활성
        HIDDEN, // 숨김 (신고 많음)
        DELETED // 삭제됨
    }
}
