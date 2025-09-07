package com.shoplite.dto;

import com.shoplite.model.Payment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class PaymentRequest {
    
    @NotNull(message = "주문 ID는 필수입니다")
    private Long orderId;
    
    @NotBlank(message = "결제 키는 필수입니다")
    private String paymentKey;
    
    @NotBlank(message = "주문 ID 문자열은 필수입니다")
    private String orderIdString;
    
    @NotNull(message = "결제 금액은 필수입니다")
    @Positive(message = "결제 금액은 양수여야 합니다")
    private BigDecimal amount;
    
    @NotNull(message = "결제 방법은 필수입니다")
    private Payment.PaymentMethod method;
    
    // 생성자
    public PaymentRequest() {}
    
    public PaymentRequest(Long orderId, String paymentKey, String orderIdString, 
                         BigDecimal amount, Payment.PaymentMethod method) {
        this.orderId = orderId;
        this.paymentKey = paymentKey;
        this.orderIdString = orderIdString;
        this.amount = amount;
        this.method = method;
    }
    
    // Getters and Setters
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
    
    public Payment.PaymentMethod getMethod() {
        return method;
    }
    
    public void setMethod(Payment.PaymentMethod method) {
        this.method = method;
    }
}




