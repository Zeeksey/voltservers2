#!/bin/bash

echo "=== VoltServers Server Diagnosis ==="
echo "Server IP: 135.148.137.158"
echo "Attempted URL: http://135.148.137.158/test/VoltServers-V1/"
echo ""

echo "Run these commands on your server (135.148.137.158) to diagnose:"
echo ""

echo "1. Check if Node.js is installed:"
echo "   node --version"
echo "   npm --version"
echo ""

echo "2. Check if your application is running:"
echo "   ps aux | grep node"
echo "   netstat -tlnp | grep :5000"
echo ""

echo "3. Check web server status:"
echo "   systemctl status nginx"
echo "   systemctl status apache2"
echo ""

echo "4. Check if files are in correct location:"
echo "   ls -la /var/www/html/"
echo "   ls -la /home/"
echo ""

echo "5. Check firewall rules:"
echo "   ufw status"
echo "   iptables -L"
echo ""

echo "6. Test local application:"
echo "   curl http://localhost:5000"
echo ""

echo "=== Next Steps ==="
echo "Based on your URL structure, it appears you may have:"
echo "- Uploaded files to /var/www/html/test/VoltServers-V1/"
echo "- But this is a Node.js app that needs to run as a service"
echo ""
echo "Solutions:"
echo "A. Use the Ubuntu deployment guide for proper Node.js setup"
echo "B. Or use Replit's deployment feature for easier hosting"