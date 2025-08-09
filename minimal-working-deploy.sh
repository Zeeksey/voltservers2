#!/bin/bash

# Minimal working deployment for VoltServers

echo "🚀 Minimal Working VoltServers Deployment"
echo "========================================="

cd /home/ubuntu/voltservers || exit 1

# Simple database setup
DB_PASSWORD="voltpass123"
DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"

echo "Setting up PostgreSQL..."
sudo systemctl start postgresql

# Create database and user if needed
sudo -u postgres psql -c "CREATE DATABASE IF NOT EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD' SUPERUSER CREATEDB;"

# Test database connection
if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U voltservers -d voltservers -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Database connection works"
else
    echo "❌ Database connection failed"
    exit 1
fi

echo "Installing fresh dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "Building application..."
npm run build

if [[ ! -f "dist/index.js" ]]; then
    echo "❌ Build failed"
    exit 1
fi

echo "Setting up database schema..."
DATABASE_URL="$DATABASE_URL" npm run db:push

echo "Testing application startup..."
timeout 10s env \
NODE_ENV=production \
PORT=5000 \
DATABASE_URL="$DATABASE_URL" \
SESSION_SECRET="volt-secret-2025" \
node dist/index.js || echo "App startup test completed"

echo ""
echo "Starting with PM2..."
pm2 delete voltservers 2>/dev/null || true

# Create simple PM2 ecosystem file
cat > start-app.js << EOF
module.exports = {
  apps: [{
    name: 'voltservers',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: '$DATABASE_URL',
      SESSION_SECRET: 'volt-secret-2025'
    }
  }]
};
EOF

pm2 start start-app.js

sleep 5

if curl -f -s http://localhost:5000 > /dev/null; then
    echo "✅ VoltServers running on port 5000"
    
    # Configure Nginx
    sudo systemctl stop nginx 2>/dev/null || true
    sudo rm -f /etc/nginx/sites-enabled/*
    
    sudo tee /etc/nginx/sites-available/voltservers > /dev/null << 'NGINX_EOF'
server {
    listen 80 default_server;
    server_name 135.148.137.158;
    
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX_EOF
    
    sudo ln -sf /etc/nginx/sites-available/voltservers /etc/nginx/sites-enabled/
    sudo systemctl start nginx
    
    if curl -f -s http://localhost > /dev/null; then
        echo "✅ SUCCESS! VoltServers deployed"
        echo "🌐 Access: http://135.148.137.158"
        echo "🔐 Database: voltservers / $DB_PASSWORD"
        pm2 save
        pm2 status
    else
        echo "❌ Nginx proxy issue"
    fi
else
    echo "❌ Application failed to start"
    pm2 logs voltservers --lines 10
fi