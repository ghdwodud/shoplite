package com.shoplite.dto;

import com.shoplite.model.Payment;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {
    
    private Long id;
    private Long orderId;
    private String paymentKey;
    private String orderIdString;
    private BigDecimal amount;
    private Payment.PaymentStatus status;
    private Payment.PaymentMethod method;
    private String paymentProvider;
    private LocalDateTime approvedAt;
    private LocalDateTime canceledAt;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 생성자
    public PaymentResponse() {}
    
    public PaymentResponse(Payment payment) {
        this.id = payment.getId();
        this.orderId = payment.getOrder() != null ? payment.getOrder().getId() : null;
        this.paymentKey = payment.getPaymentKey();
        this.orderIdString = payment.getOrderIdString();
        this.amount = payment.getAmount();
        this.status = payment.getStatus();
        this.method = payment.getMethod();
        this.paymentProvider = payment.getPaymentProvider();
        this.approvedAt = payment.getApprovedAt();
        this.canceledAt = payment.getCanceledAt();
        this.failureReason = payment.getFailureReason();
        this.createdAt = payment.getCreatedAt();
        this.updatedAt = payment.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getOrderId() {
        return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public String getPaymentKey() {
        return paymentKey;
    }
    
    public void setPaymentKey(String paymentKey) {
        this.paymentKey = paymentKey;
    }
    
    public String getOrderIdString() {
        return orderIdString;
    }
    
    public void setOrderIdString(String orderIdString) {
        this.orderIdString = orderIdString;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public Payment.PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(Payment.PaymentStatus status) {
        this.status = status;
    }
    
    public Payment.PaymentMethod getMethod() {
        return method;
    }
    
    public void setMethod(Payment.PaymentMethod method) {
        this.method = method;
    }
    
    public String getPaymentProvider() {
        return paymentProvider;
    }
    
    public void setPaymentProvider(String paymentProvider) {
        this.paymentProvider = paymentProvider;
    }
    
    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }
    
    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
    
    public LocalDateTime getCanceledAt() {
        return canceledAt;
    }
    
    public void setCanceledAt(LocalDateTime canceledAt) {
        this.canceledAt = canceledAt;
    }
    
    public String getFailureReason() {
        return failureReason;
    }
    
    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
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
}

