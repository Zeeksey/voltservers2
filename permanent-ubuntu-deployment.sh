#!/bin/bash

# Permanent VoltServers Ubuntu Deployment Solution
# Comprehensive setup for production deployment on port 80

set -e

echo "🚀 VoltServers Permanent Ubuntu Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() { echo -e "${BLUE}[STEP]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
APP_USER="ubuntu"
APP_DIR="/home/$APP_USER/voltservers"
REPO_URL="https://github.com/Zeeksey/voltservers2"
SERVER_IP="135.148.137.158"

# Generate secure credentials
DB_NAME="voltservers"
DB_USER="voltservers"
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
SESSION_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)

print_step "Starting permanent VoltServers deployment"

# Step 1: System preparation
print_step "Preparing Ubuntu system"
export DEBIAN_FRONTEND=noninteractive
sudo apt update -qq
sudo apt install -y curl wget git build-essential software-properties-common ufw

# Step 2: Install Node.js 20.x
print_step "Installing Node.js 20.x"
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 20 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
print_success "Node.js $(node -v) installed"

# Step 3: Install PM2 globally
print_step "Installing PM2 process manager"
sudo npm install -g pm2
print_success "PM2 installed"

# Step 4: Install and configure PostgreSQL
print_step "Installing PostgreSQL"
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
print_success "PostgreSQL installed and started"

# Step 5: Configure PostgreSQL database
print_step "Configuring PostgreSQL database"
sudo -u postgres psql <<EOF
-- Drop existing database and user if they exist
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create new database and user
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;

-- Grant schema permissions
\c $DB_NAME;
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
EOF

# Test database connection
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" >/dev/null 2>&1; then
    print_success "Database connection verified"
else
    print_error "Database connection failed"
    exit 1
fi

# Step 6: Install and configure Nginx
print_step "Installing and configuring Nginx"
sudo apt install -y nginx

# Handle Apache conflict by moving it to port 8080
if systemctl is-active --quiet apache2; then
    print_warning "Moving Apache to port 8080"
    sudo sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf 2>/dev/null || true
    sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf 2>/dev/null || true
    sudo systemctl restart apache2
fi

# Stop nginx to configure
sudo systemctl stop nginx

# Remove default configurations
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/default

# Create VoltServers Nginx configuration
sudo tee /etc/nginx/sites-available/voltservers > /dev/null <<'NGINX_EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 135.148.137.158 _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Increase client max body size for uploads
    client_max_body_size 50M;
    
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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # Handle static assets efficiently
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
        access_log off;
    }
}
NGINX_EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/

# Test nginx configuration
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration is invalid"
    sudo nginx -t
    exit 1
fi

# Step 7: Configure firewall
print_step "Configuring UFW firewall"
sudo ufw --force reset
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS (for future SSL)
sudo ufw allow 8080/tcp  # Apache/phpMyAdmin
sudo ufw --force enable
print_success "Firewall configured"

# Step 8: Setup application
print_step "Setting up VoltServers application"

# Remove existing directory
if [[ -d "$APP_DIR" ]]; then
    rm -rf "$APP_DIR"
fi

# Clone repository
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

# Create production environment file
print_step "Creating production environment configuration"
cat > .env <<ENV_EOF
# VoltServers Production Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DATABASE_URL=$DATABASE_URL

# Session Security
SESSION_SECRET=$SESSION_SECRET

# Optional API Integrations (configure as needed)
# WHMCS_API_IDENTIFIER=your_whmcs_api_identifier
# WHMCS_API_SECRET=your_whmcs_api_secret
# WHMCS_URL=https://your-whmcs-domain.com
# SENDGRID_API_KEY=your_sendgrid_api_key
# WISP_API_URL=https://game.voltservers.com
# WISP_API_KEY=your_wisp_api_key

# Production optimizations
MAX_OLD_SPACE_SIZE=2048
UV_THREADPOOL_SIZE=128
ENV_EOF

print_success "Environment configuration created"

# Step 9: Install dependencies and build
print_step "Installing dependencies"
npm install  # Install all dependencies including dev dependencies for build

print_step "Building application"
npm run build

# Verify build
if [[ ! -f "dist/index.js" ]]; then
    print_error "Build failed - dist/index.js not found"
    exit 1
fi
print_success "Application built successfully"

# Step 10: Setup database schema
print_step "Setting up database schema"
npm run db:push
print_success "Database schema configured"

# Step 11: Create production PM2 configuration
print_step "Creating PM2 production configuration"
mkdir -p logs

cat > ecosystem.config.cjs <<'PM2_EOF'
module.exports = {
  apps: [{
    name: 'voltservers',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    
    // Logging
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Restart configuration
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 5,
    restart_delay: 5000,
    
    // Performance optimization
    node_args: '--max-old-space-size=2048',
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true
  }]
};
PM2_EOF

# Step 12: Start services
print_step "Starting VoltServers application"

# Stop any existing processes
pm2 delete voltservers 2>/dev/null || true

# Start application
pm2 start ecosystem.config.cjs --env production
pm2 save

# Setup PM2 startup script
pm2 startup ubuntu -u "$APP_USER" --hp "/home/$APP_USER" | grep -v "sudo env PATH" | sudo bash || true

print_success "VoltServers application started"

# Step 13: Start Nginx
print_step "Starting Nginx web server"
sudo systemctl start nginx
sudo systemctl enable nginx
print_success "Nginx started and enabled"

# Step 14: Comprehensive testing
print_step "Testing deployment"
sleep 10

# Test application directly
if curl -f -s --connect-timeout 10 http://localhost:5000 > /dev/null; then
    print_success "VoltServers app responding on port 5000"
else
    print_error "VoltServers app not responding on port 5000"
    print_warning "Checking PM2 logs..."
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
if curl -f -s --connect-timeout 10 http://$SERVER_IP > /dev/null; then
    print_success "External access confirmed"
else
    print_warning "External access may need time to propagate"
fi

# Step 15: Create management scripts
print_step "Creating management scripts"

# Status check script
cat > /home/$APP_USER/voltservers-status.sh <<'STATUS_EOF'
#!/bin/bash
echo "VoltServers Status Report"
echo "========================"
echo "PM2 Status:"
pm2 status
echo ""
echo "Nginx Status:"
sudo systemctl status nginx --no-pager -l
echo ""
echo "Database Status:"
sudo systemctl status postgresql --no-pager -l
echo ""
echo "Port Check:"
sudo netstat -tlnp | grep -E ":(80|5000|8080) "
echo ""
echo "Recent Logs:"
pm2 logs voltservers --lines 5 --nostream
STATUS_EOF

chmod +x /home/$APP_USER/voltservers-status.sh

# Restart script
cat > /home/$APP_USER/voltservers-restart.sh <<'RESTART_EOF'
#!/bin/bash
echo "Restarting VoltServers..."
pm2 restart voltservers
echo "Restarting Nginx..."
sudo systemctl restart nginx
echo "Status:"
pm2 status
RESTART_EOF

chmod +x /home/$APP_USER/voltservers-restart.sh

# Step 16: Display final results
echo ""
print_success "🎉 VoltServers permanent deployment completed!"
echo ""
echo "🌐 Access Information:"
echo "   VoltServers Website: http://$SERVER_IP"
echo "   phpMyAdmin (if Apache): http://$SERVER_IP:8080/phpmyadmin"
echo ""
echo "🔐 Database Credentials:"
echo "   Database: $DB_NAME"
echo "   Username: $DB_USER"
echo "   Password: $DB_PASSWORD"
echo ""
echo "🔧 Management Commands:"
echo "   ./voltservers-status.sh     - Check status"
echo "   ./voltservers-restart.sh    - Restart services"
echo "   pm2 logs voltservers        - View logs"
echo "   pm2 monit                   - Monitor performance"
echo ""
echo "📁 Important Locations:"
echo "   Application: $APP_DIR"
echo "   Logs: $APP_DIR/logs/"
echo "   Environment: $APP_DIR/.env"
echo "   Nginx Config: /etc/nginx/sites-available/voltservers"
echo ""
echo "📊 System Architecture:"
echo "   Port 80  → Nginx → Port 5000 (VoltServers)"
echo "   Port 8080 → Apache/phpMyAdmin"
echo "   PostgreSQL → localhost:5432"
echo ""
echo "🔒 Security Features:"
echo "   ✓ UFW Firewall configured"
echo "   ✓ Nginx security headers"
echo "   ✓ PM2 process monitoring"
echo "   ✓ Database user isolation"
echo ""

# Final status check
print_step "Final system status"
pm2 status