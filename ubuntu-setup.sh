#!/bin/bash

# Complete VoltServers Ubuntu Server Setup Script
# For deployment on 135.148.137.158

set -e

echo "🚀 VoltServers Complete Ubuntu Server Setup"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Variables
APP_USER="ubuntu"
APP_DIR="/home/$APP_USER/voltservers"
REPO_URL="https://github.com/Zeeksey/voltservers2"
NODE_VERSION="20"

print_status "Starting complete VoltServers deployment..."

# Check if running as correct user
if [[ $USER != "$APP_USER" ]]; then
    print_error "This script must be run as the $APP_USER user"
    exit 1
fi

# Step 1: System Updates and Dependencies
print_status "Updating system packages..."
sudo apt update
sudo apt upgrade -y

print_status "Installing system dependencies..."
sudo apt install -y curl wget git build-essential software-properties-common

# Step 2: Install Node.js 20.x
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 20 ]]; then
    print_status "Installing Node.js $NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt install -y nodejs
    print_success "Node.js $(node -v) installed"
else
    print_success "Node.js $(node -v) already installed"
fi

# Step 3: Install PM2
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Step 4: Install and Configure PostgreSQL
if ! command -v psql &> /dev/null; then
    print_status "Installing PostgreSQL..."
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    print_success "PostgreSQL installed and started"
else
    print_success "PostgreSQL already installed"
    sudo systemctl start postgresql || true
fi

# Step 5: Setup Database
print_status "Setting up PostgreSQL database..."
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# Create database and user
sudo -u postgres psql -c "DROP DATABASE IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE voltservers;"
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;"
sudo -u postgres psql -c "ALTER USER voltservers CREATEDB;"

DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"
print_success "Database configured"

# Step 6: Install and Configure Nginx
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt install -y nginx
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi

# Step 7: Setup Application Directory
print_status "Setting up VoltServers application..."

# Remove existing directory if it exists
if [[ -d "$APP_DIR" ]]; then
    print_warning "Removing existing application directory..."
    rm -rf "$APP_DIR"
fi

# Clone repository
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

# Step 8: Create Environment Configuration
print_status "Creating environment configuration..."
SESSION_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)

cat > .env << EOF
# VoltServers Production Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL=$DATABASE_URL

# Session Security
SESSION_SECRET=$SESSION_SECRET

# Optional Integrations (configure as needed)
# WHMCS_API_IDENTIFIER=your_whmcs_api_identifier
# WHMCS_API_SECRET=your_whmcs_api_secret
# WHMCS_URL=https://your-whmcs-domain.com
# SENDGRID_API_KEY=your_sendgrid_api_key
# WISP_API_URL=https://game.voltservers.com
# WISP_API_KEY=your_wisp_api_key
EOF

print_success "Environment file created"

# Step 9: Install Dependencies and Build
print_status "Installing application dependencies..."
npm install

print_status "Building application..."
npm run build

# Verify build
if [[ ! -f "dist/index.js" ]]; then
    print_error "Build failed - dist/index.js not found"
    exit 1
fi
print_success "Application built successfully"

# Step 10: Setup Database Schema
print_status "Setting up database schema..."
npm run db:push
print_success "Database schema configured"

# Step 11: Configure Nginx
print_status "Configuring Nginx..."

# Stop services first
sudo systemctl stop nginx 2>/dev/null || true

# Handle Apache conflict (move to port 8080)
if systemctl is-active --quiet apache2; then
    print_status "Moving Apache to port 8080 to avoid conflict..."
    sudo sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf 2>/dev/null || true
    sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf 2>/dev/null || true
    sudo systemctl restart apache2
    sudo ufw allow 8080 2>/dev/null || true
    print_success "Apache moved to port 8080"
fi

# Remove default nginx sites
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/default

# Create VoltServers nginx configuration
sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 135.148.137.158 _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    
    # Main application proxy
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 75;
        proxy_send_timeout 300;
        
        # Handle timeouts gracefully
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
    }
    
    # Handle static files if needed
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://127.0.0.1:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/

# Test nginx configuration
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration invalid"
    sudo nginx -t
    exit 1
fi

# Step 12: Configure Firewall
print_status "Configuring firewall..."
sudo ufw allow 22 2>/dev/null || true    # SSH
sudo ufw allow 80 2>/dev/null || true    # HTTP
sudo ufw allow 443 2>/dev/null || true   # HTTPS
sudo ufw allow 8080 2>/dev/null || true  # Apache/phpMyAdmin
sudo ufw --force enable 2>/dev/null || true
print_success "Firewall configured"

# Step 13: Create PM2 Configuration
print_status "Creating PM2 configuration..."
mkdir -p logs

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
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    watch: false,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    autorestart: true,
    restart_delay: 5000
  }]
};
EOF

# Step 14: Start VoltServers Application
print_status "Starting VoltServers application..."

# Stop any existing processes
pm2 delete voltservers 2>/dev/null || true

# Start application
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save
pm2 startup ubuntu -u "$APP_USER" --hp "/home/$APP_USER" | grep -v "sudo env PATH" | sudo bash

print_success "VoltServers application started"

# Step 15: Start Nginx
print_status "Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx started successfully"
else
    print_error "Nginx failed to start"
    exit 1
fi

# Step 16: Comprehensive Testing
print_status "Testing deployment..."
sleep 10

# Test application directly
if curl -f -s --connect-timeout 10 http://localhost:5000 > /dev/null; then
    print_success "VoltServers app responding on port 5000"
else
    print_error "VoltServers app not responding on port 5000"
    print_status "Checking PM2 logs..."
    pm2 logs voltservers --lines 10
fi

# Test nginx proxy
if curl -f -s --connect-timeout 10 http://localhost > /dev/null; then
    print_success "Nginx proxy working"
else
    print_warning "Nginx proxy may have issues"
fi

# Test external access
if curl -f -s --connect-timeout 10 http://135.148.137.158 > /dev/null; then
    print_success "External access working"
else
    print_warning "External access may need DNS propagation"
fi

# Step 17: Display Final Status
print_status "Final deployment status:"
pm2 status

echo ""
print_success "🎉 VoltServers deployment completed successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   VoltServers:    http://135.148.137.158"
echo "   phpMyAdmin:     http://135.148.137.158:8080/phpmyadmin (if Apache was present)"
echo ""
echo "🔧 Management Commands:"
echo "   pm2 status              - Check application status"
echo "   pm2 logs voltservers    - View application logs"
echo "   pm2 restart voltservers - Restart application"
echo "   sudo systemctl status nginx - Check web server"
echo ""
echo "📁 Important Files:"
echo "   Application: $APP_DIR"
echo "   Logs:        $APP_DIR/logs/"
echo "   Config:      $APP_DIR/.env"
echo ""
echo "🔐 Database Info:"
echo "   Database: voltservers"
echo "   User:     voltservers"
echo "   Password: $DB_PASSWORD"
echo ""
echo "📊 Next Steps:"
echo "   1. Test your website at http://135.148.137.158"
echo "   2. Configure SSL: sudo certbot --nginx"
echo "   3. Set up domain DNS if needed"
echo "   4. Configure API integrations in .env file"