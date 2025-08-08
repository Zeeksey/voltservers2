#!/bin/bash

# Fully Automated VoltServers Deployment (No User Input Required)
# For Ubuntu server 135.148.137.158

set -e

echo "🚀 VoltServers Automated Deployment"
echo "==================================="

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

# Generate secure passwords automatically
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
SESSION_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)

print_status "Generated secure credentials automatically"

# Update system
print_status "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
sudo apt update -qq
sudo apt upgrade -y -qq

# Install Node.js 20
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 20 ]]; then
    print_status "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - >/dev/null 2>&1
    sudo apt install -y nodejs >/dev/null 2>&1
    print_success "Node.js $(node -v) installed"
else
    print_success "Node.js $(node -v) already installed"
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2 >/dev/null 2>&1
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Install PostgreSQL (automated)
if ! command -v psql &> /dev/null; then
    print_status "Installing PostgreSQL..."
    sudo apt install -y postgresql postgresql-contrib >/dev/null 2>&1
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    print_success "PostgreSQL installed"
else
    print_success "PostgreSQL already installed"
    sudo systemctl start postgresql || true
fi

# Setup database (fully automated)
print_status "Configuring database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS voltservers;" >/dev/null 2>&1 || true
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" >/dev/null 2>&1 || true
sudo -u postgres psql -c "CREATE DATABASE voltservers;" >/dev/null 2>&1
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD';" >/dev/null 2>&1
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;" >/dev/null 2>&1
sudo -u postgres psql -c "ALTER USER voltservers CREATEDB;" >/dev/null 2>&1

DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"
print_success "Database configured"

# Install Nginx
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt install -y nginx >/dev/null 2>&1
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi

# Handle Apache conflict
if systemctl is-active --quiet apache2; then
    print_status "Moving Apache to port 8080..."
    sudo sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf 2>/dev/null || true
    sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf 2>/dev/null || true
    sudo systemctl restart apache2 >/dev/null 2>&1
    sudo ufw allow 8080 >/dev/null 2>&1 || true
    print_success "Apache moved to port 8080"
fi

# Setup application
print_status "Setting up VoltServers application..."
if [[ -d "$APP_DIR" ]]; then
    rm -rf "$APP_DIR"
fi

git clone "$REPO_URL" "$APP_DIR" >/dev/null 2>&1
cd "$APP_DIR"

# Create .env file
print_status "Creating environment configuration..."
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
EOF

print_success "Environment configured"

# Install dependencies and build
print_status "Installing dependencies..."
npm install >/dev/null 2>&1

print_status "Building application..."
npm run build >/dev/null 2>&1

if [[ ! -f "dist/index.js" ]]; then
    print_error "Build failed"
    npm run build
    exit 1
fi
print_success "Application built"

# Setup database schema
print_status "Setting up database schema..."
npm run db:push >/dev/null 2>&1
print_success "Database schema configured"

# Configure Nginx
print_status "Configuring Nginx..."
sudo systemctl stop nginx >/dev/null 2>&1 || true

sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/default

# Create Nginx config
sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 135.148.137.158 _;
    
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

sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/

if ! sudo nginx -t >/dev/null 2>&1; then
    print_error "Nginx configuration invalid"
    sudo nginx -t
    exit 1
fi
print_success "Nginx configured"

# Configure firewall
sudo ufw allow 22 >/dev/null 2>&1 || true
sudo ufw allow 80 >/dev/null 2>&1 || true
sudo ufw allow 8080 >/dev/null 2>&1 || true
sudo ufw --force enable >/dev/null 2>&1 || true

# Create PM2 config
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
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Start application
print_status "Starting VoltServers..."
pm2 delete voltservers >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs --env production >/dev/null 2>&1
pm2 save >/dev/null 2>&1

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx >/dev/null 2>&1

# Test deployment
print_status "Testing deployment..."
sleep 5

# Test app on port 5000
if curl -f -s --connect-timeout 5 http://localhost:5000 > /dev/null; then
    print_success "VoltServers app running on port 5000"
else
    print_error "VoltServers app not responding"
    pm2 logs voltservers --lines 5
fi

# Test Nginx proxy
if curl -f -s --connect-timeout 5 http://localhost > /dev/null; then
    print_success "Nginx proxy working"
else
    print_error "Nginx proxy not working"
fi

# Test external access
if curl -f -s --connect-timeout 5 http://135.148.137.158 > /dev/null; then
    print_success "External access working"
else
    print_warning "External access may need time to propagate"
fi

# Display results
echo ""
print_success "🎉 VoltServers deployment completed!"
echo ""
echo "🌐 Access URLs:"
echo "   VoltServers:    http://135.148.137.158"
echo "   phpMyAdmin:     http://135.148.137.158:8080/phpmyadmin"
echo ""
echo "🔐 Database Credentials:"
echo "   Database: voltservers"
echo "   Username: voltservers"
echo "   Password: $DB_PASSWORD"
echo ""
echo "🔧 Management:"
echo "   pm2 status"
echo "   pm2 logs voltservers"
echo "   pm2 restart voltservers"

pm2 status