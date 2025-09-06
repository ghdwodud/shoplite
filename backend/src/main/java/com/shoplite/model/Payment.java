package com.shoplite.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Schema(description = "결제 정보")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "결제 ID", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = true)
    @Schema(description = "주문 정보")
    private Order order;

    @NotNull
    @Column(name = "payment_key", unique = true, nullable = false)
    @Schema(description = "토스페이먼츠 결제 키", example = "payment_key_12345")
    private String paymentKey;

    @NotNull
    @Column(name = "order_id_string", nullable = false)
    @Schema(description = "주문 ID (문자열)", example = "order_12345")
    private String orderIdString;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 10, scale = 2)
    @Schema(description = "결제 금액", example = "50000.00")
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "결제 상태")
    private PaymentStatus status = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Schema(description = "결제 방법")
    private PaymentMethod method;

    @Column(name = "payment_provider")
    @Schema(description = "결제 제공업체", example = "토스페이먼츠")
    private String paymentProvider = "토스페이먼츠";

    @Column(name = "approved_at")
    @Schema(description = "승인 시간")
    private LocalDateTime approvedAt;

    @Column(name = "canceled_at")
    @Schema(description = "취소 시간")
    private LocalDateTime canceledAt;

    @Column(name = "failure_reason")
    @Schema(description = "실패 사유")
    private String failureReason;

    @Column(name = "created_at")
    @Schema(description = "생성 시간", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Schema(description = "수정 시간", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime updatedAt;

    // 생성자
    public Payment() {}

    public Payment(Order order, String paymentKey, String orderIdString, BigDecimal amount, PaymentMethod method) {
        this.order = order;
        this.paymentKey = paymentKey;
        this.orderIdString = orderIdString;
        this.amount = amount;
        this.method = method;
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

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
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

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
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

    // 열거형
    public enum PaymentStatus {
        PENDING,     // 결제 대기
        APPROVED,    // 결제 승인
        CANCELED,    // 결제 취소
        FAILED,      // 결제 실패
        REFUNDED     // 환불 완료
    }

    public enum PaymentMethod {
        CARD,        // 카드
        BANK_TRANSFER, // 계좌이체
        VIRTUAL_ACCOUNT, // 가상계좌
        MOBILE_PHONE,    // 휴대폰
        KAKAO_PAY,       // 카카오페이
        NAVER_PAY,       // 네이버페이
        TOSS_PAY         // 토스페이
    }
}

