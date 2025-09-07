package com.shoplite.repository;

import com.shoplite.model.CartItem;
import com.shoplite.model.Product;
import com.shoplite.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
    void deleteByUserAndProduct(User user, Product product);
    Long countByUser(User user);
}





