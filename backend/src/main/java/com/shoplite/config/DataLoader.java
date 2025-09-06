package com.shoplite.config;

import com.shoplite.model.Category;
import com.shoplite.model.Product;
import com.shoplite.model.User;
import com.shoplite.repository.CategoryRepository;
import com.shoplite.repository.ProductRepository;
import com.shoplite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 기존 데이터 삭제 (개발용)
        userRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        
        System.out.println("기존 데이터 삭제 완료, 새 데이터 생성 중...");

        // 카테고리 초기 데이터
        Category electronics = new Category("전자제품", "스마트폰, 노트북, 태블릿 등");
        electronics.setDisplayOrder(1);
        categoryRepository.save(electronics);

        Category clothing = new Category("의류", "남성복, 여성복, 아동복");
        clothing.setDisplayOrder(2);
        categoryRepository.save(clothing);

        Category books = new Category("도서", "소설, 전문서적, 만화");
        books.setDisplayOrder(3);
        categoryRepository.save(books);

        Category sports = new Category("스포츠", "운동용품, 스포츠웨어");
        sports.setDisplayOrder(4);
        categoryRepository.save(sports);

        // 상품 초기 데이터
        Product product1 = new Product("iPhone 15", "최신 아이폰 15 모델", 1200000.0, 
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400", 50);
        product1.setCategory(electronics);
        productRepository.save(product1);

        Product product2 = new Product("MacBook Pro", "M3 칩 탑재 맥북 프로", 2500000.0, 
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", 20);
        product2.setCategory(electronics);
        productRepository.save(product2);

        Product product3 = new Product("나이키 에어맥스", "편안한 운동화", 150000.0, 
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", 100);
        product3.setCategory(sports);
        productRepository.save(product3);

        Product product4 = new Product("청바지", "클래식 데님 청바지", 80000.0, 
            "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", 75);
        product4.setCategory(clothing);
        productRepository.save(product4);

        Product product5 = new Product("자바 프로그래밍", "자바 학습을 위한 완벽 가이드", 35000.0, 
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", 200);
        product5.setCategory(books);
        productRepository.save(product5);

        Product product6 = new Product("무선 이어폰", "노이즈 캔슬링 무선 이어폰", 200000.0, 
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", 80);
        product6.setCategory(electronics);
        productRepository.save(product6);

        Product product7 = new Product("후드티", "편안한 후드 티셔츠", 45000.0, 
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", 120);
        product7.setCategory(clothing);
        productRepository.save(product7);

        Product product8 = new Product("요가매트", "고품질 요가 매트", 60000.0, 
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400", 50);
        product8.setCategory(sports);
        productRepository.save(product8);

        // 관리자 계정 생성
        User admin = new User("admin", "admin@shoplite.com", passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        admin.setFullName("관리자");
        userRepository.save(admin);

        // 테스트 고객 계정 생성
        User customer = new User("customer", "customer@test.com", passwordEncoder.encode("test123"));
        customer.setRole(User.Role.CUSTOMER);
        customer.setFullName("김고객");
        customer.setPhoneNumber("010-1234-5678");
        customer.setAddress("서울시 강남구 테헤란로 123");
        userRepository.save(customer);

        System.out.println("초기 데이터 로딩 완료!");
        System.out.println("관리자 계정: admin@shoplite.com / admin123");
        System.out.println("고객 계정: customer@test.com / test123");
    }
}
