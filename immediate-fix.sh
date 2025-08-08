#!/bin/bash

# Immediate fix for 502 Bad Gateway - VoltServers not responding on port 5000

echo "🔧 Fixing 502 Bad Gateway - Starting VoltServers Application"
echo "=========================================================="

APP_DIR="/home/ubuntu/voltservers"
cd "$APP_DIR" || exit 1

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "Not in VoltServers directory. Run: cd /home/ubuntu/voltservers"
    exit 1
fi

# Stop any existing processes
print_status "Stopping existing processes..."
pm2 delete all 2>/dev/null || true
pkill -f "node.*dist/index.js" 2>/dev/null || true

# Check if app is built
if [[ ! -f "dist/index.js" ]]; then
    print_status "Building application..."
    npm run build
    
    if [[ ! -f "dist/index.js" ]]; then
        print_error "Build failed"
        exit 1
    fi
fi

# Create simple PM2 config
print_status "Creating PM2 configuration..."
cat > ecosystem.production.js << 'EOF'
module.exports = {
  apps: [{
    name: 'voltservers',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start application
print_status "Starting VoltServers application..."
pm2 start ecosystem.production.js

# Wait for startup
sleep 5

# Check if application is responding
print_status "Testing application..."
if curl -f -s http://localhost:5000 > /dev/null; then
    print_success "VoltServers is responding on port 5000"
else
    print_error "VoltServers is not responding on port 5000"
    print_status "Checking PM2 logs..."
    pm2 logs voltservers --lines 10
    exit 1
fi

# Test external access
if curl -f -s http://135.148.137.158 > /dev/null; then
    print_success "External access working - 502 error fixed!"
else
    print_status "Nginx may need restart..."
    sudo systemctl restart nginx
    sleep 3
    
    if curl -f -s http://135.148.137.158 > /dev/null; then
        print_success "External access working after nginx restart!"
    else
        print_error "Still having issues - check nginx configuration"
    fi
fi

# Save PM2 configuration
pm2 save

# Show status
print_status "Application status:"
pm2 status

echo ""
print_success "Fix completed!"
echo "VoltServers should now be accessible at: http://135.148.137.158"