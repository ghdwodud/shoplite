package com.shoplite.controller;

import com.shoplite.dto.PaymentRequest;
import com.shoplite.dto.PaymentResponse;
import com.shoplite.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "결제 관리", description = "결제 처리 API")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Operation(summary = "결제 승인", description = "토스페이먼츠를 통한 결제를 승인합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "결제 승인 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @PostMapping("/confirm")
    @SecurityRequirements() // 인증 불필요 (테스트용)
    public ResponseEntity<?> confirmPayment(
            @Parameter(description = "결제 키") @RequestParam String paymentKey,
            @Parameter(description = "주문 ID") @RequestParam String orderId,
            @Parameter(description = "결제 금액") @RequestParam BigDecimal amount) {
        try {
            PaymentResponse response = paymentService.confirmPayment(paymentKey, orderId, amount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "결제 생성", description = "새로운 결제를 생성합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "결제 생성 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymentRequest request) {
        try {
            PaymentResponse response = paymentService.createPayment(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "결제 취소", description = "결제를 취소합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "결제 취소 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @PostMapping("/{paymentKey}/cancel")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> cancelPayment(
            @Parameter(description = "결제 키") @PathVariable String paymentKey,
            @Parameter(description = "취소 사유") @RequestParam String cancelReason) {
        try {
            PaymentResponse response = paymentService.cancelPayment(paymentKey, cancelReason);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "결제 조회", description = "결제 ID로 결제 정보를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "404", description = "결제 정보 없음"),
        @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> getPayment(@Parameter(description = "결제 ID") @PathVariable Long id) {
        try {
            PaymentResponse response = paymentService.getPayment(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "결제 키로 조회", description = "결제 키로 결제 정보를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "404", description = "결제 정보 없음"),
        @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @GetMapping("/key/{paymentKey}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> getPaymentByKey(@Parameter(description = "결제 키") @PathVariable String paymentKey) {
        try {
            PaymentResponse response = paymentService.getPaymentByKey(paymentKey);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "사용자 결제 내역", description = "사용자의 모든 결제 내역을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserPayments(@Parameter(description = "사용자 ID") @PathVariable Long userId) {
        try {
            List<PaymentResponse> responses = paymentService.getUserPayments(userId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "토스페이먼츠 클라이언트 키 조회", description = "프론트엔드에서 사용할 토스페이먼츠 클라이언트 키를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "클라이언트 키 조회 성공")
    })
    @GetMapping("/client-key")
    @SecurityRequirements() // 인증 불필요
    public ResponseEntity<?> getTossClientKey() {
        try {
            String clientKey = paymentService.getTossClientKey();
            Map<String, String> response = new HashMap<>();
            response.put("clientKey", clientKey);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "결제 실패 처리", description = "결제 실패 시 호출되는 웹훅 엔드포인트입니다.")
    @PostMapping("/webhook/fail")
    public ResponseEntity<?> handlePaymentFailure(@RequestBody Map<String, Object> payload) {
        try {
            // 결제 실패 처리 로직
            String paymentKey = (String) payload.get("paymentKey");
            String orderId = (String) payload.get("orderId");
            String failureReason = (String) payload.get("message");

            paymentService.handlePaymentFailure(paymentKey, orderId, failureReason);
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "received");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "웹훅 처리 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(error);
        }
    }
}

