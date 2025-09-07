package com.shoplite.repository;

import com.shoplite.model.ReviewAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewActionRepository extends JpaRepository<ReviewAction, Long> {
    
    // 특정 리뷰의 특정 사용자 액션 조회
    Optional<ReviewAction> findByReviewIdAndUserIdAndActionType(
            Long reviewId, Long userId, ReviewAction.ActionType actionType);
    
    // 특정 리뷰의 모든 액션 조회
    List<ReviewAction> findByReviewId(Long reviewId);
    
    // 특정 리뷰의 좋아요 수 조회
    @Query("SELECT COUNT(ra) FROM ReviewAction ra WHERE ra.review.id = :reviewId AND ra.actionType = 'LIKE'")
    Long countLikesByReviewId(@Param("reviewId") Long reviewId);
    
    // 특정 리뷰의 신고 수 조회
    @Query("SELECT COUNT(ra) FROM ReviewAction ra WHERE ra.review.id = :reviewId AND ra.actionType = 'REPORT'")
    Long countReportsByReviewId(@Param("reviewId") Long reviewId);
    
    // 사용자가 좋아요한 리뷰 목록
    @Query("SELECT ra.review.id FROM ReviewAction ra WHERE ra.user.id = :userId AND ra.actionType = 'LIKE'")
    List<Long> findLikedReviewIdsByUserId(@Param("userId") Long userId);
    
    // 사용자가 신고한 리뷰 목록
    @Query("SELECT ra.review.id FROM ReviewAction ra WHERE ra.user.id = :userId AND ra.actionType = 'REPORT'")
    List<Long> findReportedReviewIdsByUserId(@Param("userId") Long userId);
    
    // 특정 리뷰에 대한 사용자의 액션 존재 여부
    boolean existsByReviewIdAndUserIdAndActionType(
            Long reviewId, Long userId, ReviewAction.ActionType actionType);
    
    // 신고가 많은 리뷰 조회 (관리자용)
    @Query("SELECT ra.review.id, COUNT(ra) as reportCount " +
           "FROM ReviewAction ra " +
           "WHERE ra.actionType = 'REPORT' " +
           "GROUP BY ra.review.id " +
           "HAVING COUNT(ra) >= :threshold " +
           "ORDER BY COUNT(ra) DESC")
    List<Object[]> findReviewsWithManyReports(@Param("threshold") Long threshold);
}



