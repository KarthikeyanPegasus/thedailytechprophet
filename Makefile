.PHONY: start start-frontend start-backend stop clean urls install install-frontend install-backend

PID_DIR := .pids
SHELL := cmd
SHELLFLAGS := /C

FRONTEND_PORT ?= 3000
BACKEND_PORT  ?= 8080

start: install start-frontend start-backend urls
	@echo "Frontend and backend started."

start-frontend:
	@if not exist $(PID_DIR) mkdir $(PID_DIR)
	@echo "Starting frontend on port $(FRONTEND_PORT)..."
	@cmd /C "set FRONTEND_PORT=$(FRONTEND_PORT)&& call scripts\start-frontend.bat"

start-backend:
	@if not exist $(PID_DIR) mkdir $(PID_DIR)
	@echo "Starting backend on port $(BACKEND_PORT)..."
	@cmd /C "set BACKEND_PORT=$(BACKEND_PORT)&& call scripts\start-backend.bat"

urls:
	@echo.
	@echo ============================================
	@echo   Frontend:  http://localhost:$(FRONTEND_PORT)
	@echo   Backend:   http://localhost:$(BACKEND_PORT)
	@echo ============================================
	@echo.

install: install-frontend install-backend

install-frontend:
	@cmd /C "call scripts\install-frontend.bat"

install-backend:
	@cmd /C "call scripts\install-backend.bat"

stop:
	@echo "Stopping services..."
	@taskkill /F /IM node.exe 2>NUL
	@taskkill /F /IM go.exe 2>NUL
	@echo "Stopped."

clean: stop
	@if exist $(PID_DIR) rmdir /S /Q $(PID_DIR)
	@echo "Cleaned."