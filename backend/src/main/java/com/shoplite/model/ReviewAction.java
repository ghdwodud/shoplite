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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "review_actions", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"review_id", "user_id", "action_type"}))
@Schema(description = "리뷰 액션 (좋아요/신고)")
public class ReviewAction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(description = "액션 ID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    @Schema(description = "리뷰 정보")
    private Review review;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(description = "사용자 정보")
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    @Schema(description = "액션 타입", example = "LIKE")
    private ActionType actionType;
    
    @Column(name = "created_at")
    @Schema(description = "액션 생성일", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
    
    @Column(name = "reason")
    @Schema(description = "신고 사유 (신고인 경우)")
    private String reason;
    
    // 기본 생성자
    public ReviewAction() {}
    
    // 생성자
    public ReviewAction(Review review, User user, ActionType actionType) {
        this.review = review;
        this.user = user;
        this.actionType = actionType;
        this.createdAt = LocalDateTime.now();
    }
    
    // 신고용 생성자
    public ReviewAction(Review review, User user, ActionType actionType, String reason) {
        this(review, user, actionType);
        this.reason = reason;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Review getReview() {
        return review;
    }
    
    public void setReview(Review review) {
        this.review = review;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public ActionType getActionType() {
        return actionType;
    }
    
    public void setActionType(ActionType actionType) {
        this.actionType = actionType;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    // 액션 타입 열거형
    public enum ActionType {
        LIKE,      // 좋아요
        REPORT     // 신고
    }
}


