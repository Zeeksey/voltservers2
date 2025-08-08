#!/bin/bash

# VoltServers Deployment Script for 135.148.137.158
# Run this script on your Ubuntu server to deploy VoltServers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
SERVER_IP="135.148.137.158"
APP_DIR="/home/ubuntu/voltservers"
APP_USER="ubuntu"

# Function to print colored output
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_header() { echo -e "${PURPLE}=== $1 ===${NC}"; }

print_header "VoltServers Production Deployment"
echo "Server: $SERVER_IP"
echo "App Directory: $APP_DIR"
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_error "Run this script as ubuntu user, not root"
    exit 1
fi

# Step 1: System Updates
print_header "STEP 1: System Setup"
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_status "Installing essential packages..."
sudo apt install -y curl wget git ufw fail2ban nginx certbot python3-certbot-nginx htop unzip

# Step 2: Firewall Configuration
print_header "STEP 2: Security Configuration"
print_status "Configuring firewall..."
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
print_success "Firewall configured"

# Step 3: Install Node.js 20.x
print_header "STEP 3: Installing Node.js"
if ! command -v node &> /dev/null || [[ $(node --version | cut -d'v' -f2 | cut -d'.' -f1) -lt 18 ]]; then
    print_status "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_success "Node.js already installed: $(node --version)"
fi

# Step 4: Install PostgreSQL
print_header "STEP 4: Database Setup"
if ! command -v psql &> /dev/null; then
    print_status "Installing PostgreSQL..."
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
else
    print_success "PostgreSQL already installed"
fi

# Configure database
print_status "Configuring database..."
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
print_status "Generated secure database password"

# Create database and user
sudo -u postgres psql -c "DROP DATABASE IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE voltservers;"
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;"
sudo -u postgres psql -c "ALTER USER voltservers CREATEDB;"

DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"
print_success "Database configured"

# Step 5: Install PM2
print_header "STEP 5: Process Manager"
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
else
    print_success "PM2 already installed"
fi

# Step 6: Deploy Application
print_header "STEP 6: Application Deployment"
print_status "Enter your GitHub repository URL:"
echo "Example: https://github.com/username/voltservers"
read -p "Repository URL: " REPO_URL

if [[ -z "$REPO_URL" ]]; then
    print_error "Repository URL is required"
    exit 1
fi

# Remove existing directory
if [[ -d "$APP_DIR" ]]; then
    print_warning "Removing existing application directory..."
    rm -rf "$APP_DIR"
fi

# Clone repository
print_status "Cloning repository..."
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

# Verify critical files
REQUIRED_FILES=("package.json" "server/index.ts" "shared/schema.ts")
for file in "${REQUIRED_FILES[@]}"; do
    if [[ ! -f "$file" ]]; then
        print_error "Critical file missing: $file"
        exit 1
    fi
done
print_success "Repository structure verified"

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

# Install dependencies
print_status "Installing application dependencies..."
npm install

# Build application
print_status "Building application for production..."
npm run build

if [[ ! -f "dist/index.js" ]]; then
    print_error "Build failed - dist/index.js not found"
    exit 1
fi
print_success "Application built successfully"

# Run database migrations
print_status "Setting up database schema..."
npm run db:push
print_success "Database schema configured"

# Step 7: Configure Nginx
print_header "STEP 7: Web Server Configuration"
print_status "Configuring Nginx..."

sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'EOF'
server {
    listen 80;
    server_name 135.148.137.158;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Main application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
print_status "Testing Nginx configuration..."
if sudo nginx -t; then
    print_success "Nginx configuration valid"
    sudo systemctl restart nginx
    sudo systemctl enable nginx
else
    print_error "Nginx configuration invalid"
    exit 1
fi

# Step 8: Start Application with PM2
print_header "STEP 8: Starting Application"
print_status "Starting VoltServers with PM2..."

# Stop existing PM2 processes
pm2 delete voltservers 2>/dev/null || true

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup ubuntu -u "$APP_USER" --hp "/home/$APP_USER"

print_success "Application started successfully"

# Step 9: Final Verification
print_header "STEP 9: Deployment Verification"
sleep 5

# Test local connection
if curl -f -s http://localhost:5000 > /dev/null; then
    print_success "Application responding locally"
else
    print_error "Application not responding locally"
    pm2 logs voltservers --lines 10
    exit 1
fi

# Test external connection
if curl -f -s "http://$SERVER_IP" > /dev/null; then
    print_success "Application accessible externally"
else
    print_warning "External access may have issues - check firewall"
fi

# Display PM2 status
print_status "Application status:"
pm2 status

print_header "DEPLOYMENT COMPLETE!"
echo ""
print_success "VoltServers is now running on your server!"
echo ""
echo "🌐 Access your application at:"
echo "   http://$SERVER_IP"
echo ""
echo "🔧 Useful commands:"
echo "   pm2 status              - Check app status"
echo "   pm2 logs voltservers    - View app logs"  
echo "   pm2 restart voltservers - Restart app"
echo "   pm2 stop voltservers    - Stop app"
echo ""
echo "📊 Next steps:"
echo "   1. Configure your domain DNS to point to $SERVER_IP"
echo "   2. Set up SSL certificate with: sudo certbot --nginx"
echo "   3. Configure your WHMCS/API integrations in .env"
echo "   4. Set up monitoring and backups"
echo ""
print_status "Deployment log saved to: /tmp/voltservers-deploy.log"

# Save deployment info
cat > /tmp/voltservers-deploy.log << EOF
VoltServers Deployment Summary
==============================
Date: $(date)
Server: $SERVER_IP
Directory: $APP_DIR
Database URL: $DATABASE_URL
Application URL: http://$SERVER_IP

Configuration files:
- .env: Application environment
- /etc/nginx/sites-available/voltservers: Nginx config
- ecosystem.config.js: PM2 configuration

Useful commands:
- pm2 status
- pm2 logs voltservers
- sudo systemctl status nginx
- sudo systemctl status postgresql
EOF