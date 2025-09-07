package com.shoplite.repository;

import com.shoplite.model.Order;
import com.shoplite.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUser(User user);
    List<Order> findByUserId(Long userId);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT o FROM Order o WHERE o.user.email = :email ORDER BY o.createdAt DESC")
    List<Order> findByUserEmailOrderByCreatedAtDesc(@Param("email") String email);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = :status")
    Double getTotalAmountByStatus(@Param("status") Order.OrderStatus status);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :date")
    Long countOrdersAfterDate(@Param("date") LocalDateTime date);

    // 구매 확인을 위한 메서드 추가
    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM Order o JOIN o.orderItems oi WHERE o.user.id = :userId AND oi.product.id = :productId AND o.status = 'COMPLETED'")
    boolean existsByUserIdAndOrderItemsProductId(@Param("userId") Long userId, @Param("productId") Long productId);
}


