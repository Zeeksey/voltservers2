#!/bin/bash

# Fix PM2 deployment issue for VoltServers
# Fixes the ecosystem.config.js module error

echo "🔧 Fixing PM2 Configuration Issue"
echo "=================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

APP_DIR="/home/ubuntu/voltservers"

if [[ ! -d "$APP_DIR" ]]; then
    print_error "VoltServers directory not found. Run deployment first."
    exit 1
fi

cd "$APP_DIR"

# Stop any existing PM2 processes
print_status "Stopping existing PM2 processes..."
pm2 delete voltservers 2>/dev/null || true

# Create logs directory
mkdir -p logs

# Create a working PM2 config using CommonJS
print_status "Creating working PM2 configuration..."
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'voltservers',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    watch: false,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    autorestart: true
  }]
};
EOF

print_success "PM2 configuration created"

# Ensure application is built
if [[ ! -f "dist/index.js" ]]; then
    print_status "Building application..."
    npm run build
    
    if [[ ! -f "dist/index.js" ]]; then
        print_error "Build failed - cannot start application"
        exit 1
    fi
fi

# Start the application with the .cjs config
print_status "Starting VoltServers with PM2..."
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

# Check if app is running
sleep 3
if pm2 list | grep -q "voltservers.*online"; then
    print_success "VoltServers started successfully"
else
    print_error "VoltServers failed to start"
    pm2 logs voltservers --lines 10
    exit 1
fi

# Test the application
print_status "Testing application..."
sleep 2

if curl -f -s http://localhost:5000 > /dev/null; then
    print_success "Application responding on port 5000"
else
    print_error "Application not responding on port 5000"
    pm2 logs voltservers --lines 5
fi

# Display status
print_status "Current PM2 status:"
pm2 status

echo ""
print_success "PM2 configuration fixed!"
echo ""
echo "🌐 Your VoltServers should now be accessible at:"
echo "   http://135.148.137.158"
echo ""
echo "🔧 Useful commands:"
echo "   pm2 status              - Check app status"
echo "   pm2 logs voltservers    - View app logs"
echo "   pm2 restart voltservers - Restart app"
echo ""

# Final verification
if curl -f -s http://135.148.137.158 > /dev/null; then
    print_success "External access confirmed - deployment complete!"
else
    echo "Note: If external access isn't working, check Nginx configuration"
fi