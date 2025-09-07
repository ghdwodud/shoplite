@echo off
echo ========================================
echo  ShopLite Backend - 테스트환경 실행
echo  Database: H2 In-Memory
echo ========================================
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=test
pause



