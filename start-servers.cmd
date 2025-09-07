@echo off
echo ========================================
echo  ShopLite 서버 시작 스크립트
echo ========================================

REM Java 환경 설정
set "JAVA_HOME=C:\Program Files\Java\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Java 버전 확인:
java -version

echo.
echo 백엔드 서버 시작 중...
cd backend
start "Backend Server" cmd /k "mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev"

echo.
echo 잠시 대기 중... (백엔드 시작 대기)
timeout /t 10 /nobreak

echo.
echo 프론트엔드 서버 시작 중...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo  서버 시작 완료!
echo  프론트엔드: http://localhost:3000
echo  백엔드 API: http://localhost:8080
echo ========================================
pause


