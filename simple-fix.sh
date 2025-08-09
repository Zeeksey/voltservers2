#!/bin/bash

# Simple VoltServers Fix - Handle existing database user

echo "🚀 Simple VoltServers Fix"
echo "========================"

cd /home/ubuntu/voltservers || exit 1

# Use existing database setup
DB_PASSWORD="voltservers123"  # Simple password
DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"

echo "Updating existing database user password..."
sudo -u postgres psql -c "ALTER USER voltservers PASSWORD '$DB_PASSWORD';"

echo "Testing database connection..."
if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U voltservers -d voltservers -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Database connection works"
else
    echo "❌ Database connection failed"
    exit 1
fi

echo "Starting VoltServers with inline environment variables..."
pm2 delete voltservers 2>/dev/null || true

# Start directly with environment variables
NODE_ENV=production \
PORT=5000 \
DATABASE_URL="$DATABASE_URL" \
SESSION_SECRET="voltservers-session-secret-2025" \
pm2 start dist/index.js --name voltservers

pm2 save

echo "Testing application..."
sleep 5

if curl -f -s http://localhost:5000 > /dev/null; then
    echo "✅ SUCCESS! VoltServers is running"
    echo ""
    echo "🌐 Access: http://135.148.137.158"
    echo "🔐 Database Password: $DB_PASSWORD"
    
    pm2 status
else
    echo "❌ Application not responding"
    pm2 logs voltservers --lines 5
fi