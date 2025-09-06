# 백엔드 실행 방법

## 방법 1: IntelliJ IDEA 사용 (권장)

1. IntelliJ IDEA에서 `backend` 폴더를 프로젝트로 열기
2. `src/main/java/com/shoplite/ShopLiteApplication.java` 파일 열기
3. `main` 메서드 옆의 ▶️ 버튼 클릭하여 실행

## 방법 2: VS Code 사용

1. VS Code에서 `backend` 폴더 열기
2. Java Extension Pack 설치
3. `Ctrl+Shift+P` → "Java: Run" 선택
4. `ShopLiteApplication` 선택

## 방법 3: Maven 설치 후 실행

1. Maven 다운로드: https://maven.apache.org/download.cgi
2. 환경변수 PATH에 Maven bin 폴더 추가
3. 터미널에서 `mvn spring-boot:run` 실행

## 실행 확인

- 브라우저에서 `http://localhost:8080/api/products` 접속
- JSON 데이터가 표시되면 정상 실행

## 문제 해결

- 포트 8080이 이미 사용 중이면 `application.yml`에서 포트 변경
- H2 콘솔: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: `password`


