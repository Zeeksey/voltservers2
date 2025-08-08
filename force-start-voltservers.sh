#!/bin/bash

# Force start VoltServers with all components

echo "🚀 Force Starting VoltServers"
echo "============================="

cd /home/ubuntu/voltservers || exit 1

# Stop everything first
echo "Stopping all services..."
pm2 delete all 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true

# Set up database with known credentials
DB_PASSWORD="simple123"
DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"

echo "Configuring database..."
sudo -u postgres psql -c "ALTER USER voltservers PASSWORD '$DB_PASSWORD';" 2>/dev/null || {
    sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD' SUPERUSER CREATEDB;"
}

# Test database
if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U voltservers -d voltservers -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Database connection verified"
else
    echo "❌ Database issue"
    exit 1
fi

# Start VoltServers directly with Node.js first to test
echo "Testing VoltServers directly..."
timeout 5s env NODE_ENV=production PORT=5000 DATABASE_URL="$DATABASE_URL" SESSION_SECRET="test123" node dist/index.js &
sleep 3

if curl -f -s http://localhost:5000 > /dev/null; then
    echo "✅ VoltServers works directly"
    pkill -f "node dist/index.js"
else
    echo "❌ VoltServers doesn't work directly"
    pkill -f "node dist/index.js"
    echo "Checking build..."
    ls -la dist/index.js || echo "dist/index.js missing"
    exit 1
fi

# Start with PM2
echo "Starting with PM2..."
pm2 start dist/index.js \
  --name voltservers \
  --env NODE_ENV=production \
  --env PORT=5000 \
  --env DATABASE_URL="$DATABASE_URL" \
  --env SESSION_SECRET="test123"

sleep 3

if curl -f -s http://localhost:5000 > /dev/null; then
    echo "✅ PM2 start successful"
else
    echo "❌ PM2 start failed"
    pm2 logs voltservers --lines 5
    exit 1
fi

# Configure and start Nginx
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 135.148.137.158 _;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo rm -f /etc/nginx/sites-enabled/*
sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/

if sudo nginx -t; then
    echo "✅ Nginx config valid"
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    echo "❌ Nginx config invalid"
    sudo nginx -t
    exit 1
fi

# Final test
sleep 3
if curl -f -s http://localhost > /dev/null; then
    echo "✅ SUCCESS! VoltServers accessible through Nginx"
    echo ""
    echo "🌐 Access: http://135.148.137.158"
    echo "🔐 Database password: $DB_PASSWORD"
    
    pm2 save
    pm2 status
else
    echo "❌ Still getting 502 error"
    echo "Nginx error log:"
    sudo tail -3 /var/log/nginx/error.log
fi