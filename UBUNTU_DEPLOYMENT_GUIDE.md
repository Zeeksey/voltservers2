# VoltServers Ubuntu Setup Guide

Complete deployment guide for your game hosting platform on Ubuntu server.

---

## 🚀 AUTOMATED SETUP (RECOMMENDED)

**Single Command Installation:**
```bash
curl -sSL https://raw.githubusercontent.com/yourusername/voltservers/main/ubuntu-setup.sh | bash
```

This will automatically handle everything below. **Skip to the bottom for post-installation steps.**

---

## 📋 MANUAL SETUP INSTRUCTIONS

### Prerequisites
- Ubuntu 20.04+ server with sudo access
- At least 2GB RAM and 20GB storage
- Domain name (optional but recommended)

### 1. System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y curl wget git ufw fail2ban nginx certbot python3-certbot-nginx

# Configure firewall
sudo ufw allow ssh && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw --force enable
```

### 2. Install Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install PostgreSQL
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql && sudo systemctl enable postgresql

# Create database (replace 'SECURE_PASSWORD' with your password)
sudo -u postgres psql -c "CREATE DATABASE voltservers;"
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD 'SECURE_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;"
sudo -u postgres psql -c "ALTER USER voltservers CREATEDB;"
```

### 4. Install PM2 Process Manager
```bash
sudo npm install -g pm2
```

### 5. Deploy Application
```bash
# Clone your repository (replace with your GitHub URL)
git clone https://github.com/yourusername/voltservers.git
cd voltservers

# Install dependencies
npm install

# Create environment file
nano .env
```

**Add to .env file:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://voltservers:SECURE_PASSWORD@localhost:5432/voltservers
PORT=5000
SESSION_SECRET=your_very_long_random_session_secret_here

# Optional integrations
WHMCS_API_IDENTIFIER=your_whmcs_api_identifier
WHMCS_API_SECRET=your_whmcs_api_secret
WHMCS_URL=https://your-whmcs-domain.com
SENDGRID_API_KEY=your_sendgrid_api_key
WISP_API_URL=https://game.voltservers.com
WISP_API_KEY=your_wisp_api_key
```

```bash
# Setup database and build
npm run db:push
npm run build

# Create PM2 config
nano ecosystem.config.js
```

**Add to ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'voltservers',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: { NODE_ENV: 'production' },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

```bash
# Start with PM2
mkdir logs
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup
```

### 6. Configure Nginx
```bash
# Create Nginx config (replace YOUR-DOMAIN.com with your domain)
sudo nano /etc/nginx/sites-available/voltservers
```

**Add to Nginx config:**
```nginx
server {
    listen 80;
    server_name YOUR-DOMAIN.com www.YOUR-DOMAIN.com;

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
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

### 7. SSL Certificate (Optional)
```bash
sudo certbot --nginx -d YOUR-DOMAIN.com -d www.YOUR-DOMAIN.com
```

### 8. Setup Backups
```bash
# Create backup script
cat > ~/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/backups"
mkdir -p $BACKUP_DIR
pg_dump -h localhost -U voltservers -d voltservers > $BACKUP_DIR/voltservers_db_$DATE.sql
find $BACKUP_DIR -name "voltservers_db_*.sql" -mtime +7 -delete
echo "Backup completed: voltservers_db_$DATE.sql"
EOF

chmod +x ~/backup-db.sh

# Schedule daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * $HOME/backup-db.sh") | crontab -
```

### 9. Create Deployment Script
```bash
cat > ~/deploy.sh << 'EOF'
#!/bin/bash
cd voltservers
echo "Pulling latest changes..."
git pull origin main
echo "Installing dependencies..."
npm install
echo "Building application..."
npm run build
echo "Running migrations..."
npm run db:push
echo "Restarting application..."
pm2 restart voltservers
echo "Deployment completed!"
EOF

chmod +x ~/deploy.sh
```

---

## ✅ POST-INSTALLATION

### Verify Everything is Working
```bash
# Check services status
pm2 status                              # Application status
sudo systemctl status nginx             # Web server
sudo systemctl status postgresql        # Database

# Monitor logs
pm2 logs voltservers                     # Application logs
sudo tail -f /var/log/nginx/access.log   # Web access logs
```

### Access Your Site
- **Without domain:** `http://YOUR_SERVER_IP`
- **With domain:** `http://YOUR-DOMAIN.com`

### Domain Setup
Point your domain's DNS records to your server:
- `A` record: `@` → `YOUR_SERVER_IP`
- `A` record: `www` → `YOUR_SERVER_IP`

### Future Updates
```bash
# Deploy new changes
~/deploy.sh

# Check application health
pm2 monit
```

---

## 🔧 TROUBLESHOOTING

**Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**Database connection issues:**
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
```

**Application not starting:**
```bash
pm2 logs voltservers --lines 50
pm2 restart voltservers
```

**Nginx errors:**
```bash
sudo nginx -t
sudo systemctl status nginx
```

---

## 📊 MONITORING COMMANDS

```bash
# System resources
htop

# Disk space
df -h

# Memory usage
free -h

# Real-time monitoring
pm2 monit

# View all logs
pm2 logs
```

Your VoltServers platform is now running with enterprise-grade reliability on Ubuntu!