#!/bin/bash

# Debug 502 Bad Gateway error on Ubuntu server

echo "🔍 Debugging 502 Bad Gateway Error"
echo "=================================="

echo "1. Checking what's running on ports:"
echo "Port 80 (Nginx):"
sudo netstat -tlnp | grep ":80 " || echo "Nothing on port 80"

echo "Port 5000 (VoltServers):"
sudo netstat -tlnp | grep ":5000 " || echo "Nothing on port 5000"

echo ""
echo "2. Service status:"
echo "Nginx:"
sudo systemctl status nginx --no-pager -l | head -5

echo "PM2 processes:"
pm2 list

echo ""
echo "3. Testing connections:"
echo "Testing localhost:5000..."
curl -I http://localhost:5000 2>/dev/null | head -1 || echo "No response on port 5000"

echo "Testing localhost:80..."
curl -I http://localhost 2>/dev/null | head -1 || echo "No response on port 80"

echo ""
echo "4. Nginx error logs:"
sudo tail -5 /var/log/nginx/error.log 2>/dev/null || echo "No nginx error logs"

echo ""
echo "5. PM2 logs:"
pm2 logs voltservers --lines 3 --nostream 2>/dev/null || echo "No PM2 logs"

echo ""
echo "6. Quick fix suggestions:"
echo "If port 5000 is empty: VoltServers app not running"
echo "If port 80 is empty: Nginx not running"
echo "If both running but 502: Nginx can't reach app"