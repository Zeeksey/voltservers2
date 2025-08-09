#!/bin/bash

# Debug deployment issues on 135.148.137.158

echo "🔍 VoltServers Deployment Debug"
echo "==============================="

# Check what's running on each port
echo "Port Status:"
echo "Port 80 (HTTP):"
sudo netstat -tlnp | grep ":80 " || echo "Nothing on port 80"

echo "Port 5000 (VoltServers App):"
sudo netstat -tlnp | grep ":5000 " || echo "Nothing on port 5000"

echo "Port 8080 (Apache):"
sudo netstat -tlnp | grep ":8080 " || echo "Nothing on port 8080"

echo ""
echo "Service Status:"
systemctl is-active nginx && echo "✓ Nginx running" || echo "✗ Nginx not running"
systemctl is-active apache2 && echo "✓ Apache running" || echo "✗ Apache not running"
systemctl is-active postgresql && echo "✓ PostgreSQL running" || echo "✗ PostgreSQL not running"

echo ""
echo "PM2 Status:"
pm2 list

echo ""
echo "Quick Test:"
echo "Testing localhost:80..."
curl -I http://localhost 2>/dev/null | head -1 || echo "No response on port 80"

echo "Testing localhost:5000..."
curl -I http://localhost:5000 2>/dev/null | head -1 || echo "No response on port 5000"

echo ""
echo "Recommended Fix:"
echo "Run: curl -sSL https://raw.githubusercontent.com/Zeeksey/voltservers2/main/ubuntu-setup.sh | bash"