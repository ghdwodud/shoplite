package com.shoplite.service;

import com.shoplite.controller.OrderController;
import com.shoplite.model.*;
import com.shoplite.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            return order.get();
        }
        throw new RuntimeException("주문을 찾을 수 없습니다. ID: " + id);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Transactional
    public Order createOrder(Long userId, List<OrderController.OrderItemRequest> orderItemRequests, OrderController.ShippingInfo shippingInfo) {
        User user = userService.getUserById(userId);
        
        // 주문 생성
        Order order = new Order();
        order.setUser(user);
        order.setShippingName(shippingInfo.getName());
        order.setShippingPhone(shippingInfo.getPhone());
        order.setShippingAddress(shippingInfo.getAddress());
        order.setNotes(shippingInfo.getNotes());
        
        // 주문 항목 생성 및 총 금액 계산
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;
        
        for (OrderController.OrderItemRequest itemRequest : orderItemRequests) {
            Product product = productService.getProductById(itemRequest.getProductId());
            
            // 재고 확인
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("재고가 부족합니다. 상품: " + product.getName());
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            orderItems.add(orderItem);
            totalAmount += orderItem.getTotalPrice();
            
            // 재고 차감
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productService.updateProduct(product.getId(), product);
        }
        
        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);
        
        return orderRepository.save(order);
    }

    // 결제를 위한 주문 생성 (결제 대기 상태)
    @Transactional
    public Order createOrderForPayment(Long userId, List<OrderController.OrderItemRequest> orderItemRequests, OrderController.ShippingInfo shippingInfo) {
        User user = userService.getUserById(userId);
        
        // 주문 번호 생성 (UUID 기반)
        String orderNumber = "ORDER_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        
        // 주문 생성
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING); // 결제 대기 상태
        order.setShippingAddress(shippingInfo.getAddress());
        order.setShippingPhone(shippingInfo.getPhone());
        order.setShippingName(shippingInfo.getName());
        order.setNotes(shippingInfo.getNotes());
        
        // 주문 아이템 생성 및 총 금액 계산
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;
        
        for (OrderController.OrderItemRequest itemRequest : orderItemRequests) {
            Product product = productService.getProductById(itemRequest.getProductId());
            
            // 재고 확인
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("상품 재고가 부족합니다: " + product.getName());
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            orderItems.add(orderItem);
            totalAmount += product.getPrice() * itemRequest.getQuantity();
        }
        
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        return orderRepository.save(order);
    }

    // 결제 완료 후 주문 확정
    @Transactional
    public Order confirmOrder(Long orderId) {
        Order order = getOrderById(orderId);
        
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("결제 대기 상태가 아닌 주문은 확정할 수 없습니다.");
        }
        
        // 재고 차감
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            int newStock = product.getStockQuantity() - orderItem.getQuantity();
            
            if (newStock < 0) {
                throw new RuntimeException("상품 재고가 부족합니다: " + product.getName());
            }
            
            product.setStockQuantity(newStock);
            productService.updateProduct(product.getId(), product);
        }
        
        // 주문 상태 변경
        order.setStatus(Order.OrderStatus.CONFIRMED);
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = getOrderById(id);
        
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("배송 완료된 주문은 취소할 수 없습니다");
        }
        
        // 재고 복원
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() + orderItem.getQuantity());
            productService.updateProduct(product.getId(), product);
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        Optional<Order> order = orderRepository.findByOrderNumber(orderNumber);
        if (order.isPresent()) {
            return order.get();
        }
        throw new RuntimeException("주문을 찾을 수 없습니다. 주문번호: " + orderNumber);
    }

    public List<Order> getOrdersByUserEmail(String email) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }

    public Double getTotalRevenue() {
        Double revenue = orderRepository.getTotalAmountByStatus(Order.OrderStatus.DELIVERED);
        return revenue != null ? revenue : 0.0;
    }

    public Long getOrderCountAfterDate(java.time.LocalDateTime date) {
        return orderRepository.countOrdersAfterDate(date);
    }
}
