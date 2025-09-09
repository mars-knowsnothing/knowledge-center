# Service Management Scripts Usage Guide

## ✅ **Fixed Issues**
- **Smart Project Detection**: Scripts now automatically find the project root from any location
- **Path Resolution**: Works from any directory within or above the training-system-v2 project
- **Backend Import Fix**: Corrected Python import paths for proper FastAPI startup

## 🚀 **Usage Examples**

### From Project Root
```bash
cd /path/to/training-system-v2
./start_all_services.sh    # Start all services
./stop_all_services.sh     # Stop all services
```

### From Subdirectories  
```bash
cd /path/to/training-system-v2/backend
../start_all_services.sh   # Works!

cd /path/to/training-system-v2/frontend  
../start_all_services.sh   # Works!
```

### From Parent Directory
```bash
cd /path/to/parent-of-training-system-v2
training-system-v2/start_all_services.sh   # Works!
```

## 🔧 **What the Scripts Do**

### start_all_services.sh
1. **Smart Project Location**: Automatically finds training-system-v2 directory
2. **Prerequisites Check**: Verifies node, yarn, python3, uv installation  
3. **Port Cleanup**: Kills any processes using ports 3000 & 8000
4. **Service Startup**: Starts backend (port 8000) and frontend (port 3000)
5. **Health Monitoring**: Continuously monitors service health
6. **Log Management**: Creates backend.log and frontend.log files
7. **Graceful Shutdown**: Handles Ctrl+C properly

### stop_all_services.sh
1. **Process Discovery**: Finds all training system processes
2. **Graceful Shutdown**: SIGTERM first, then SIGKILL if needed
3. **Port Verification**: Confirms ports 3000 & 8000 are freed
4. **File Cleanup**: Removes PID files and log files
5. **Status Report**: Shows detailed cleanup results

## 📊 **Service URLs**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Docs**: http://localhost:8000/docs

## 🎯 **Key Features**
- ✅ **Works from anywhere** within the project hierarchy
- ✅ **Colored output** for better readability
- ✅ **Comprehensive error handling** with detailed messages
- ✅ **Port conflict resolution** with automatic cleanup
- ✅ **Service health monitoring** with restart capability
- ✅ **Complete cleanup** leaving no orphaned processes

## 🔍 **Troubleshooting**
If services fail to start, check the log files:
- `training-system-v2/backend.log` - Backend errors
- `training-system-v2/frontend.log` - Frontend errors

The scripts will automatically detect and resolve most common issues like port conflicts and missing dependencies.