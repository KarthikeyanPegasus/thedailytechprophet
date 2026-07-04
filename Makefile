.PHONY: start start-frontend start-backend stop clean

PID_DIR := .pids

start: start-frontend start-backend
	@echo "Frontend and backend started."

start-frontend:
	@mkdir -p $(PID_DIR)
	@echo "Starting frontend..."
	@cd frontend && nohup npm run dev > ../$(PID_DIR)/frontend.log 2>&1 & echo $$! > $(PID_DIR)/frontend.pid

start-backend:
	@mkdir -p $(PID_DIR)
	@echo "Starting backend..."
	@cd backend && nohup go run ./cmd/server > ../$(PID_DIR)/backend.log 2>&1 & echo $$! > $(PID_DIR)/backend.pid

stop:
	@echo "Stopping services..."
	@if [ -f $(PID_DIR)/frontend.pid ]; then kill $$(cat $(PID_DIR)/frontend.pid) 2>/dev/null; rm $(PID_DIR)/frontend.pid; fi
	@if [ -f $(PID_DIR)/backend.pid ]; then kill $$(cat $(PID_DIR)/backend.pid) 2>/dev/null; rm $(PID_DIR)/backend.pid; fi
	@echo "Stopped."

clean: stop
	@rm -rf $(PID_DIR)
	@echo "Cleaned."
