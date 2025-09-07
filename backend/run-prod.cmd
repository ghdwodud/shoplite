@echo off
echo ========================================
echo  ShopLite Backend - 운영환경 실행
echo  Database: PostgreSQL
echo ========================================
echo PostgreSQL 서버가 실행 중인지 확인하세요!
echo.
set /p confirm=계속하시겠습니까? (y/N): 
if /i "%confirm%" neq "y" goto :end

mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=prod

:end
pause



