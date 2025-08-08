#!/bin/bash

# Simple deployment fix for VoltServers

echo "🚀 Simple VoltServers Fix"
echo "========================"

# Go to app directory
cd /home/ubuntu/voltservers || {
    echo "Creating voltservers directory..."
    git clone https://github.com/Zeeksey/voltservers2 /home/ubuntu/voltservers
    cd /home/ubuntu/voltservers
}

# Install dependencies if needed
if [[ ! -d "node_modules" ]]; then
    echo "Installing dependencies..."
    npm install
fi

# Build if needed
if [[ ! -f "dist/index.js" ]]; then
    echo "Building application..."
    npm run build
fi

# Generate credentials
DB_PASSWORD=$(openssl rand -base64 20 | tr -d "=+/")
SESSION_SECRET=$(openssl rand -base64 40 | tr -d "=+/")

# Setup database
echo "Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE IF NOT EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS voltservers;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER voltservers WITH PASSWORD '$DB_PASSWORD';" 
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voltservers TO voltservers;"

# Create environment with inline variables
echo "Starting VoltServers..."
pm2 delete voltservers 2>/dev/null || true

# Start with all environment variables inline
pm2 start dist/index.js \
  --name voltservers \
  --env NODE_ENV=production \
  --env PORT=5000 \
  --env DATABASE_URL="postgresql://voltservers:$DB_PASSWORD@localhost:5432/voltservers" \
  --env SESSION_SECRET="$SESSION_SECRET"

pm2 save

echo "Testing..."
sleep 5

if curl -f -s http://localhost:5000 > /dev/null; then
    echo "✅ Success! VoltServers is running"
    echo "🌐 Visit: http://135.148.137.158"
else
    echo "❌ Still having issues"
    pm2 logs voltservers --lines 5
fi