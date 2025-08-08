# VoltServers Ubuntu Server Deployment Guide

Complete step-by-step guide to deploy VoltServers on Ubuntu 20.04/22.04 server.

## Prerequisites

- Ubuntu 20.04 or 22.04 server
- Root or sudo access
- Server IP: 135.148.137.158 (replace with your IP)
- Internet connection

## Step 1: Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git ufw

# Configure firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 8080  # phpMyAdmin (if needed)
sudo ufw enable
```

## Step 2: Install Node.js 20.x

```bash
# Remove any existing Node.js
sudo apt remove -y nodejs npm

# Install Node.js 20.x from NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show npm version
```

## Step 3: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << 'EOF'
CREATE DATABASE voltservers;
CREATE USER voltservers WITH PASSWORD 'VoltPass2025!';
GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;
ALTER USER voltservers CREATEDB;
ALTER USER voltservers SUPERUSER;
\q
EOF

# Test database connection
PGPASSWORD='VoltPass2025!' psql -h localhost -U voltservers -d voltservers -c "SELECT 1;"
```

## Step 4: Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

## Step 5: Install and Configure Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Stop Nginx for configuration
sudo systemctl stop nginx

# Handle Apache conflict (if Apache is running)
if systemctl is-active --quiet apache2; then
    sudo sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf
    sudo sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf
    sudo systemctl restart apache2
    echo "Apache moved to port 8080"
fi

# Remove default Nginx configuration
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/default
```

## Step 6: Deploy VoltServers Application

```bash
# Clone the repository
cd /home/ubuntu
git clone https://github.com/Zeeksey/voltservers2.git voltservers
cd voltservers

# Create environment file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://voltservers:VoltPass2025!@localhost:5432/voltservers
SESSION_SECRET=VoltServers2025SecretKey!@#$%^&*()
EOF

# Install dependencies
npm install

# Build the application
npm run build

# Verify build
ls -la dist/index.js  # Should exist and be around 250KB

# Setup database schema
npm run db:push
```

## Step 7: Create PM2 Configuration

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'voltservers',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: 'postgresql://voltservers:VoltPass2025!@localhost:5432/voltservers',
      SESSION_SECRET: 'VoltServers2025SecretKey!@#$%^&*()'
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

# Create logs directory
mkdir -p logs
```

## Step 8: Configure Nginx

```bash
# Create VoltServers Nginx configuration
sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 135.148.137.158 _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    
    # Increase client max body size
    client_max_body_size 50M;
    
    # Main proxy configuration
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
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t
```

## Step 9: Start Services

```bash
# Start VoltServers with PM2
cd /home/ubuntu/voltservers
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup ubuntu -u ubuntu --hp /home/ubuntu
# Copy and run the command that PM2 outputs

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 10: Verify Deployment

```bash
# Wait for services to start
sleep 10

# Test VoltServers application directly
curl -I http://localhost:5000
# Should return: HTTP/1.1 200 OK

# Test Nginx proxy
curl -I http://localhost
# Should return: HTTP/1.1 200 OK

# Test external access
curl -I http://135.148.137.158
# Should return: HTTP/1.1 200 OK

# Check PM2 status
pm2 status
# Should show voltservers as 'online'

# Check Nginx status
sudo systemctl status nginx
# Should show 'active (running)'
```

## Step 11: Management Commands

```bash
# View application logs
pm2 logs voltservers

# Restart application
pm2 restart voltservers

# Stop application
pm2 stop voltservers

# Restart Nginx
sudo systemctl restart nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check system resources
pm2 monit
```

## Troubleshooting

### If VoltServers won't start:
```bash
# Check logs
pm2 logs voltservers --lines 20

# Test database connection
PGPASSWORD='VoltPass2025!' psql -h localhost -U voltservers -d voltservers -c "SELECT 1;"

# Test application manually
cd /home/ubuntu/voltservers
NODE_ENV=production PORT=5000 DATABASE_URL='postgresql://voltservers:VoltPass2025!@localhost:5432/voltservers' SESSION_SECRET='test' node dist/index.js
```

### If getting 502 Bad Gateway:
```bash
# Check if VoltServers is running
curl http://localhost:5000

# Check Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -10 /var/log/nginx/error.log
```

### If database connection fails:
```bash
# Restart PostgreSQL
sudo systemctl restart postgresql

# Recreate database user
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;"
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD 'VoltPass2025!' SUPERUSER CREATEDB;"
```

## Access Information

After successful deployment:

- **VoltServers Website**: http://135.148.137.158
- **phpMyAdmin** (if Apache was present): http://135.148.137.158:8080/phpmyadmin
- **Database**: voltservers / VoltPass2025!

## Security Notes

1. Change the default database password in production
2. Set up SSL certificate with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```
3. Consider setting up a domain name instead of using IP address
4. Regularly update the system: `sudo apt update && sudo apt upgrade`

## File Locations

- Application: `/home/ubuntu/voltservers`
- Logs: `/home/ubuntu/voltservers/logs/`
- Nginx config: `/etc/nginx/sites-available/voltservers`
- Environment: `/home/ubuntu/voltservers/.env`