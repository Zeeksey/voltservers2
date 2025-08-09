#!/bin/bash

# Immediate fix for VoltServers deployment
# This will get your application running on port 5000

echo "🔧 VoltServers Immediate Fix"
echo "==========================="

cd /home/ubuntu/voltservers || { echo "❌ Directory not found"; exit 1; }

# Stop everything
pm2 delete all 2>/dev/null || true

# Set up clean environment
DB_PASSWORD="VoltPass2025!"
DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"

# Ensure PostgreSQL is running
sudo systemctl start postgresql

# Recreate database user with proper permissions
sudo -u postgres psql >/dev/null 2>&1 << EOF
DROP DATABASE IF EXISTS voltservers;
DROP USER IF EXISTS voltservers;
CREATE DATABASE voltservers;
CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;
ALTER USER voltservers CREATEDB;
ALTER USER voltservers SUPERUSER;
EOF

echo "✅ Database configured"

# Test database connection
if ! PGPASSWORD="$DB_PASSWORD" psql -h localhost -U voltservers -d voltservers -c "SELECT 1;" >/dev/null 2>&1; then
    echo "❌ Database connection failed"
    exit 1
fi

echo "✅ Database connection verified"

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install --production

# Build application
npm run build

if [[ ! -f "dist/index.js" ]]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Application built"

# Set up database schema
DATABASE_URL="$DATABASE_URL" npm run db:push

echo "✅ Database schema set up"

# Create environment file
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=VoltServers2025SecretKey
EOF

# Test application directly first
echo "Testing application startup..."
timeout 10s env NODE_ENV=production PORT=5000 DATABASE_URL="$DATABASE_URL" SESSION_SECRET="VoltServers2025SecretKey" node dist/index.js &
APP_PID=$!
sleep 5

if curl -f -s http://localhost:5000 >/dev/null 2>&1; then
    echo "✅ Application works directly"
    kill $APP_PID 2>/dev/null || true
else
    echo "❌ Application fails to start"
    kill $APP_PID 2>/dev/null || true
    
    # Show the actual error
    echo "Running with full error output:"
    NODE_ENV=production PORT=5000 DATABASE_URL="$DATABASE_URL" SESSION_SECRET="VoltServers2025SecretKey" node dist/index.js
    exit 1
fi

# Create PM2 config
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'voltservers',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://voltservers:VoltPass2025!@localhost:5432/voltservers',
      SESSION_SECRET: 'VoltServers2025SecretKey'
    },
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

# Start with PM2
echo "Starting with PM2..."
pm2 start ecosystem.config.cjs

sleep 5

if curl -f -s http://localhost:5000 >/dev/null 2>&1; then
    echo "✅ VoltServers running on port 5000"
    
    # Save PM2 configuration
    pm2 save
    
    echo "✅ SUCCESS! VoltServers is now running"
    echo ""
    echo "🌐 Access: http://135.148.137.158"
    echo "🔧 Status: pm2 status"
    echo "📋 Logs: pm2 logs voltservers"
    
    pm2 status
else
    echo "❌ PM2 start failed"
    pm2 logs voltservers --lines 10
    exit 1
fi