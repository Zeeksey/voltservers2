#!/bin/bash

# Quick start VoltServers if already deployed but not running

echo "🚀 Quick Starting VoltServers"
echo "============================="

cd /home/ubuntu/voltservers || exit 1

# Stop existing processes
pm2 delete voltservers 2>/dev/null || true

# Build if needed
if [[ ! -f "dist/index.js" ]]; then
    echo "Building application..."
    npm run build
fi

# Start with simple PM2 command
echo "Starting VoltServers..."
pm2 start dist/index.js --name voltservers --env NODE_ENV=production --env PORT=5000

# Save PM2 config
pm2 save

# Test
sleep 3
if curl -f -s http://localhost:5000 > /dev/null; then
    echo "✅ VoltServers running on port 5000"
else
    echo "❌ VoltServers not responding"
    pm2 logs voltservers --lines 5
fi

pm2 status