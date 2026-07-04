@echo off
if exist "%~dp0..\frontend\node_modules" (
    echo Frontend dependencies already installed.
) else (
    echo Installing frontend dependencies...
    cd /d "%~dp0..\frontend"
    call npm install
)