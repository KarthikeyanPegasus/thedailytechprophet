@echo off
setlocal
if not "%BACKEND_PORT%"=="" set PORT=%BACKEND_PORT%
cd /d "%~dp0..\backend"
call go run ./cmd/server > "%~dp0..\.pids\backend.log" 2>&1