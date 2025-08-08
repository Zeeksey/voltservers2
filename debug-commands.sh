#!/bin/bash

echo "=== VoltServers Node.js Server Debug ==="
echo "Server: 135.148.137.158"
echo "Current URL: http://135.148.137.158/test/VoltServers-V1/"
echo ""

echo "Run these commands on your server to debug:"
echo ""

echo "# 1. Check Node.js application status"
echo "pm2 status"
echo "ps aux | grep node"
echo ""

echo "# 2. Check if application is listening on port 5000"
echo "netstat -tlnp | grep :5000"
echo "curl -I http://localhost:5000"
echo ""

echo "# 3. Check web server configuration"
echo "sudo systemctl status nginx"
echo "sudo nginx -t"
echo "cat /etc/nginx/sites-available/default"
echo ""

echo "# 4. Check application logs"
echo "pm2 logs voltservers --lines 50"
echo ""

echo "# 5. Check web server logs"
echo "sudo tail -20 /var/log/nginx/error.log"
echo "sudo tail -20 /var/log/nginx/access.log"
echo ""

echo "# 6. Check application directory"
echo "ls -la /path/to/voltservers/"
echo "ls -la /path/to/voltservers/dist/"
echo ""

echo "# 7. Check environment variables"
echo "cat /path/to/voltservers/.env"
echo ""

echo "# 8. Test database connection"
echo "psql -h localhost -U voltservers -d voltservers -c 'SELECT 1;'"
echo ""

echo "=== Common Fixes ==="
echo ""
echo "# If app not running:"
echo "cd /path/to/voltservers"
echo "pm2 start ecosystem.config.js --env production"
echo ""
echo "# If web server not configured:"
echo "sudo nano /etc/nginx/sites-available/default"
echo "# Add proxy_pass http://localhost:5000 configuration"
echo "sudo systemctl restart nginx"
echo ""
echo "# If app needs rebuild:"
echo "npm run build"
echo "pm2 restart voltservers"
echo ""

echo "Expected working URL: http://135.148.137.158/ (not in subdirectory)"