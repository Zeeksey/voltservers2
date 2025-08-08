#!/bin/bash

# Diagnose VoltServers runtime error

echo "🔍 Diagnosing VoltServers Runtime Error"
echo "======================================"

cd /home/ubuntu/voltservers || exit 1

echo "1. Testing Node.js application with detailed output:"
echo "Setting up database connection..."

DB_PASSWORD="simple123"
DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"

# Ensure database user exists
sudo -u postgres psql -c "ALTER USER voltservers PASSWORD '$DB_PASSWORD';" 2>/dev/null || {
    sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD' SUPERUSER CREATEDB;"
}

echo "Running schema setup..."
DATABASE_URL="$DATABASE_URL" npm run db:push || echo "Schema setup may have failed"

echo ""
echo "2. Running application with full error output:"
NODE_ENV=production \
PORT=5000 \
DATABASE_URL="$DATABASE_URL" \
SESSION_SECRET="test123" \
node dist/index.js

echo ""
echo "If you see errors above, they explain why the app won't start."