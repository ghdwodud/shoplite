package com.shoplite.controller;

import com.shoplite.dto.JwtResponse;
import com.shoplite.dto.LoginRequest;
import com.shoplite.dto.SignupRequest;
import com.shoplite.model.User;
import com.shoplite.repository.UserRepository;
import com.shoplite.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "인증 관리", description = "로그인, 회원가입 API")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "로그인 성공"),
        @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // 마지막 로그인 시간 업데이트
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            String jwt = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

            return ResponseEntity.ok(new JwtResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
            ));

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "회원가입 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            // 이메일 중복 확인
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "이미 사용 중인 이메일입니다.");
                return ResponseEntity.badRequest().body(error);
            }

            // 새 사용자 생성
            User user = new User();
            user.setUsername(signupRequest.getUsername());
            user.setEmail(signupRequest.getEmail());
            user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
            user.setFullName(signupRequest.getFullName());
            user.setPhoneNumber(signupRequest.getPhoneNumber());
            user.setAddress(signupRequest.getAddress());
            user.setRole(User.Role.CUSTOMER);
            user.setStatus(User.UserStatus.ACTIVE);

            User savedUser = userRepository.save(user);

            String jwt = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());

            return ResponseEntity.ok(new JwtResponse(
                jwt,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().name()
            ));

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "회원가입 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "토큰 검증", description = "JWT 토큰의 유효성을 검증합니다.")
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String email = jwtUtil.extractUsername(token);
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (jwtUtil.validateToken(token, email)) {
                return ResponseEntity.ok(new JwtResponse(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
                ));
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "유효하지 않은 토큰입니다.");
                return ResponseEntity.badRequest().body(error);
            }

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "토큰 검증 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(error);
        }
    }
}


