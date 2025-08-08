# 🚀 Quick Deploy to Your Ubuntu Server (135.148.137.158)

## One-Command Deployment

**SSH into your server and run:**

```bash
# SSH to your server
ssh ubuntu@135.148.137.158

# Download and run the deployment script
curl -sSL https://raw.githubusercontent.com/your-username/voltservers/main/deploy-to-server.sh | bash
```

## What the Script Does:

✅ **System Setup**: Updates packages, installs security tools  
✅ **Firewall**: Configures UFW (ports 22, 80, 443)  
✅ **Node.js 20.x**: Installs latest stable version  
✅ **PostgreSQL**: Database setup with secure credentials  
✅ **PM2**: Process manager for high availability  
✅ **Application**: Clones repo, builds, and configures  
✅ **Nginx**: Reverse proxy with compression and caching  
✅ **Auto-Start**: PM2 startup configuration  
✅ **Verification**: Tests all components are working  

## After Deployment:

Your VoltServers platform will be live at:
**http://135.148.137.158**

## Manual Deployment (If Preferred)

If you prefer to deploy manually, follow these steps:

### 1. System Setup
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git ufw fail2ban nginx certbot python3-certbot-nginx
```

### 2. Security
```bash
sudo ufw allow ssh && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw --force enable
```

### 3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql && sudo systemctl enable postgresql
```

### 5. Database Setup
```bash
sudo -u postgres psql -c "CREATE DATABASE voltservers;"
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD 'YOUR_SECURE_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;"
```

### 6. Install PM2
```bash
sudo npm install -g pm2
```

### 7. Deploy App
```bash
git clone https://github.com/your-username/voltservers.git
cd voltservers
cp .env.example .env
# Edit .env with your database URL
npm install && npm run build && npm run db:push
```

### 8. Start with PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup
```

### 9. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/voltservers
# Add proxy configuration for port 5000
sudo ln -s /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## Troubleshooting

### If deployment fails:
```bash
# Check logs
pm2 logs voltservers
sudo journalctl -u nginx -f

# Restart services
pm2 restart voltservers
sudo systemctl restart nginx

# Check status
pm2 status
sudo systemctl status postgresql
```

### Common issues:
- **Port 5000 blocked**: Check firewall settings
- **Database connection**: Verify DATABASE_URL in .env  
- **Build failure**: Ensure Node.js 18+ is installed
- **Nginx errors**: Check configuration with `sudo nginx -t`

## Post-Deployment Steps

### 1. Set up SSL (Recommended)
```bash
sudo certbot --nginx -d yourdomain.com
```

### 2. Configure Domain
Point your domain's A record to: `135.148.137.158`

### 3. Set up Monitoring
```bash
# Daily database backup
echo "0 2 * * * pg_dump $DATABASE_URL > ~/backup_$(date +\%Y\%m\%d).sql" | crontab -
```

Your VoltServers game hosting platform is now ready for production! 🎮