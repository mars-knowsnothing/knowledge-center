#!/bin/bash

# Training System v2 - Stop All Services Script
# This script stops all training system services and cleans up processes

set -e

# Configuration
FRONTEND_PORT=3000
BACKEND_PORT=8000
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to find project root
find_project_root() {
    local current_dir="$SCRIPT_DIR"
    
    # If we're already in training-system-v2, use current directory
    if [[ "$current_dir" == *"training-system-v2" ]] && [ -d "$current_dir/frontend" ] && [ -d "$current_dir/backend" ]; then
        echo "$current_dir"
        return 0
    fi
    
    # Look for training-system-v2 directory in current location
    if [ -d "$current_dir/training-system-v2" ] && [ -d "$current_dir/training-system-v2/frontend" ] && [ -d "$current_dir/training-system-v2/backend" ]; then
        echo "$current_dir/training-system-v2"
        return 0
    fi
    
    # Search parent directories
    local search_dir="$current_dir"
    for i in {1..5}; do
        search_dir="$(dirname "$search_dir")"
        if [ -d "$search_dir/training-system-v2" ] && [ -d "$search_dir/training-system-v2/frontend" ] && [ -d "$search_dir/training-system-v2/backend" ]; then
            echo "$search_dir/training-system-v2"
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
    local service_name=$2
    local pids=$(check_port $port)
    
    if [ -n "$pids" ]; then
        log_info "Stopping $service_name on port $port (PIDs: $pids)"
        echo "$pids" | xargs -r kill -TERM 2>/dev/null || true
        sleep 3
        
        # Force kill if still running
        local remaining_pids=$(check_port $port)
        if [ -n "$remaining_pids" ]; then
            log_warning "Force killing remaining $service_name processes: $remaining_pids"
            echo "$remaining_pids" | xargs -r kill -KILL 2>/dev/null || true
            sleep 1
        fi
        
        log_success "$service_name stopped"
    else
        log_info "$service_name not running on port $port"
    fi
}

# Function to stop service by PID file
stop_service_by_pid() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file" 2>/dev/null || true)
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            log_info "Stopping $service_name (PID: $pid)"
            kill -TERM "$pid" 2>/dev/null || true
            sleep 3
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                log_warning "Force killing $service_name (PID: $pid)"
                kill -KILL "$pid" 2>/dev/null || true
                sleep 1
            fi
            
            log_success "$service_name stopped"
        else
            log_info "$service_name not running (invalid PID)"
        fi
        
        # Remove PID file
        rm -f "$pid_file"
    else
        log_info "$service_name PID file not found"
    fi
}

# Function to cleanup all related processes
cleanup_all() {
    log_info "Stopping all Training System services..."
    echo "======================================="
    
    # Check if project root was found
    if [ -z "$PROJECT_ROOT" ]; then
        log_error "training-system-v2 project directory not found."
        log_info "Please run this script from within the training-system-v2 project or its parent directory."
        exit 1
    fi
    
    log_info "Project root found: $PROJECT_ROOT"
    
    # Stop services by PID files first
    stop_service_by_pid "Backend" "$PROJECT_ROOT/backend.pid"
    stop_service_by_pid "Frontend" "$PROJECT_ROOT/frontend.pid"
    
    # Kill processes by port
    kill_process_on_port $BACKEND_PORT "Backend"
    kill_process_on_port $FRONTEND_PORT "Frontend"
    
    # Kill by process name patterns
    log_info "Cleaning up remaining processes..."
    
    local killed_processes=()
    
    if pkill -f "yarn dev" 2>/dev/null; then
        killed_processes+=("yarn dev")
    fi
    
    if pkill -f "next-server" 2>/dev/null; then
        killed_processes+=("next-server")
    fi
    
    if pkill -f "uvicorn" 2>/dev/null; then
        killed_processes+=("uvicorn")
    fi
    
    if pkill -f "python.*run.py" 2>/dev/null; then
        killed_processes+=("python run.py")
    fi
    
    if pkill -f "node.*next" 2>/dev/null; then
        killed_processes+=("node next")
    fi
    
    if [ ${#killed_processes[@]} -gt 0 ]; then
        log_warning "Killed additional processes: ${killed_processes[*]}"
    fi
    
    sleep 2
    
    # Clean up log files
    if [ -f "$PROJECT_ROOT/backend.log" ]; then
        rm -f "$PROJECT_ROOT/backend.log"
        log_info "Removed backend.log"
    fi
    
    if [ -f "$PROJECT_ROOT/frontend.log" ]; then
        rm -f "$PROJECT_ROOT/frontend.log"
        log_info "Removed frontend.log"
    fi
    
    log_success "All services stopped and cleaned up"
}

# Function to show final status
show_final_status() {
    echo ""
    log_info "Final Status Check:"
    echo "==================="
    
    local backend_pids=$(check_port $BACKEND_PORT)
    local frontend_pids=$(check_port $FRONTEND_PORT)
    
    if [ -z "$backend_pids" ]; then
        log_success "Port $BACKEND_PORT is free"
    else
        log_warning "Port $BACKEND_PORT still has processes: $backend_pids"
    fi
    
    if [ -z "$frontend_pids" ]; then
        log_success "Port $FRONTEND_PORT is free"
    else
        log_warning "Port $FRONTEND_PORT still has processes: $frontend_pids"
    fi
    
    # Check for any remaining training system processes
    local remaining_processes=$(pgrep -f "training-system\|uvicorn\|yarn dev\|next-server" 2>/dev/null || true)
    if [ -z "$remaining_processes" ]; then
        log_success "No remaining training system processes found"
    else
        log_warning "Some training system processes may still be running: $remaining_processes"
    fi
}

# Main execution
main() {
    echo "🛑 Training System v2 - Stop All Services"
    echo "=========================================="
    
    # Perform cleanup
    cleanup_all
    
    # Show final status
    show_final_status
    
    echo ""
    log_success "All Training System services have been stopped!"
    log_info "You can now start the services again with: ./start_all_services.sh"
}

# Run main function
main "$@"