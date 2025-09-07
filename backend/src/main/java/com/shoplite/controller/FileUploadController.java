package com.shoplite.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "파일 업로드", description = "이미지 파일 업로드 API")
public class FileUploadController {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Operation(summary = "이미지 파일 업로드", description = "상품 이미지를 업로드합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 업로드됨"),
        @ApiResponse(responseCode = "400", description = "잘못된 파일 형식"),
        @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping("/image")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @Parameter(description = "업로드할 이미지 파일", required = true)
            @RequestParam("file") MultipartFile file) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 파일 검증
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "파일이 비어있습니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 파일 형식 검증
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "이미지 파일만 업로드 가능합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 파일 크기 검증 (5MB 제한)
            if (file.getSize() > 5 * 1024 * 1024) {
                response.put("success", false);
                response.put("message", "파일 크기는 5MB를 초과할 수 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // 고유한 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            
            // 파일 저장
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // 성공 응답
            response.put("success", true);
            response.put("message", "파일이 성공적으로 업로드되었습니다.");
            response.put("filename", uniqueFilename);
            response.put("originalFilename", originalFilename);
            response.put("url", "/api/files/" + uniqueFilename);
            response.put("size", file.getSize());
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @Operation(summary = "다중 이미지 업로드", description = "여러 상품 이미지를 한번에 업로드합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공적으로 업로드됨"),
        @ApiResponse(responseCode = "400", description = "잘못된 파일 형식"),
        @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping("/images")
    public ResponseEntity<Map<String, Object>> uploadMultipleImages(
            @Parameter(description = "업로드할 이미지 파일들", required = true)
            @RequestParam("files") MultipartFile[] files) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (files.length == 0) {
                response.put("success", false);
                response.put("message", "업로드할 파일이 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (files.length > 10) {
                response.put("success", false);
                response.put("message", "한번에 최대 10개의 파일만 업로드 가능합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Map<String, Object>[] uploadResults = new Map[files.length];
            boolean hasError = false;
            
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                Map<String, Object> fileResult = new HashMap<>();
                
                try {
                    // 파일 검증
                    if (file.isEmpty()) {
                        fileResult.put("success", false);
                        fileResult.put("message", "파일이 비어있습니다.");
                        hasError = true;
                        continue;
                    }
                    
                    String contentType = file.getContentType();
                    if (contentType == null || !contentType.startsWith("image/")) {
                        fileResult.put("success", false);
                        fileResult.put("message", "이미지 파일만 업로드 가능합니다.");
                        hasError = true;
                        continue;
                    }
                    
                    if (file.getSize() > 5 * 1024 * 1024) {
                        fileResult.put("success", false);
                        fileResult.put("message", "파일 크기는 5MB를 초과할 수 없습니다.");
                        hasError = true;
                        continue;
                    }
                    
                    // 고유한 파일명 생성
                    String originalFilename = file.getOriginalFilename();
                    String fileExtension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }
                    String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
                    
                    // 파일 저장
                    Path filePath = uploadPath.resolve(uniqueFilename);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    
                    fileResult.put("success", true);
                    fileResult.put("filename", uniqueFilename);
                    fileResult.put("originalFilename", originalFilename);
                    fileResult.put("url", "/api/files/" + uniqueFilename);
                    fileResult.put("size", file.getSize());
                    
                } catch (IOException e) {
                    fileResult.put("success", false);
                    fileResult.put("message", "파일 업로드 중 오류: " + e.getMessage());
                    hasError = true;
                }
                
                uploadResults[i] = fileResult;
            }
            
            response.put("success", !hasError);
            response.put("message", hasError ? "일부 파일 업로드에 실패했습니다." : "모든 파일이 성공적으로 업로드되었습니다.");
            response.put("results", uploadResults);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}


