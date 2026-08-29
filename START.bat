@echo off
chcp 65001 >nul
title English Master IELTS
cd /d "%~dp0"

echo ============================================
echo   English Master IELTS - Dang khoi dong...
echo ============================================
echo.

REM Kiem tra Node.js
where node >nul 2>nul
if errorlevel 1 (
  echo [LOI] Khong tim thay Node.js.
  echo Hay cai Node.js tai https://nodejs.org roi chay lai.
  echo.
  pause
  exit /b 1
)

REM Cai dependencies neu chua co
if not exist "node_modules" (
  echo [1/2] Lan dau chay - dang cai dat thu vien...
  call npm install
  if errorlevel 1 (
    echo [LOI] Cai dat that bai.
    pause
    exit /b 1
  )
)

REM Build ban moi nhat
echo [1/2] Dang build ban moi nhat...
call npm run build
if errorlevel 1 (
  echo [LOI] Build that bai.
  pause
  exit /b 1
)

REM Chay server offline va tu mo trinh duyet
echo.
echo [2/2] Mo web... (de dong app, dong cua so nay)
echo.
call npm run preview -- --open --port 4173

pause
