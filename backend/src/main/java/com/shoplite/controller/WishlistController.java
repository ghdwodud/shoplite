package com.shoplite.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.shoplite.dto.WishlistDTO;
import com.shoplite.model.Wishlist;
import com.shoplite.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "위시리스트 관리", description = "위시리스트 CRUD API")
public class WishlistController {
    
    @Autowired
    private WishlistService wishlistService;
    
    @Operation(summary = "위시리스트에 상품 추가", description = "사용자의 위시리스트에 상품을 추가합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 추가됨"),
        @ApiResponse(responseCode = "400", description = "이미 위시리스트에 있는 상품"),
        @ApiResponse(responseCode = "404", description = "사용자 또는 상품을 찾을 수 없음")
    })
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToWishlist(
            @Parameter(description = "사용자 ID", required = true)
            @RequestParam Long userId,
            @Parameter(description = "상품 ID", required = true)
            @RequestParam Long productId) {
        
        try {
            Wishlist wishlist = wishlistService.addToWishlist(userId, productId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "위시리스트에 추가되었습니다.");
            response.put("wishlist", new WishlistDTO(wishlist));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @Operation(summary = "위시리스트에서 상품 제거", description = "사용자의 위시리스트에서 상품을 제거합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 제거됨")
    })
    @DeleteMapping("/remove")
    public ResponseEntity<Map<String, Object>> removeFromWishlist(
            @Parameter(description = "사용자 ID", required = true)
            @RequestParam Long userId,
            @Parameter(description = "상품 ID", required = true)
            @RequestParam Long productId) {
        
        wishlistService.removeFromWishlist(userId, productId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "위시리스트에서 제거되었습니다.");
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "위시리스트 토글", description = "위시리스트에 있으면 제거, 없으면 추가합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 처리됨")
    })
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleWishlist(
            @Parameter(description = "사용자 ID", required = true)
            @RequestParam Long userId,
            @Parameter(description = "상품 ID", required = true)
            @RequestParam Long productId) {
        
        try {
            boolean added = wishlistService.toggleWishlist(userId, productId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("added", added);
            response.put("message", added ? "위시리스트에 추가되었습니다." : "위시리스트에서 제거되었습니다.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @Operation(summary = "사용자 위시리스트 조회", description = "특정 사용자의 위시리스트를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 조회됨")
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WishlistDTO>> getUserWishlist(
            @Parameter(description = "사용자 ID", required = true)
            @PathVariable Long userId) {
        
        List<Wishlist> wishlists = wishlistService.getUserWishlist(userId);
        List<WishlistDTO> wishlistDTOs = wishlists.stream()
                .map(WishlistDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(wishlistDTOs);
    }
    
    @Operation(summary = "위시리스트 상태 확인", description = "사용자가 특정 상품을 찜했는지 확인합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 확인됨")
    })
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkWishlistStatus(
            @Parameter(description = "사용자 ID", required = true)
            @RequestParam Long userId,
            @Parameter(description = "상품 ID", required = true)
            @RequestParam Long productId) {
        
        boolean isInWishlist = wishlistService.isInWishlist(userId, productId);
        Map<String, Object> response = new HashMap<>();
        response.put("isInWishlist", isInWishlist);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "위시리스트 개수 조회", description = "사용자의 위시리스트 개수를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 조회됨")
    })
    @GetMapping("/count/{userId}")
    public ResponseEntity<Map<String, Object>> getUserWishlistCount(
            @Parameter(description = "사용자 ID", required = true)
            @PathVariable Long userId) {
        
        long count = wishlistService.getUserWishlistCount(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}

