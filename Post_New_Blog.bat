@echo off
setlocal
cd /d "%~dp0"
echo --- LottoGen New Blog Post Creator ---
echo.
echo Step 1: Python environment check...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python to run the script.
    pause
    exit /b 1
)

echo Step 2: Running blog posting script...
python scripts/add_post.py

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Something went wrong while creating the post.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Your post has been created! 
echo Don't forget to push and deploy to see it online.
echo.
pause
