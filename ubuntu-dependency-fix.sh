#!/bin/bash

# Ubuntu Dependency Fix for VoltServers Deployment
# Resolves Node.js/npm conflicts and ensures clean installation

set -e

echo "🔧 Ubuntu Dependency Fix for VoltServers"
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Variables
APP_DIR="/home/ubuntu/voltservers"
REPO_URL="https://github.com/Zeeksey/voltservers2"

print_step "Cleaning up conflicting packages"
export DEBIAN_FRONTEND=noninteractive

# Remove conflicting Node.js packages
sudo apt remove -y nodejs npm node 2>/dev/null || true
sudo apt autoremove -y
sudo apt autoclean

print_step "Updating system packages"
sudo apt update
sudo apt upgrade -y

print_step "Installing system dependencies"
sudo apt install -y curl wget git build-essential software-properties-common postgresql postgresql-contrib nginx

print_step "Installing Node.js 20.x using NodeSource repository"
# Remove any existing NodeSource setup
sudo rm -f /etc/apt/sources.list.d/nodesource.list
sudo rm -f /usr/share/keyrings/nodesource.gpg

# Install Node.js 20.x from NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    print_success "Node.js $(node -v) and npm $(npm -v) installed successfully"
else
    print_error "Node.js/npm installation failed"
    exit 1
fi

print_step "Installing PM2 globally"
sudo npm install -g pm2

print_step "Setting up PostgreSQL"
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Generate secure credentials
DB_PASSWORD=$(openssl rand -base64 25 | tr -d "=+/")
SESSION_SECRET=$(openssl rand -base64 50 | tr -d "=+/")

print_step "Configuring PostgreSQL database"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" 2>/dev/null || true

sudo -u postgres psql <<EOF
CREATE DATABASE voltservers;
CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;
ALTER USER voltservers CREATEDB;
ALTER USER voltservers SUPERUSER;
EOF

DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"

# Test database connection
if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U voltservers -d voltservers -c "SELECT 1;" >/dev/null 2>&1; then
    print_success "Database connection verified"
else
    print_error "Database connection failed"
    exit 1
fi

print_step "Setting up VoltServers application"
if [[ -d "$APP_DIR" ]]; then
    rm -rf "$APP_DIR"
fi

git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

print_step "Creating environment configuration"
cat > .env <<EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
EOF

print_step "Installing Node.js dependencies"
npm install

print_step "Building application"
npm run build

if [[ ! -f "dist/index.js" ]]; then
    print_error "Build failed - dist/index.js not found"
    ls -la dist/ 2>/dev/null || echo "dist directory doesn't exist"
    exit 1
fi
print_success "Application built successfully"

print_step "Setting up database schema"
npm run db:push

print_step "Configuring web server"
# Handle Apache conflict
if systemctl is-active --quiet apache2; then
    print_warning "Moving Apache to port 8080"
    sudo sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf 2>/dev/null || true
    sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf 2>/dev/null || true
    sudo systemctl restart apache2
fi

# Configure Nginx
sudo systemctl stop nginx 2>/dev/null || true
sudo rm -f /etc/nginx/sites-enabled/*

sudo tee /etc/nginx/sites-available/voltservers > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 135.148.137.158 _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    
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

# Test Nginx configuration
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration failed"
    sudo nginx -t
    exit 1
fi

print_step "Configuring firewall"
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 8080/tcp  # Apache/phpMyAdmin
sudo ufw --force enable

print_step "Starting VoltServers application"
pm2 delete voltservers 2>/dev/null || true

# Create PM2 ecosystem file
cat > ecosystem.config.cjs <<'EOF'
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

mkdir -p logs
pm2 start ecosystem.config.cjs --env production
pm2 save

print_step "Starting web server"
sudo systemctl start nginx
sudo systemctl enable nginx

print_step "Testing deployment"
sleep 10

# Test application
if curl -f -s --connect-timeout 10 http://localhost:5000 > /dev/null; then
    print_success "VoltServers app responding on port 5000"
else
    print_error "Application not responding"
    pm2 logs voltservers --lines 10
    exit 1
fi

# Test Nginx proxy
if curl -f -s --connect-timeout 10 http://localhost > /dev/null; then
    print_success "Nginx proxy working on port 80"
else
    print_error "Nginx proxy not working"
    exit 1
fi

# Test external access
if curl -f -s --connect-timeout 10 http://135.148.137.158 > /dev/null; then
    print_success "External access confirmed"
else
    print_warning "External access may need time to propagate"
fi

echo ""
print_success "VoltServers deployment completed successfully!"
echo ""
echo "🌐 Access Information:"
echo "   VoltServers Website: http://135.148.137.158"
echo "   phpMyAdmin (Apache): http://135.148.137.158:8080/phpmyadmin"
echo ""
echo "🔐 Database Credentials:"
echo "   Database: voltservers"
echo "   Username: voltservers"
echo "   Password: $DB_PASSWORD"
echo ""
echo "🔧 Management Commands:"
echo "   pm2 status"
echo "   pm2 logs voltservers"
echo "   pm2 restart voltservers"
echo "   sudo systemctl status nginx"
echo ""

pm2 status