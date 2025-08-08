#!/bin/bash

# Complete VoltServers Deployment Fix for 135.148.137.158
# This script completes the deployment after fixing Apache port conflict

set -e

echo "🚀 Completing VoltServers Deployment"
echo "===================================="

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

# Check if running as ubuntu user
if [[ $USER != "ubuntu" ]]; then
    print_warning "Run this as ubuntu user"
fi

# Variables
APP_DIR="/home/ubuntu/voltservers"
REPO_URL="https://github.com/Zeeksey/voltservers2"

print_status "Starting complete deployment process..."

# Step 1: Install required packages if missing
print_status "Installing required packages..."
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx curl git

# Step 2: Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
else
    print_success "PM2 already installed"
fi

# Step 3: Setup database
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

# Step 4: Clone and setup application
print_status "Setting up VoltServers application..."

if [[ -d "$APP_DIR" ]]; then
    print_warning "Removing existing application directory..."
    rm -rf "$APP_DIR"
fi

git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

# Create .env file
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

# Optional Integrations (update as needed)
# WHMCS_API_IDENTIFIER=your_whmcs_api_identifier
# WHMCS_API_SECRET=your_whmcs_api_secret
# WHMCS_URL=https://your-whmcs-domain.com
# SENDGRID_API_KEY=your_sendgrid_api_key
# WISP_API_URL=https://game.voltservers.com
# WISP_API_KEY=your_wisp_api_key
EOF

print_success "Environment file created"

# Step 5: Install dependencies and build
print_status "Installing dependencies..."
npm install

print_status "Building application..."
npm run build

if [[ ! -f "dist/index.js" ]]; then
    print_error "Build failed - dist/index.js not found"
    exit 1
fi
print_success "Application built successfully"

# Step 6: Setup database schema
print_status "Setting up database schema..."
npm run db:push
print_success "Database schema configured"

# Step 7: Configure Nginx properly
print_status "Configuring Nginx..."

# Stop nginx first
sudo systemctl stop nginx 2>/dev/null || true

# Remove default sites
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/default

# Create VoltServers nginx configuration
sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 135.148.137.158 _;
    
    # Basic security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    
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
    }
}
EOF

# Enable VoltServers site
sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/

# Test nginx configuration
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration invalid"
    sudo nginx -t
    exit 1
fi

# Step 8: Start VoltServers application with PM2
print_status "Starting VoltServers application..."

# Stop any existing PM2 processes
pm2 delete voltservers 2>/dev/null || true

# Start the application (use .cjs for CommonJS)
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save
pm2 startup ubuntu -u ubuntu --hp /home/ubuntu

print_success "VoltServers application started"

# Step 9: Start Nginx
print_status "Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx started successfully"
else
    print_error "Nginx failed to start"
    exit 1
fi

# Step 10: Verify everything is working
print_status "Verifying deployment..."
sleep 5

# Test application directly
if curl -f -s http://localhost:5000 > /dev/null; then
    print_success "VoltServers app responding on port 5000"
else
    print_error "VoltServers app not responding on port 5000"
    pm2 logs voltservers --lines 10
fi

# Test nginx proxy
if curl -f -s http://localhost > /dev/null; then
    print_success "Nginx proxy working"
else
    print_warning "Nginx proxy may have issues"
fi

# Test external access
if curl -f -s http://135.148.137.158 > /dev/null; then
    print_success "External access working"
else
    print_warning "External access may have issues"
fi

# Display status
print_status "Deployment status:"
pm2 status

echo ""
print_success "VoltServers deployment completed!"
echo ""
echo "🌐 Access points:"
echo "   VoltServers:    http://135.148.137.158"
echo "   phpMyAdmin:     http://135.148.137.158:8080/phpmyadmin"
echo ""
echo "🔧 Management commands:"
echo "   pm2 status              - Check app status"
echo "   pm2 logs voltservers    - View app logs"
echo "   pm2 restart voltservers - Restart app"
echo "   sudo systemctl status nginx - Check web server"
echo ""
echo "📊 Next steps:"
echo "   1. Test your website at http://135.148.137.158"
echo "   2. Configure domain DNS if needed"
echo "   3. Set up SSL with: sudo certbot --nginx"
echo "   4. Configure API integrations in .env file"