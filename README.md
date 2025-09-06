# ShopLite - 리액트 + 스프링 부트 쇼핑몰

간단한 상품 관리 기능을 제공하는 풀스택 웹 애플리케이션입니다.

## 🛠 기술 스택

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **H2 Database** (개발용)
- **Maven**

### Frontend
- **React 18**
- **React Router DOM**
- **Axios**
- **Styled Components**

## 📁 프로젝트 구조

```
ShopLite/
├── backend/                 # Spring Boot 백엔드
│   ├── src/main/java/com/shoplite/
│   │   ├── controller/      # REST API 컨트롤러
│   │   ├── model/          # 엔티티 모델
│   │   ├── repository/     # 데이터 접근 계층
│   │   └── service/        # 비즈니스 로직
│   └── src/main/resources/
│       └── application.yml # 설정 파일
├── frontend/               # React 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── services/       # API 서비스
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🚀 실행 방법

### 1. 백엔드 실행 (Spring Boot)

```bash
# 백엔드 디렉토리로 이동
cd backend

# Maven으로 의존성 설치 및 실행
mvn spring-boot:run
```

백엔드 서버는 `http://localhost:8080`에서 실행됩니다.

### 2. 프론트엔드 실행 (React)

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

프론트엔드 서버는 `http://localhost:3000`에서 실행됩니다.

## 📋 주요 기능

### 🛍️ 고객 기능
- ✅ **회원가입/로그인** - 사용자 계정 관리
- ✅ **상품 목록 조회** - 카테고리별 상품 브라우징
- ✅ **장바구니** - 상품 담기, 수량 조절, 삭제
- ✅ **주문 처리** - 주문 생성 및 배송 정보 입력
- ✅ **주문 내역** - 과거 주문 조회 및 상태 확인

### 👨‍💼 관리자 기능
- ✅ **상품 관리** - 상품 CRUD, 재고 관리
- ✅ **주문 관리** - 주문 상태 변경, 배송 처리
- ✅ **사용자 관리** - 회원 정보, 권한 관리
- ✅ **카테고리 관리** - 상품 분류 체계 관리
- ✅ **통계 대시보드** - 매출, 주문, 사용자 분석

### API 엔드포인트

#### 상품 관리
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/products` | 모든 상품 조회 |
| GET | `/api/products/{id}` | 특정 상품 조회 |
| POST | `/api/products` | 상품 생성 |
| PUT | `/api/products/{id}` | 상품 수정 |
| DELETE | `/api/products/{id}` | 상품 삭제 |

#### 사용자 관리
| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/users/register` | 회원가입 |
| POST | `/api/users/login` | 로그인 |
| GET | `/api/users/{id}` | 사용자 정보 조회 |
| PUT | `/api/users/{id}` | 사용자 정보 수정 |

#### 장바구니
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/cart/user/{userId}` | 장바구니 조회 |
| POST | `/api/cart` | 장바구니에 상품 추가 |
| PUT | `/api/cart/{id}` | 장바구니 수량 수정 |
| DELETE | `/api/cart/{id}` | 장바구니에서 제거 |

#### 주문 관리
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/orders` | 모든 주문 조회 |
| GET | `/api/orders/user/{userId}` | 사용자별 주문 조회 |
| POST | `/api/orders` | 주문 생성 |
| PUT | `/api/orders/{id}/status` | 주문 상태 변경 |

## 🗄 데이터베이스

개발 환경에서는 H2 인메모리 데이터베이스를 사용합니다.

- **H2 Console**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:testdb`
- **Username**: `sa`
- **Password**: `password`

## 🔧 개발 환경 설정

### 필수 요구사항
- Java 17 이상
- Node.js 16 이상
- Maven 3.6 이상

### IDE 추천
- **IntelliJ IDEA** (백엔드)
- **Visual Studio Code** (프론트엔드)

## 📝 상품 모델

```java
public class Product {
    private Long id;           // 상품 ID
    private String name;       // 상품명
    private String description; // 상품 설명
    private Double price;      // 가격
    private String imageUrl;   // 이미지 URL
    private Integer stockQuantity; // 재고 수량
}
```

## 🎨 UI 특징

- **반응형 디자인**: 다양한 화면 크기 지원
- **모던한 UI**: 깔끔하고 직관적인 인터페이스
- **실시간 피드백**: 로딩 상태 및 에러 메시지 표시
- **사용자 친화적**: 직관적인 네비게이션 및 폼

## 🔄 CORS 설정

프론트엔드와 백엔드 간의 통신을 위해 CORS가 설정되어 있습니다.

```java
@CrossOrigin(origins = "http://localhost:3000")
```

## 🎯 테스트 계정

### 관리자 계정
- **이메일**: `admin@shoplite.com`
- **비밀번호**: `admin123`
- **권한**: 상품 관리, 주문 관리, 사용자 관리

### 고객 계정
- **이메일**: `customer@test.com`
- **비밀번호**: `test123`
- **권한**: 쇼핑, 장바구니, 주문

## 🚀 실행 순서

1. **백엔드 실행**: `cd backend && mvn spring-boot:run`
2. **고객용 프론트엔드**: `cd frontend && npm start` (포트 3000)
3. **관리자용 프론트엔드**: `cd admin-frontend && npm start` (포트 3001)

## 📚 추가 개발 아이디어

- ✅ 사용자 인증/인가
- ✅ 장바구니 기능
- ✅ 주문 관리
- ✅ 상품 카테고리
- ✅ 관리자 페이지
- 🔄 결제 시스템 (PG 연동)
- 🔄 검색 및 필터링 고도화
- 🔄 이미지 업로드
- 🔄 리뷰 시스템
- 🔄 쿠폰/할인 시스템
- 🔄 재고 알림
- 🔄 이메일 알림

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
