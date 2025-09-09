#!/bin/bash

# Training System v2 - Development Script
# This script starts both frontend and backend in development mode

set -e

echo "🚀 Starting Training System v2 Development Environment"

# Check if we're in the right directory
if [ ! -d "training-system-v2" ]; then
    echo "❌ Error: Please run this script from the directory containing training-system-v2/"
    exit 1
fi

cd training-system-v2

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Shutting down services..."
    jobs -p | xargs -r kill
    exit
}
trap cleanup EXIT INT TERM

# Start backend
echo "🔧 Starting FastAPI backend..."
cd backend
uv run python run.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting NextJS frontend..."
cd frontend
yarn dev &
FRONTEND_PID=$!
cd ..

echo "✅ Both services are starting..."
echo "📊 Backend API: http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for any process to exit
wait