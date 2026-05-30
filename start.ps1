# ============================================================
# AUTO-RUN SCRIPT - Laravel + React App
# ============================================================
# Jalankan dengan: powershell -ExecutionPolicy Bypass -File start.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$ReactDir = Join-Path $ProjectRoot "laravel_api_react"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   AUTO-RUN: Laravel API + React App" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# ---------- 1. Setup .env ----------
Write-Host "[1/6] Mengecek file .env..." -ForegroundColor Yellow
if (!(Test-Path (Join-Path $ProjectRoot ".env"))) {
    Copy-Item (Join-Path $ProjectRoot ".env.example") (Join-Path $ProjectRoot ".env")
    Write-Host "      .env dibuat dari .env.example" -ForegroundColor Green
} else {
    Write-Host "      .env sudah ada, skip." -ForegroundColor Green
}

# ---------- 2. Composer Install ----------
Write-Host "[2/6] Menginstall Composer dependencies..." -ForegroundColor Yellow
Set-Location $ProjectRoot
if (!(Test-Path (Join-Path $ProjectRoot "vendor"))) {
    composer install --no-interaction
} else {
    Write-Host "      vendor/ sudah ada, skip." -ForegroundColor Green
}

# ---------- 3. Generate App Key ----------
Write-Host "[3/6] Generate App Key Laravel..." -ForegroundColor Yellow
$envContent = Get-Content (Join-Path $ProjectRoot ".env") -Raw
if ($envContent -match "APP_KEY=$" -or $envContent -match "APP_KEY=\s*$") {
    php artisan key:generate --ansi
} else {
    Write-Host "      APP_KEY sudah di-set, skip." -ForegroundColor Green
}

# ---------- 4. Database Setup ----------
Write-Host "[4/6] Setup Database..." -ForegroundColor Yellow
$dbPath = Join-Path $ProjectRoot "database\database.sqlite"
if (!(Test-Path $dbPath)) {
    New-Item -ItemType File -Path $dbPath -Force | Out-Null
    Write-Host "      File SQLite dibuat." -ForegroundColor Green
}
php artisan migrate --force --ansi

# ---------- 5. NPM Install (React) ----------
Write-Host "[5/6] Menginstall NPM dependencies (React)..." -ForegroundColor Yellow
if (!(Test-Path (Join-Path $ReactDir "node_modules"))) {
    Set-Location $ReactDir
    npm install
    Set-Location $ProjectRoot
} else {
    Write-Host "      node_modules sudah ada, skip." -ForegroundColor Green
}

# ---------- 6. Jalankan Server ----------
Write-Host "[6/6] Menjalankan server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   Laravel API  -> http://localhost:8000" -ForegroundColor White
Write-Host "   React App    -> http://localhost:5173" -ForegroundColor White
Write-Host "   Tekan Ctrl+C untuk menghentikan semua server" -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Jalankan Laravel dan React secara bersamaan
Set-Location $ProjectRoot

$laravelJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    php artisan serve
} -ArgumentList $ProjectRoot

$reactJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList $ReactDir

Write-Host "  Laravel server dimulai (PID Job: $($laravelJob.Id))..." -ForegroundColor Green
Write-Host "  React dev server dimulai (PID Job: $($reactJob.Id))..." -ForegroundColor Green
Write-Host ""
Write-Host "  Menampilkan output server (Ctrl+C untuk berhenti):" -ForegroundColor Gray
Write-Host ""

try {
    while ($true) {
        # Tampilkan output dari kedua job
        $laravelOutput = Receive-Job -Job $laravelJob
        $reactOutput = Receive-Job -Job $reactJob

        if ($laravelOutput) {
            foreach ($line in $laravelOutput) {
                Write-Host "[Laravel] $line" -ForegroundColor Magenta
            }
        }
        if ($reactOutput) {
            foreach ($line in $reactOutput) {
                Write-Host "[React]   $line" -ForegroundColor Blue
            }
        }

        # Cek apakah job masih berjalan
        if ($laravelJob.State -eq "Failed") {
            Write-Host "[ERROR] Laravel server berhenti!" -ForegroundColor Red
            Receive-Job -Job $laravelJob | Write-Host
            break
        }
        if ($reactJob.State -eq "Failed") {
            Write-Host "[ERROR] React server berhenti!" -ForegroundColor Red
            Receive-Job -Job $reactJob | Write-Host
            break
        }

        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host ""
    Write-Host "Menghentikan semua server..." -ForegroundColor Yellow
    Stop-Job -Job $laravelJob -ErrorAction SilentlyContinue
    Stop-Job -Job $reactJob -ErrorAction SilentlyContinue
    Remove-Job -Job $laravelJob -ErrorAction SilentlyContinue
    Remove-Job -Job $reactJob -ErrorAction SilentlyContinue
    Write-Host "Semua server dihentikan." -ForegroundColor Green
}
