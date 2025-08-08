#!/bin/bash

# Fix DATABASE_URL environment variable issue

echo "🔧 Fixing Database Connection"
echo "============================"

cd /home/ubuntu/voltservers || exit 1

# Generate secure database password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
SESSION_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)

echo "Setting up database user..."
# Recreate database user with new password
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;"
sudo -u postgres psql -c "ALTER USER voltservers CREATEDB;"

DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers"

echo "Creating .env file..."
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
EOF

echo "✅ Environment file created with DATABASE_URL"

# Stop current process
pm2 delete voltservers 2>/dev/null || true

# Test database connection
echo "Testing database connection..."
if psql "$DATABASE_URL" -c "SELECT 1;" >/dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Setup database schema
echo "Setting up database schema..."
npm run db:push

# Start application with explicit environment
echo "Starting VoltServers with environment variables..."
pm2 start dist/index.js --name voltservers --env NODE_ENV=production --env PORT=5000 --env DATABASE_URL="$DATABASE_URL" --env SESSION_SECRET="$SESSION_SECRET"

pm2 save

# Test application
sleep 5
if curl -f -s http://localhost:5000 > /dev/null; then
    echo "✅ VoltServers running successfully"
    echo ""
    echo "🌐 Access: http://135.148.137.158"
    echo "🔐 Database Password: $DB_PASSWORD"
else
    echo "❌ Application still not responding"
    pm2 logs voltservers --lines 10
fi

pm2 status