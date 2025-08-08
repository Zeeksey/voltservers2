#!/bin/bash

# VoltServers Deployment Debug Script
# Run this to diagnose deployment issues

echo "🔍 VoltServers Deployment Diagnostics"
echo "====================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_section() { echo -e "${BLUE}=== $1 ===${NC}"; }
print_check() { echo -e "${GREEN}✓${NC} $1"; }
print_fail() { echo -e "${RED}✗${NC} $1"; }
print_warn() { echo -e "${YELLOW}⚠${NC} $1"; }

print_section "System Information"
echo "OS: $(lsb_release -d -s 2>/dev/null || cat /etc/os-release | grep PRETTY_NAME | cut -d'=' -f2 | tr -d '"')"
echo "Kernel: $(uname -r)"
echo "Memory: $(free -h | awk 'NR==2{print $2}')"
echo "Disk: $(df -h / | awk 'NR==2{print $4}')"
echo ""

print_section "Service Status"
services=("nginx" "postgresql" "ufw")
for service in "${services[@]}"; do
    if systemctl is-active --quiet "$service"; then
        print_check "$service is running"
    else
        print_fail "$service is not running"
        echo "  Status: $(systemctl is-active "$service" 2>/dev/null || echo 'inactive')"
    fi
done
echo ""

print_section "Network Ports"
echo "Checking critical ports..."
ports=("22:SSH" "80:HTTP" "443:HTTPS" "5000:App" "5432:PostgreSQL")
for port_info in "${ports[@]}"; do
    port=$(echo "$port_info" | cut -d':' -f1)
    service=$(echo "$port_info" | cut -d':' -f2)
    
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        print_check "Port $port ($service) is in use"
        netstat -tlnp 2>/dev/null | grep ":$port " | head -1
    else
        print_warn "Port $port ($service) is not in use"
    fi
done
echo ""

print_section "Application Status"
if command -v pm2 &> /dev/null; then
    print_check "PM2 is installed"
    echo "PM2 processes:"
    pm2 list 2>/dev/null || echo "No PM2 processes found"
else
    print_fail "PM2 is not installed"
fi
echo ""

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version 2>/dev/null)
    print_check "Node.js installed: $NODE_VERSION"
else
    print_fail "Node.js is not installed"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version 2>/dev/null)
    print_check "npm installed: $NPM_VERSION"
else
    print_fail "npm is not installed"
fi
echo ""

print_section "VoltServers Application"
APP_DIR="/home/ubuntu/voltservers"
if [[ -d "$APP_DIR" ]]; then
    print_check "Application directory exists: $APP_DIR"
    
    cd "$APP_DIR" || exit 1
    
    # Check important files
    files=("package.json" "dist/index.js" ".env" "ecosystem.config.js")
    for file in "${files[@]}"; do
        if [[ -f "$file" ]]; then
            print_check "$file exists"
        else
            print_fail "$file missing"
        fi
    done
    
    # Check if built
    if [[ -d "dist" ]] && [[ -f "dist/index.js" ]]; then
        print_check "Application is built"
    else
        print_fail "Application is not built (run: npm run build)"
    fi
else
    print_fail "Application directory not found: $APP_DIR"
fi
echo ""

print_section "Database Connection"
if command -v psql &> /dev/null; then
    print_check "PostgreSQL client installed"
    
    if [[ -f "$APP_DIR/.env" ]]; then
        if grep -q "DATABASE_URL" "$APP_DIR/.env"; then
            print_check "DATABASE_URL configured"
            # Test connection (without showing the URL)
            if cd "$APP_DIR" && npm run db:push &>/dev/null; then
                print_check "Database connection working"
            else
                print_fail "Database connection failed"
            fi
        else
            print_fail "DATABASE_URL not found in .env"
        fi
    else
        print_fail ".env file not found"
    fi
else
    print_fail "PostgreSQL client not installed"
fi
echo ""

print_section "Nginx Configuration"
if command -v nginx &> /dev/null; then
    print_check "Nginx is installed"
    
    if nginx -t &>/dev/null; then
        print_check "Nginx configuration is valid"
    else
        print_fail "Nginx configuration is invalid"
        echo "Configuration test output:"
        nginx -t
    fi
    
    if [[ -f "/etc/nginx/sites-enabled/voltservers" ]]; then
        print_check "VoltServers site is enabled"
    else
        print_fail "VoltServers site is not enabled"
    fi
else
    print_fail "Nginx is not installed"
fi
echo ""

print_section "Connectivity Tests"
echo "Testing local connections..."

# Test app directly
if curl -f -s http://localhost:5000 >/dev/null 2>&1; then
    print_check "App responds on port 5000"
else
    print_fail "App not responding on port 5000"
fi

# Test nginx proxy
if curl -f -s http://localhost >/dev/null 2>&1; then
    print_check "Nginx proxy working"
else
    print_fail "Nginx proxy not working"
fi

# Test external access
if curl -f -s http://135.148.137.158 >/dev/null 2>&1; then
    print_check "External access working"
else
    print_warn "External access may have issues"
fi
echo ""

print_section "Recent Logs"
echo "Last 5 lines of key logs:"

echo "--- PM2 Logs ---"
if command -v pm2 &> /dev/null; then
    pm2 logs voltservers --lines 5 --nostream 2>/dev/null || echo "No PM2 logs available"
else
    echo "PM2 not available"
fi

echo ""
echo "--- Nginx Error Log ---"
if [[ -f "/var/log/nginx/error.log" ]]; then
    tail -5 /var/log/nginx/error.log 2>/dev/null || echo "No nginx error logs"
else
    echo "Nginx error log not found"
fi

echo ""
echo "--- System Log (nginx) ---"
journalctl -u nginx --no-pager -l --lines=5 2>/dev/null || echo "No systemd logs for nginx"

echo ""
print_section "Quick Fixes"
echo "If you found issues, try these commands:"
echo ""
echo "Fix Nginx:"
echo "  ./fix-nginx.sh"
echo ""
echo "Restart services:"
echo "  sudo systemctl restart nginx"
echo "  pm2 restart voltservers"
echo ""
echo "Rebuild application:"
echo "  cd $APP_DIR && npm run build"
echo ""
echo "Check detailed logs:"
echo "  pm2 logs voltservers"
echo "  sudo journalctl -u nginx -f"