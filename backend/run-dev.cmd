@echo off
echo ========================================
echo  ShopLite Backend - 개발환경 실행
echo  Database: SQLite
echo ========================================
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
pause



