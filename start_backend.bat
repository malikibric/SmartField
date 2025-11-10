@echo off
echo ========================================
echo Starting Smart Field AI Backend
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting Flask server...
echo Backend will be available at http://localhost:5000
echo.

python ai_backend_with_llm.py

pause
