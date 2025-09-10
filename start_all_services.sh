#!/bin/bash

# Training System v2 - Service Management Script
# This script checks for port conflicts, cleans up existing processes, and starts all services

set -e

# Configuration
FRONTEND_PORT=3000
BACKEND_PORT=8000
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to find project root
find_project_root() {
    local current_dir="$SCRIPT_DIR"
    
    # If we're already in knowledge-center, use current directory
    if [[ "$current_dir" == *"knowledge-center" ]] && [ -d "$current_dir/frontend" ] && [ -d "$current_dir/backend" ]; then
        echo "$current_dir"
        return 0
    fi
    
    # Look for knowledge-center directory in current location
    if [ -d "$current_dir/knowledge-center" ] && [ -d "$current_dir/knowledge-center/frontend" ] && [ -d "$current_dir/knowledge-center/backend" ]; then
        echo "$current_dir/knowledge-center"
        return 0
    fi
    
    # Search parent directories
    local search_dir="$current_dir"
    for i in {1..5}; do
        search_dir="$(dirname "$search_dir")"
        if [ -d "$search_dir/knowledge-center" ] && [ -d "$search_dir/knowledge-center/frontend" ] && [ -d "$search_dir/knowledge-center/backend" ]; then
            echo "$search_dir/knowledge-center"
            return 0
        fi
    done
    
    return 1
}

PROJECT_ROOT=$(find_project_root)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    local process_info=$(lsof -ti:$port 2>/dev/null || true)
    echo "$process_info"
}

# Function to kill process on port
kill_process_on_port() {
    local port=$1
    local pids=$(check_port $port)
    
    if [ -n "$pids" ]; then
        log_warning "Port $port is occupied by process(es): $pids"
        echo "$pids" | xargs -r kill -TERM 2>/dev/null || true
        sleep 2
        
        # Force kill if still running
        local remaining_pids=$(check_port $port)
        if [ -n "$remaining_pids" ]; then
            log_warning "Force killing remaining processes on port $port: $remaining_pids"
            echo "$remaining_pids" | xargs -r kill -KILL 2>/dev/null || true
            sleep 1
        fi
        
        log_success "Cleaned up processes on port $port"
    fi
}

# Function to cleanup all related processes
cleanup_all() {
    log_info "Cleaning up all training system processes..."
    
    # Kill processes by port
    kill_process_on_port $FRONTEND_PORT
    kill_process_on_port $BACKEND_PORT
    
    # Kill by process name patterns
    pkill -f "yarn dev" 2>/dev/null || true
    pkill -f "next-server" 2>/dev/null || true
    pkill -f "uvicorn" 2>/dev/null || true
    pkill -f "python.*run.py" 2>/dev/null || true
    pkill -f "node.*next" 2>/dev/null || true
    
    sleep 2
    log_success "Process cleanup completed"
}

# Function to verify prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if project root was found
    if [ -z "$PROJECT_ROOT" ]; then
        log_error "knowledge-center project directory not found."
        log_info "Please run this script from within the knowledge-center project or its parent directory."
        exit 1
    fi
    
    log_info "Project root found: $PROJECT_ROOT"
    
    # Check for required tools
    local missing_tools=()
    
    if ! command -v node >/dev/null 2>&1; then
        missing_tools+=("node")
    fi
    
    if ! command -v yarn >/dev/null 2>&1; then
        missing_tools+=("yarn")
    fi
    
    if ! command -v python3 >/dev/null 2>&1; then
        missing_tools+=("python3")
    fi
    
    if ! command -v uv >/dev/null 2>&1; then
        missing_tools+=("uv")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        log_info "Please install the missing tools and try again."
        exit 1
    fi
    
    log_success "All prerequisites satisfied"
}

# Function to check port availability after cleanup
verify_ports_free() {
    log_info "Verifying ports are available..."
    
    local frontend_pids=$(check_port $FRONTEND_PORT)
    local backend_pids=$(check_port $BACKEND_PORT)
    
    if [ -n "$frontend_pids" ]; then
        log_error "Port $FRONTEND_PORT is still occupied after cleanup"
        return 1
    fi
    
    if [ -n "$backend_pids" ]; then
        log_error "Port $BACKEND_PORT is still occupied after cleanup"
        return 1
    fi
    
    log_success "Ports $FRONTEND_PORT and $BACKEND_PORT are available"
}

# Function to start backend service
start_backend() {
    log_info "Starting FastAPI backend on port $BACKEND_PORT..."
    
    cd "$PROJECT_ROOT/backend"
    
    # Check if virtual environment exists
    if [ ! -d ".venv" ]; then
        log_warning "Virtual environment not found, creating..."
        uv sync
    fi
    
    # Start backend in background
    nohup uv run python run.py > "$PROJECT_ROOT/backend.log" 2>&1 &
    local backend_pid=$!
    echo $backend_pid > "$PROJECT_ROOT/backend.pid"
    
    # Wait for backend to start
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:$BACKEND_PORT/ >/dev/null 2>&1; then
            log_success "Backend started successfully (PID: $backend_pid)"
            cd "$SCRIPT_DIR"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
        echo -n "."
    done
    
    log_error "Backend failed to start within 30 seconds"
    cd "$SCRIPT_DIR"
    return 1
}

# Function to start frontend service
start_frontend() {
    log_info "Starting NextJS frontend on port $FRONTEND_PORT..."
    
    cd "$PROJECT_ROOT/frontend"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log_warning "Node modules not found, installing..."
        yarn install
    fi
    
    # Start frontend in background
    nohup yarn dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
    local frontend_pid=$!
    echo $frontend_pid > "$PROJECT_ROOT/frontend.pid"
    
    # Wait for frontend to start
    local max_attempts=60
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:$FRONTEND_PORT/ >/dev/null 2>&1; then
            log_success "Frontend started successfully (PID: $frontend_pid)"
            cd "$SCRIPT_DIR"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
        echo -n "."
    done
    
    log_error "Frontend failed to start within 60 seconds"
    cd "$SCRIPT_DIR"
    return 1
}

# Function to show service status
show_status() {
    echo ""
    log_info "Service Status:"
    echo "=================="
    
    local backend_pid=""
    local frontend_pid=""
    
    if [ -f "$PROJECT_ROOT/backend.pid" ]; then
        backend_pid=$(cat "$PROJECT_ROOT/backend.pid" 2>/dev/null || true)
    fi
    
    if [ -f "$PROJECT_ROOT/frontend.pid" ]; then
        frontend_pid=$(cat "$PROJECT_ROOT/frontend.pid" 2>/dev/null || true)
    fi
    
    # Check backend
    if [ -n "$backend_pid" ] && kill -0 "$backend_pid" 2>/dev/null; then
        log_success "Backend: Running (PID: $backend_pid) - http://localhost:$BACKEND_PORT"
    else
        log_error "Backend: Not running"
    fi
    
    # Check frontend
    if [ -n "$frontend_pid" ] && kill -0 "$frontend_pid" 2>/dev/null; then
        log_success "Frontend: Running (PID: $frontend_pid) - http://localhost:$FRONTEND_PORT"
    else
        log_error "Frontend: Not running"
    fi
    
    echo ""
    log_info "API Documentation: http://localhost:$BACKEND_PORT/docs"
    log_info "Log files: $PROJECT_ROOT/backend.log, $PROJECT_ROOT/frontend.log"
}

# Function to handle cleanup on exit
cleanup_on_exit() {
    log_warning "Received interrupt signal, cleaning up..."
    cleanup_all
    exit 0
}

# Main execution
main() {
    echo "🚀 Training System v2 - Service Manager"
    echo "======================================"
    
    # Set up interrupt handler
    trap cleanup_on_exit INT TERM
    
    # Check prerequisites
    check_prerequisites
    
    # Cleanup existing processes
    cleanup_all
    
    # Verify ports are free
    if ! verify_ports_free; then
        log_error "Unable to free required ports. Exiting."
        exit 1
    fi
    
    # Start services
    cd "$SCRIPT_DIR"
    
    if ! start_backend; then
        log_error "Failed to start backend service"
        exit 1
    fi
    
    if ! start_frontend; then
        log_error "Failed to start frontend service"
        cleanup_all
        exit 1
    fi
    
    # Show final status
    show_status
    
    echo ""
    log_success "All services started successfully!"
    log_info "Press Ctrl+C to stop all services"
    
    # Keep script running and monitor services
    while true; do
        sleep 10
        
        # Check if services are still running
        local backend_pid=$(cat "$PROJECT_ROOT/backend.pid" 2>/dev/null || true)
        local frontend_pid=$(cat "$PROJECT_ROOT/frontend.pid" 2>/dev/null || true)
        
        if [ -n "$backend_pid" ] && ! kill -0 "$backend_pid" 2>/dev/null; then
            log_error "Backend service stopped unexpectedly"
            cleanup_all
            exit 1
        fi
        
        if [ -n "$frontend_pid" ] && ! kill -0 "$frontend_pid" 2>/dev/null; then
            log_error "Frontend service stopped unexpectedly"
            cleanup_all
            exit 1
        fi
    done
}

# Run main function
main "$@"