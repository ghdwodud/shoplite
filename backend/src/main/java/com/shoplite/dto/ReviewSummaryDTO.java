package com.shoplite.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Map;

@Schema(description = "리뷰 요약 정보 DTO")
public class ReviewSummaryDTO {
    
    @Schema(description = "평균 평점", example = "4.5")
    private Double averageRating;
    
    @Schema(description = "총 리뷰 개수", example = "10")
    private Long totalReviews;
    
    @Schema(description = "평점별 리뷰 개수 (5점부터 1점까지)")
    private Map<Integer, Long> ratingCounts;
    
    // 기본 생성자
    public ReviewSummaryDTO() {}
    
    // 생성자
    public ReviewSummaryDTO(Double averageRating, Long totalReviews, Map<Integer, Long> ratingCounts) {
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.ratingCounts = ratingCounts;
    }
    
    // Getters and Setters
    public Double getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
    
    public Long getTotalReviews() {
        return totalReviews;
    }
    
    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }
    
    public Map<Integer, Long> getRatingCounts() {
        return ratingCounts;
    }
    
    public void setRatingCounts(Map<Integer, Long> ratingCounts) {
        this.ratingCounts = ratingCounts;
    }
}
