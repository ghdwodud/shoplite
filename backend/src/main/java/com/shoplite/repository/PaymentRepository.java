package com.shoplite.repository;

import com.shoplite.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByPaymentKey(String paymentKey);
    
    Optional<Payment> findByOrderIdString(String orderIdString);
    
    Optional<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    List<Payment> findByMethod(Payment.PaymentMethod method);
    
    List<Payment> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Payment> findByOrderUserIdOrderByCreatedAtDesc(Long userId);
    
    boolean existsByPaymentKey(String paymentKey);
    
    boolean existsByOrderIdString(String orderIdString);
}





