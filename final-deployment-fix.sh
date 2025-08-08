#!/bin/bash

# Final VoltServers Deployment Fix - Resolves DATABASE_URL environment variable issue

set -e

echo "🔧 Final VoltServers Deployment Fix"
echo "==================================="

APP_DIR="/home/ubuntu/voltservers"
cd "$APP_DIR" || exit 1

# Generate secure credentials
DB_PASSWORD=$(openssl rand -base64 25 | tr -d "=+/")
SESSION_SECRET=$(openssl rand -base64 50 | tr -d "=+/")
DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"

echo "Setting up database user..."
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD' SUPERUSER CREATEDB;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;"

echo "Creating .env file with proper format..."
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
EOF

echo "Testing database connection..."
if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U voltservers -d voltservers -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Database connection verified"
else
    echo "❌ Database connection failed"
    exit 1
fi

echo "Setting up database schema..."
npm run db:push

echo "Creating PM2 configuration with explicit environment variables..."
cat > ecosystem.production.js << EOF
module.exports = {
  apps: [{
    name: 'voltservers',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: '$DATABASE_URL',
      SESSION_SECRET: '$SESSION_SECRET'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

echo "Stopping existing processes..."
pm2 delete voltservers 2>/dev/null || true
pm2 delete all 2>/dev/null || true

echo "Starting VoltServers with explicit environment..."
mkdir -p logs

# Method 1: Start with PM2 config that includes environment variables
pm2 start ecosystem.production.js

# Wait and check
sleep 5

if curl -f -s http://localhost:5000 > /dev/null; then
    echo "✅ VoltServers running successfully!"
    echo ""
    echo "🌐 Access: http://135.148.137.158"
    echo "🔐 Database Password: $DB_PASSWORD"
    
    # Save PM2 configuration
    pm2 save
    
    # Show status
    pm2 status
    
else
    echo "❌ Still not responding, trying alternative method..."
    
    # Method 2: Start with inline environment variables
    pm2 delete voltservers 2>/dev/null || true
    
    NODE_ENV=production PORT=5000 DATABASE_URL="$DATABASE_URL" SESSION_SECRET="$SESSION_SECRET" pm2 start dist/index.js --name voltservers
    
    sleep 5
    
    if curl -f -s http://localhost:5000 > /dev/null; then
        echo "✅ VoltServers running with alternative method!"
        pm2 save
    else
        echo "❌ Application still not responding"
        echo "Checking logs..."
        pm2 logs voltservers --lines 10
        echo ""
        echo "Environment check:"
        echo "DATABASE_URL length: ${#DATABASE_URL}"
        echo "First 20 chars: ${DATABASE_URL:0:20}..."
    fi
fi

pm2 status