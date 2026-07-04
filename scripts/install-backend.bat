@echo off
if exist "%~dp0..\backend\go.sum" (
    echo Backend dependencies already downloaded.
) else (
    echo Downloading backend dependencies...
    cd /d "%~dp0..\backend"
    call go mod download
)