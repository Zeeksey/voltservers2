#!/bin/bash

# Quick fix for Apache/phpMyAdmin port conflict
# Run this to move Apache to port 8080 and start Nginx on port 80

echo "🔧 Fixing Apache/phpMyAdmin Port Conflict"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

print_status "Moving Apache/phpMyAdmin to port 8080..."

# Update Apache ports configuration
sudo sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf
sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf

# Restart Apache
sudo systemctl restart apache2
print_success "Apache restarted on port 8080"

# Allow port 8080 through firewall
sudo ufw allow 8080/tcp comment "Apache/phpMyAdmin"
print_success "Firewall updated for port 8080"

# Create simple Nginx config for VoltServers
print_status "Configuring Nginx for VoltServers..."

sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 135.148.137.158 _;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable VoltServers site
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/

# Test and start Nginx
if sudo nginx -t; then
    sudo systemctl start nginx
    sudo systemctl enable nginx
    print_success "Nginx started successfully"
else
    echo "Nginx configuration test failed"
    sudo nginx -t
    exit 1
fi

echo ""
print_success "Port conflict resolved!"
echo ""
echo "🌐 Access points:"
echo "   VoltServers:    http://135.148.137.158"
echo "   phpMyAdmin:     http://135.148.137.158:8080/phpmyadmin"
echo ""
echo "🔧 Next steps:"
echo "   1. Start your VoltServers app: pm2 start ecosystem.config.js --env production"
echo "   2. Test the website: curl http://135.148.137.158"
echo "   3. Verify phpMyAdmin: curl http://135.148.137.158:8080"