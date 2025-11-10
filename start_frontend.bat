@echo off
echo ========================================
echo Starting Smart Field Frontend
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install

echo.
echo Starting Vite development server...
echo Frontend will be available at http://localhost:5173
echo.

call npm run dev

pause
