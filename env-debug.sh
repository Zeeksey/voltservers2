#!/bin/bash

# Debug environment variable issues

echo "🔍 Environment Variable Debug"
echo "============================="

cd /home/ubuntu/voltservers || exit 1

echo "1. Checking .env file:"
if [[ -f ".env" ]]; then
    echo "✅ .env file exists"
    echo "Contents:"
    cat .env
else
    echo "❌ .env file missing"
fi

echo ""
echo "2. Testing direct Node.js execution:"
if [[ -f "dist/index.js" ]]; then
    echo "Testing with explicit environment variables..."
    
    DB_PASSWORD="testpass123"
    DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"
    
    echo "Setting up test database user..."
    sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" 2>/dev/null || true
    sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD' SUPERUSER;"
    
    echo "Testing Node.js app directly..."
    timeout 10s env NODE_ENV=production PORT=5000 DATABASE_URL="$DATABASE_URL" SESSION_SECRET="testsecret" node dist/index.js || echo "App test completed"
else
    echo "❌ dist/index.js not found"
fi

echo ""
echo "3. PM2 environment check:"
pm2 list
echo ""
echo "PM2 environment for voltservers:"
pm2 env voltservers 2>/dev/null || echo "No voltservers process found"