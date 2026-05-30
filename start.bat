@echo off
:: ============================================================
:: AUTO-RUN SCRIPT - Laravel + React App (with Docker MySQL)
:: ============================================================
:: Jalankan dengan: start.bat
:: ============================================================

title Laravel + React Auto-Run

echo.
echo ============================================================
echo    AUTO-RUN: Laravel API + React App
echo    MySQL via Docker ^| PhpMyAdmin ^| Laravel ^| React
echo ============================================================
echo.

cd /d "%~dp0"

:: ---------- 1. Cek .env ----------
echo [1/7] Mengecek file .env...
if not exist ".env" (
    copy ".env.example" ".env"
    echo       .env dibuat dari .env.example
) else (
    echo       .env sudah ada.
)

:: ---------- 2. Composer Install ----------
echo [2/7] Mengecek Composer dependencies...
if not exist "vendor" (
    echo       Menginstall... tunggu sebentar.
    composer install --no-interaction
) else (
    echo       vendor/ sudah ada, skip.
)

:: ---------- 3. App Key ----------
echo [3/7] Memastikan App Key ada...
for /f "tokens=2 delims==" %%a in ('findstr "APP_KEY=" ".env"') do set APPKEY=%%a
if "%APPKEY%"=="" (
    php artisan key:generate --ansi
) else (
    echo       APP_KEY sudah ada, skip.
)

:: ---------- 4. Docker MySQL ----------
echo [4/7] Menjalankan MySQL via Docker...
docker-compose up -d mysql phpmyadmin
if %errorlevel% neq 0 (
    echo [ERROR] Docker gagal! Pastikan Docker Desktop sudah berjalan.
    pause
    exit /b 1
)
echo       Menunggu MySQL siap...
:wait_mysql
docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>nul
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto wait_mysql
)
echo       MySQL siap!

:: ---------- 5. Database Migrate ----------
echo [5/7] Menjalankan database migration...
php artisan migrate --force --ansi

:: ---------- 6. NPM Install React ----------
echo [6/7] Mengecek NPM dependencies (React)...
if not exist "laravel_api_react\node_modules" (
    echo       Menginstall npm packages...
    cd laravel_api_react
    npm install
    cd ..
) else (
    echo       node_modules sudah ada, skip.
)

:: ---------- 7. Jalankan Server ----------
echo.
echo ============================================================
echo    Semua service siap!
echo.
echo    Laravel API   -^> http://localhost:8000
echo    React App     -^> http://localhost:5173
echo    PhpMyAdmin    -^> http://localhost:8080
echo    MySQL         -^> localhost:3307
echo.
echo    Tutup terminal Laravel/React untuk menghentikan server.
echo    Jalankan "docker-compose down" untuk stop MySQL+PhpMyAdmin.
echo ============================================================
echo.

:: Buka terminal baru untuk Laravel
start "Laravel Server" cmd /k "cd /d %~dp0 && php artisan serve"

:: Buka terminal baru untuk React
start "React Dev Server" cmd /k "cd /d %~dp0laravel_api_react && npm run dev"

echo    Kedua server berjalan di terminal terpisah!
echo    Tekan Enter untuk keluar dari script ini...
pause >nul
