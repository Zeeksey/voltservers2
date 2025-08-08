# VoltServers Production Deployment Checklist

## ✅ Pre-Deployment Verification

### System Requirements
- [ ] Ubuntu 20.04+ server with minimum 2GB RAM
- [ ] Root/sudo access configured
- [ ] Domain name DNS pointing to server (optional)
- [ ] Server IP accessible (port 80/443 open)

### Application Verification
- [ ] Repository contains all required files:
  - [ ] `package.json` with correct scripts
  - [ ] `server/index.ts` (main server file)
  - [ ] `shared/schema.ts` (database schema)
  - [ ] `drizzle.config.ts` (database configuration)
  - [ ] `ecosystem.config.js` (PM2 configuration)
  - [ ] `.env.example` (environment template)

## 🚀 Deployment Steps

### Automated Deployment (Recommended)
```bash
curl -sSL https://raw.githubusercontent.com/yourusername/voltservers/main/ubuntu-setup.sh | bash
```

### Manual Deployment
1. **System Setup**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y curl wget git ufw fail2ban nginx certbot python3-certbot-nginx
   ```

2. **Install Node.js 20.x**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PostgreSQL**
   ```bash
   sudo apt install -y postgresql postgresql-contrib
   sudo systemctl start postgresql && sudo systemctl enable postgresql
   ```

4. **Configure Database**
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE voltservers;"
   sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD 'SECURE_PASSWORD';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;"
   ```

5. **Deploy Application**
   ```bash
   git clone https://github.com/yourusername/voltservers.git
   cd voltservers
   cp .env.example .env
   # Edit .env with your configuration
   npm install && npm run build && npm run db:push
   ```

6. **Configure PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start ecosystem.config.js --env production
   pm2 save && pm2 startup
   ```

7. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/voltservers
   # Add proxy configuration
   sudo ln -s /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

## 🔒 Security Configuration

### Firewall Setup
```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

### SSL Certificate (Let's Encrypt)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Fail2Ban Configuration
```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## ✅ Post-Deployment Verification

### Service Status Checks
- [ ] Application running: `pm2 status`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] PostgreSQL running: `sudo systemctl status postgresql`
- [ ] SSL certificate valid: `sudo certbot certificates`

### Functional Tests
- [ ] Website loads: `curl -I http://yourdomain.com`
- [ ] Database connected: `npm run db:push`
- [ ] Admin panel accessible: `/admin`
- [ ] Game pages load properly: `/minecraft`, `/rust`, etc.
- [ ] API endpoints respond: `/api/games`, `/api/theme-settings`

### Performance Tests
- [ ] Application starts quickly (< 10 seconds)
- [ ] Page load times acceptable (< 3 seconds)
- [ ] Memory usage reasonable (< 1GB)
- [ ] No critical errors in logs

## 🔧 Monitoring Setup

### Log Monitoring
```bash
# Application logs
pm2 logs voltservers

# System logs
sudo journalctl -u nginx -f

# Database logs
sudo journalctl -u postgresql -f
```

### Backup Configuration
```bash
# Daily database backup at 2 AM
echo "0 2 * * * pg_dump -h localhost -U voltservers -d voltservers > ~/backup_$(date +\%Y\%m\%d).sql" | crontab -
```

### Health Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure error alerting
- [ ] Monitor disk space and memory usage

## 📊 Performance Optimization

### Application Level
- [ ] Enable PM2 clustering: `instances: 'max'`
- [ ] Configure proper logging levels
- [ ] Set up log rotation
- [ ] Optimize database queries

### Server Level
- [ ] Configure Nginx caching for static assets
- [ ] Enable Gzip compression
- [ ] Set up CDN for static content (optional)
- [ ] Configure proper security headers

## 🔄 Maintenance Procedures

### Regular Updates
```bash
# Update application
cd voltservers
git pull origin main
npm install
npm run build
npm run db:push
pm2 restart voltservers

# System updates
sudo apt update && sudo apt upgrade -y
```

### Backup Verification
- [ ] Test database restore procedure
- [ ] Verify backup file integrity
- [ ] Document backup retention policy

## 🆘 Troubleshooting

### Common Issues
1. **Application won't start**
   - Check `.env` configuration
   - Verify database connection
   - Check application logs: `pm2 logs voltservers`

2. **Website not accessible**
   - Check Nginx configuration: `sudo nginx -t`
   - Verify firewall rules: `sudo ufw status`
   - Test local connection: `curl http://localhost:5000`

3. **Database connection errors**
   - Check PostgreSQL status: `sudo systemctl status postgresql`
   - Verify DATABASE_URL in `.env`
   - Test connection: `psql $DATABASE_URL`

### Emergency Procedures
- [ ] Document rollback procedure
- [ ] Have emergency contact information
- [ ] Know how to access server console

## 📈 Success Metrics

After deployment, your VoltServers platform should achieve:
- [ ] 99.9% uptime
- [ ] < 2 second page load times
- [ ] Zero critical security vulnerabilities
- [ ] Proper SSL certificate (A+ rating)
- [ ] Automated backups working
- [ ] All features functional (games, admin panel, blog, etc.)

---

## 🎯 Final Verification

Run the production verification script:
```bash
cd voltservers
./production-verify.sh
```

Your VoltServers platform is production-ready when all checks pass! 🚀