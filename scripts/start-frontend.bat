@echo off
if "%FRONTEND_PORT%"=="" set FRONTEND_PORT=3000
cd /d "%~dp0..\frontend"
if not exist "%~dp0..\.pids" mkdir "%~dp0..\.pids"
powershell -NoProfile -Command "Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','set','PORT=%FRONTEND_PORT%&&npm','run','dev' -WorkingDirectory '%CD%' -RedirectStandardOutput '%~dp0..\.pids\frontend.log' -RedirectStandardError '%~dp0..\.pids\frontend.err' -WindowStyle Hidden"