# Node.js Server Fix for 135.148.137.158

## Current Issue
URL `http://135.148.137.158/test/VoltServers-V1/` not working on your Node.js server.

## Common Problems & Solutions

### 1. Application Not Running
**Check if your Node.js app is running:**
```bash
# SSH into your server
ssh user@135.148.137.158

# Check running Node processes
ps aux | grep node
netstat -tlnp | grep :5000

# If not running, start it
cd /path/to/voltservers
npm start
# or with PM2
pm2 start ecosystem.config.js
```

### 2. Wrong Port/Path Configuration
Your app should run on port 5000 and be proxied by web server.

**Check your web server config:**
```bash
# For Nginx
sudo nano /etc/nginx/sites-available/default
# or
sudo nano /etc/nginx/sites-available/voltservers

# For Apache
sudo nano /etc/apache2/sites-available/000-default.conf
```

**Correct Nginx configuration:**
```nginx
server {
    listen 80;
    server_name 135.148.137.158;
    
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

### 3. Environment Variables Missing
**Check your .env file:**
```bash
cd /path/to/voltservers
cat .env
```

**Required variables:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/voltservers
PORT=5000
SESSION_SECRET=your_session_secret
```

### 4. Database Not Connected
**Test database connection:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U voltservers -d voltservers -c "SELECT 1;"
```

### 5. Build Issues
**Rebuild the application:**
```bash
cd /path/to/voltservers
npm install
npm run build
npm run db:push
```

### 6. Port/Firewall Issues
**Check firewall:**
```bash
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5000
```

**Test local access:**
```bash
curl http://localhost:5000
```

## Quick Fix Commands

**Run these on your server to diagnose:**
```bash
# 1. Check if app is running
pm2 status
# or
ps aux | grep node

# 2. Check web server
sudo systemctl status nginx
sudo nginx -t

# 3. Check application logs
pm2 logs voltservers
# or
tail -f /path/to/voltservers/logs/combined.log

# 4. Restart everything
pm2 restart voltservers
sudo systemctl restart nginx

# 5. Test local connection
curl -I http://localhost:5000
```

## Expected Result
After fixing, you should access your app at:
- `http://135.148.137.158/` (root domain, not subdirectory)
- Should show VoltServers homepage, not file listings

## If Still Not Working
1. Check application logs: `pm2 logs voltservers`
2. Check web server logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify the application directory structure matches the deployment guide
4. Ensure the built files exist in `dist/` directory