#!/bin/bash

# Nginx Fix Script for VoltServers Deployment
# Run this if Nginx fails during deployment

set -e

echo "🔧 Fixing Nginx Configuration Issues"
echo "==================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "\033[0;34m[INFO]\033[0m $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Stop nginx first
print_status "Stopping nginx..."
sudo systemctl stop nginx 2>/dev/null || true

# Remove conflicting configurations
print_status "Cleaning up nginx configurations..."
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/default

# Check if port 80 is in use
print_status "Checking for port conflicts..."
if netstat -tlnp | grep -q ":80 "; then
    print_warning "Port 80 is in use by another process:"
    netstat -tlnp | grep ":80 "
    
    # Move Apache to port 8080 instead of stopping it (preserve phpMyAdmin)
    if sudo systemctl is-active --quiet apache2 2>/dev/null; then
        print_status "Moving Apache/phpMyAdmin to port 8080..."
        
        # Update Apache configuration
        sudo sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf 2>/dev/null || true
        sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf 2>/dev/null || true
        
        # Restart Apache on new port
        sudo systemctl restart apache2
        
        print_success "Apache moved to port 8080 - phpMyAdmin now at http://135.148.137.158:8080/phpmyadmin"
    fi
fi

# Create minimal working nginx config
print_status "Creating minimal nginx configuration..."
sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/

# Test configuration
print_status "Testing nginx configuration..."
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration still invalid:"
    sudo nginx -t
    exit 1
fi

# Start nginx
print_status "Starting nginx..."
if sudo systemctl start nginx; then
    print_success "Nginx started successfully"
    sudo systemctl enable nginx
else
    print_error "Failed to start nginx"
    print_status "Checking nginx status..."
    sudo systemctl status nginx --no-pager
    print_status "Checking nginx logs..."
    sudo journalctl -u nginx --no-pager -l
    exit 1
fi

# Verify nginx is running and accessible
print_status "Verifying nginx is working..."
sleep 2

if curl -f -s http://localhost > /dev/null; then
    print_success "Nginx is working and proxying requests"
else
    print_warning "Nginx is running but may not be proxying correctly"
    print_status "Checking if your application is running on port 5000..."
    
    if curl -f -s http://localhost:5000 > /dev/null; then
        print_warning "App is running on port 5000 but nginx proxy may have issues"
    else
        print_warning "App is not running on port 5000 - start it with: pm2 start ecosystem.config.js --env production"
    fi
fi

print_status "Nginx status:"
sudo systemctl status nginx --no-pager -l

echo ""
print_success "Nginx fix completed!"
echo ""
echo "Next steps:"
echo "1. Ensure your VoltServers app is running: pm2 status"
echo "2. Test the site: curl http://localhost"
echo "3. Check external access: curl http://135.148.137.158"