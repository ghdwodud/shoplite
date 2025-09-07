package com.shoplite.service;

import com.shoplite.model.CartItem;
import com.shoplite.model.Product;
import com.shoplite.model.User;
import com.shoplite.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    public List<CartItem> getCartItems(Long userId) {
        User user = userService.getUserById(userId);
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        User user = userService.getUserById(userId);
        Product product = productService.getProductById(productId);

        // 재고 확인
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("재고가 부족합니다. 현재 재고: " + product.getStockQuantity());
        }

        // 이미 장바구니에 있는 상품인지 확인
        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);
        
        if (existingItem.isPresent()) {
            // 기존 항목의 수량 업데이트
            CartItem cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + quantity;
            
            if (product.getStockQuantity() < newQuantity) {
                throw new RuntimeException("재고가 부족합니다. 현재 재고: " + product.getStockQuantity());
            }
            
            cartItem.setQuantity(newQuantity);
            return cartItemRepository.save(cartItem);
        } else {
            // 새 항목 추가
            CartItem cartItem = new CartItem(user, product, quantity);
            return cartItemRepository.save(cartItem);
        }
    }

    public CartItem updateCartItem(Long cartItemId, Integer quantity) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (cartItemOpt.isEmpty()) {
            throw new RuntimeException("장바구니 항목을 찾을 수 없습니다. ID: " + cartItemId);
        }

        CartItem cartItem = cartItemOpt.get();
        Product product = cartItem.getProduct();

        // 재고 확인
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("재고가 부족합니다. 현재 재고: " + product.getStockQuantity());
        }

        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }

    public void removeFromCart(Long cartItemId) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (cartItemOpt.isEmpty()) {
            throw new RuntimeException("장바구니 항목을 찾을 수 없습니다. ID: " + cartItemId);
        }

        cartItemRepository.delete(cartItemOpt.get());
    }

    public void clearCart(Long userId) {
        User user = userService.getUserById(userId);
        cartItemRepository.deleteByUser(user);
    }

    public Long getCartItemCount(Long userId) {
        User user = userService.getUserById(userId);
        return cartItemRepository.countByUser(user);
    }

    public Double getCartTotal(Long userId) {
        List<CartItem> cartItems = getCartItems(userId);
        return cartItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
    }

    public void removeFromCartByUserAndProduct(Long userId, Long productId) {
        User user = userService.getUserById(userId);
        Product product = productService.getProductById(productId);
        cartItemRepository.deleteByUserAndProduct(user, product);
    }
}



