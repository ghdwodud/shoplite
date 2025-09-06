package com.shoplite.controller;

import com.shoplite.model.CartItem;
import com.shoplite.dto.CartItemDTO;
import com.shoplite.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CartItemDTO>> getCartItems(@PathVariable Long userId) {
        List<CartItem> cartItems = cartService.getCartItems(userId);
        List<CartItemDTO> cartItemDTOs = cartItems.stream()
                .map(CartItemDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cartItemDTOs);
    }

    @PostMapping
    public ResponseEntity<CartItemDTO> addToCart(@RequestBody AddToCartRequest request) {
        CartItem cartItem = cartService.addToCart(request.getUserId(), request.getProductId(), request.getQuantity());
        CartItemDTO cartItemDTO = new CartItemDTO(cartItem);
        return ResponseEntity.ok(cartItemDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItemDTO> updateCartItem(@PathVariable Long id, @RequestBody UpdateCartItemRequest request) {
        CartItem updatedItem = cartService.updateCartItem(id, request.getQuantity());
        CartItemDTO cartItemDTO = new CartItemDTO(updatedItem);
        return ResponseEntity.ok(cartItemDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getCartItemCount(@PathVariable Long userId) {
        Long count = cartService.getCartItemCount(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/user/{userId}/total")
    public ResponseEntity<Double> getCartTotal(@PathVariable Long userId) {
        Double total = cartService.getCartTotal(userId);
        return ResponseEntity.ok(total);
    }

    // DTO 클래스들
    public static class AddToCartRequest {
        private Long userId;
        private Long productId;
        private Integer quantity;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public static class UpdateCartItemRequest {
        private Integer quantity;

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
