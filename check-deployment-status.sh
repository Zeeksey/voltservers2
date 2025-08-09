#!/bin/bash

# Check deployment status and diagnose 502 error

echo "🔍 VoltServers Deployment Status Check"
echo "======================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_check() { echo -e "${GREEN}✓${NC} $1"; }
print_fail() { echo -e "${RED}✗${NC} $1"; }
print_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }

APP_DIR="/home/ubuntu/voltservers"

echo "1. Directory and Files Check:"
if [[ -d "$APP_DIR" ]]; then
    print_check "VoltServers directory exists"
    cd "$APP_DIR"
    
    if [[ -f "package.json" ]]; then
        print_check "package.json exists"
    else
        print_fail "package.json missing"
    fi
    
    if [[ -f "dist/index.js" ]]; then
        print_check "Application is built (dist/index.js exists)"
    else
        print_fail "Application not built - run: npm run build"
    fi
    
    if [[ -f ".env" ]]; then
        print_check ".env file exists"
    else
        print_fail ".env file missing"
    fi
else
    print_fail "VoltServers directory not found at $APP_DIR"
    exit 1
fi

echo ""
echo "2. PM2 Process Status:"
if command -v pm2 &> /dev/null; then
    print_check "PM2 is installed"
    
    if pm2 list | grep -q "voltservers"; then
        if pm2 list | grep -q "voltservers.*online"; then
            print_check "VoltServers process is running"
        else
            print_fail "VoltServers process exists but not online"
        fi
    else
        print_fail "No VoltServers process found in PM2"
    fi
    
    echo "PM2 Status:"
    pm2 list
else
    print_fail "PM2 not installed"
fi

echo ""
echo "3. Port Status:"
if netstat -tlnp | grep -q ":5000 "; then
    print_check "Port 5000 is in use"
    echo "Process using port 5000:"
    netstat -tlnp | grep ":5000 "
else
    print_fail "Port 5000 is not in use - VoltServers not listening"
fi

if netstat -tlnp | grep -q ":80 "; then
    print_check "Port 80 is in use (Nginx)"
else
    print_fail "Port 80 not in use - Nginx may not be running"
fi

echo ""
echo "4. Service Status:"
services=("nginx" "postgresql")
for service in "${services[@]}"; do
    if systemctl is-active --quiet "$service"; then
        print_check "$service is running"
    else
        print_fail "$service is not running"
    fi
done

echo ""
echo "5. Connectivity Tests:"

# Test app directly
if curl -f -s http://localhost:5000 > /dev/null 2>&1; then
    print_check "VoltServers responds on localhost:5000"
else
    print_fail "VoltServers not responding on localhost:5000"
fi

# Test nginx proxy
if curl -f -s http://localhost > /dev/null 2>&1; then
    print_check "Nginx proxy working on localhost:80"
else
    print_fail "Nginx proxy not working on localhost:80"
fi

# Test external access
if curl -f -s http://135.148.137.158 > /dev/null 2>&1; then
    print_check "External access working"
else
    print_fail "External access failing (502 Bad Gateway)"
fi

echo ""
echo "6. Recent Logs:"
if [[ -f "$APP_DIR/logs/error.log" ]]; then
    echo "Last 3 error log entries:"
    tail -3 "$APP_DIR/logs/error.log" 2>/dev/null || echo "No recent errors"
fi

echo ""
echo "🔧 Quick Fixes:"
echo "If VoltServers is not running:"
echo "  cd /home/ubuntu/voltservers && ./immediate-fix.sh"
echo ""
echo "If application not built:"
echo "  cd /home/ubuntu/voltservers && npm run build"
echo ""
echo "If PM2 issues:"
echo "  pm2 delete voltservers && pm2 start ecosystem.production.js"
echo ""
echo "If Nginx issues:"
echo "  sudo systemctl restart nginx"