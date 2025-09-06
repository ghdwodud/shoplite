package com.shoplite.controller;

import com.shoplite.model.Product;
import com.shoplite.dto.ProductDTO;
import com.shoplite.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "상품 관리", description = "상품 CRUD API")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Operation(summary = "모든 상품 조회", description = "등록된 모든 상품 목록을 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 조회됨",
                content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = ProductDTO.class)))
    })
    @SecurityRequirements() // 인증 불필요
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDTO> productDTOs = products.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }

    @Operation(summary = "상품 상세 조회", description = "ID로 특정 상품의 상세 정보를 조회합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 조회됨"),
        @ApiResponse(responseCode = "404", description = "상품을 찾을 수 없음")
    })
    @SecurityRequirements() // 인증 불필요
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @Parameter(description = "상품 ID", required = true, example = "1")
            @PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @Operation(summary = "새 상품 등록", description = "새로운 상품을 등록합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 등록됨"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터")
    })
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "등록할 상품 정보", required = true,
                content = @Content(schema = @Schema(implementation = Product.class)))
            @RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.ok(createdProduct);
    }

    @Operation(summary = "상품 정보 수정", description = "기존 상품의 정보를 수정합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 수정됨"),
        @ApiResponse(responseCode = "404", description = "상품을 찾을 수 없음"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @Parameter(description = "수정할 상품 ID", required = true, example = "1")
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "수정할 상품 정보", required = true,
                content = @Content(schema = @Schema(implementation = Product.class)))
            @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(updatedProduct);
    }

    @Operation(summary = "상품 삭제", description = "상품을 삭제합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 삭제됨"),
        @ApiResponse(responseCode = "404", description = "상품을 찾을 수 없음")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "삭제할 상품 ID", required = true, example = "1")
            @PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "상품 검색", description = "다양한 조건으로 상품을 검색합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 조회됨",
                content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = ProductDTO.class)))
    })
    @SecurityRequirements() // 인증 불필요
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(
            @Parameter(description = "검색 키워드 (상품명, 설명)", example = "iPhone")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "카테고리 ID", example = "1")
            @RequestParam(required = false) Long categoryId,
            @Parameter(description = "최소 가격", example = "100000")
            @RequestParam(required = false) Double minPrice,
            @Parameter(description = "최대 가격", example = "2000000")
            @RequestParam(required = false) Double maxPrice,
            @Parameter(description = "정렬 기준 (name, price, createdAt)", example = "price")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "정렬 방향 (asc, desc)", example = "asc")
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        List<Product> products = productService.searchProducts(keyword, categoryId, minPrice, maxPrice, sortBy, sortDirection);
        List<ProductDTO> productDTOs = products.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }
}
