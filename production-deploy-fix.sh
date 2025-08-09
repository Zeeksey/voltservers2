#!/bin/bash

# Production VoltServers Deployment Fix
# Addresses build dependency and database connection issues

set -e

echo "🔧 VoltServers Production Deployment Fix"
echo "========================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

APP_DIR="/home/ubuntu/voltservers"
REPO_URL="https://github.com/Zeeksey/voltservers2"

# Generate secure credentials
DB_PASSWORD=$(openssl rand -base64 25 | tr -d "=+/")
SESSION_SECRET=$(openssl rand -base64 50 | tr -d "=+/")

print_step "Installing system dependencies"
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx git curl

print_step "Installing PM2"
sudo npm install -g pm2

print_step "Starting PostgreSQL"
sudo systemctl start postgresql
sudo systemctl enable postgresql

print_step "Setting up database with proper permissions"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" 2>/dev/null || true

# Create database and user with all necessary permissions
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

print_step "Setting up application"
if [[ -d "$APP_DIR" ]]; then
    rm -rf "$APP_DIR"
fi

git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

print_step "Installing ALL dependencies (including dev dependencies for build)"
npm install  # Install all dependencies including dev dependencies

print_step "Creating environment file"
cat > .env <<EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
EOF

print_step "Building application"
npm run build

if [[ ! -f "dist/index.js" ]]; then
    print_error "Build failed"
    ls -la dist/ || echo "dist directory doesn't exist"
    exit 1
fi

print_step "Setting up database schema"
npm run db:push

print_step "Configuring Nginx"
# Handle Apache conflict
if systemctl is-active --quiet apache2; then
    sudo sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf 2>/dev/null || true
    sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf 2>/dev/null || true
    sudo systemctl restart apache2
fi

sudo systemctl stop nginx 2>/dev/null || true
sudo rm -f /etc/nginx/sites-enabled/*

sudo tee /etc/nginx/sites-available/voltservers > /dev/null <<'EOF'
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
sudo nginx -t

print_step "Starting VoltServers application"
pm2 delete voltservers 2>/dev/null || true

# Start with explicit environment variables
pm2 start dist/index.js \
  --name voltservers \
  --env NODE_ENV=production \
  --env PORT=5000 \
  --env DATABASE_URL="$DATABASE_URL" \
  --env SESSION_SECRET="$SESSION_SECRET"

pm2 save

print_step "Starting Nginx"
sudo systemctl start nginx
sudo systemctl enable nginx

print_step "Testing deployment"
sleep 10

if curl -f -s http://localhost:5000 > /dev/null; then
    print_success "VoltServers app running on port 5000"
else
    print_error "App not responding"
    pm2 logs voltservers --lines 10
    exit 1
fi

if curl -f -s http://localhost > /dev/null; then
    print_success "Nginx proxy working"
else
    print_error "Nginx proxy failed"
    exit 1
fi

print_success "Deployment completed successfully!"
echo ""
echo "Access your VoltServers at: http://135.148.137.158"
echo "Database password: $DB_PASSWORD"
echo ""
echo "Management commands:"
echo "  pm2 status"
echo "  pm2 logs voltservers"
echo "  pm2 restart voltservers"

pm2 status