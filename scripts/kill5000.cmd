@echo off
set PORT=5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo ⚠️ Killing process on port %PORT% (PID: %%a)...
    taskkill /PID %%a /F
    echo ✅ Process killed.
    exit /b
)
echo ✅ No process is using port %PORT%.
