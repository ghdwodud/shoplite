package com.shoplite.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(description = "리뷰 작성/수정 요청 DTO")
public class ReviewRequest {
    
    @NotNull(message = "평점은 필수입니다")
    @Min(value = 1, message = "평점은 1점 이상이어야 합니다")
    @Max(value = 5, message = "평점은 5점 이하여야 합니다")
    @Schema(description = "평점 (1-5)", example = "5", required = true)
    private Integer rating;
    
    @Schema(description = "리뷰 내용", example = "정말 좋은 상품입니다!")
    private String comment;
    
    // 기본 생성자
    public ReviewRequest() {}
    
    // 생성자
    public ReviewRequest(Integer rating, String comment) {
        this.rating = rating;
        this.comment = comment;
    }
    
    // Getters and Setters
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
}
