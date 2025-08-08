#!/bin/bash

# VoltServers One-Command Ubuntu Deployment
# Run with: curl -sSL https://raw.githubusercontent.com/Zeeksey/voltservers2/main/one-command-deploy.sh | bash

set -e

echo "🚀 VoltServers One-Command Ubuntu Deployment"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Variables
APP_USER="ubuntu"
APP_DIR="/home/$APP_USER/voltservers"
REPO_URL="https://github.com/Zeeksey/voltservers2"
DB_PASSWORD="VoltPass2025!"
SESSION_SECRET="VoltServers2025SecretKey!"
DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"

log "Starting VoltServers deployment"

# Check if running as ubuntu user
if [[ $USER != "$APP_USER" ]]; then
    error "Please run this script as the ubuntu user"
    exit 1
fi

# Step 1: Update system
log "Updating system packages"
export DEBIAN_FRONTEND=noninteractive
sudo apt update -qq
sudo apt upgrade -y -qq
sudo apt install -y curl wget git ufw build-essential

# Step 2: Configure firewall
log "Configuring firewall"
sudo ufw allow 22/tcp >/dev/null 2>&1
sudo ufw allow 80/tcp >/dev/null 2>&1
sudo ufw allow 443/tcp >/dev/null 2>&1
sudo ufw allow 8080/tcp >/dev/null 2>&1
sudo ufw --force enable >/dev/null 2>&1

# Step 3: Install Node.js 20.x
log "Installing Node.js 20.x"
sudo apt remove -y nodejs npm >/dev/null 2>&1 || true
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - >/dev/null 2>&1
sudo apt install -y nodejs >/dev/null 2>&1

if command -v node &> /dev/null && command -v npm &> /dev/null; then
    success "Node.js $(node -v) and npm $(npm -v) installed"
else
    error "Node.js installation failed"
    exit 1
fi

# Step 4: Install PM2
log "Installing PM2"
sudo npm install -g pm2 >/dev/null 2>&1
success "PM2 installed"

# Step 5: Install PostgreSQL
log "Installing PostgreSQL"
sudo apt install -y postgresql postgresql-contrib >/dev/null 2>&1
sudo systemctl start postgresql
sudo systemctl enable postgresql >/dev/null 2>&1

# Step 6: Configure PostgreSQL
log "Configuring PostgreSQL database"
sudo -u postgres psql >/dev/null 2>&1 << EOF
DROP DATABASE IF EXISTS voltservers;
DROP USER IF EXISTS voltservers;
CREATE DATABASE voltservers;
CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;
ALTER USER voltservers CREATEDB;
ALTER USER voltservers SUPERUSER;
EOF

# Test database connection
if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U voltservers -d voltservers -c "SELECT 1;" >/dev/null 2>&1; then
    success "Database configured and tested"
else
    error "Database configuration failed"
    exit 1
fi

# Step 7: Install Nginx
log "Installing Nginx"
sudo apt install -y nginx >/dev/null 2>&1

# Handle Apache conflict
if systemctl is-active --quiet apache2; then
    warning "Moving Apache to port 8080"
    sudo sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf 2>/dev/null || true
    sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf 2>/dev/null || true
    sudo systemctl restart apache2 >/dev/null 2>&1
fi

sudo systemctl stop nginx >/dev/null 2>&1 || true

# Step 8: Deploy VoltServers
log "Deploying VoltServers application"
if [[ -d "$APP_DIR" ]]; then
    rm -rf "$APP_DIR"
fi

git clone "$REPO_URL" "$APP_DIR" >/dev/null 2>&1
cd "$APP_DIR"

# Create environment file
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
EOF

# Install dependencies and build
log "Installing dependencies and building application"
npm install >/dev/null 2>&1
npm run build >/dev/null 2>&1

if [[ ! -f "dist/index.js" ]]; then
    error "Build failed - dist/index.js not found"
    exit 1
fi
success "Application built successfully"

# Setup database schema
log "Setting up database schema"
npm run db:push >/dev/null 2>&1
success "Database schema configured"

# Create PM2 configuration
log "Creating PM2 configuration"
mkdir -p logs

cat > ecosystem.config.cjs << EOF
module.exports = {
  apps: [{
    name: 'voltservers',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: '$DATABASE_URL',
      SESSION_SECRET: '$SESSION_SECRET'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Step 9: Configure Nginx
log "Configuring Nginx"
sudo rm -f /etc/nginx/sites-enabled/*

sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    
    client_max_body_size 50M;
    
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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/

if sudo nginx -t >/dev/null 2>&1; then
    success "Nginx configuration validated"
else
    error "Nginx configuration invalid"
    sudo nginx -t
    exit 1
fi

# Step 10: Start services
log "Starting VoltServers application"
pm2 delete voltservers >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs >/dev/null 2>&1
pm2 save >/dev/null 2>&1

log "Starting Nginx"
sudo systemctl start nginx
sudo systemctl enable nginx >/dev/null 2>&1

# Step 11: Verification
log "Verifying deployment"
sleep 10

# Test application
if curl -f -s --connect-timeout 10 http://localhost:5000 >/dev/null 2>&1; then
    success "VoltServers application responding on port 5000"
else
    error "VoltServers application not responding"
    pm2 logs voltservers --lines 5 --nostream
    exit 1
fi

# Test Nginx proxy
if curl -f -s --connect-timeout 10 http://localhost >/dev/null 2>&1; then
    success "Nginx proxy working"
else
    error "Nginx proxy not working"
    exit 1
fi

# Final success message
echo ""
success "🎉 VoltServers deployment completed successfully!"
echo ""
echo "Access Information:"
echo "  🌐 Website: http://$(curl -s ifconfig.me || echo '135.148.137.158')"
echo "  🔧 phpMyAdmin: http://$(curl -s ifconfig.me || echo '135.148.137.158'):8080/phpmyadmin"
echo ""
echo "Database Credentials:"
echo "  📊 Database: voltservers"
echo "  👤 Username: voltservers"
echo "  🔐 Password: $DB_PASSWORD"
echo ""
echo "Management Commands:"
echo "  pm2 status                    - Check application status"
echo "  pm2 logs voltservers          - View application logs"
echo "  pm2 restart voltservers       - Restart application"
echo "  sudo systemctl status nginx   - Check web server status"
echo ""

pm2 status