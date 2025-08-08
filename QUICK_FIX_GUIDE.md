# Quick Fix for Server 135.148.137.158

Your VoltServers application is not working because it's a **Node.js application** that needs to run as a service, not static files.

## Current Problem
- URL: `http://135.148.137.158/test/VoltServers-V1/`
- This suggests files were uploaded to `/var/www/html/test/VoltServers-V1/`
- But VoltServers needs Node.js server to run

## Quick Solutions

### Option 1: Proper Node.js Deployment (Recommended)

**SSH into your server (135.148.137.158) and run:**

```bash
# Remove static files if uploaded
sudo rm -rf /var/www/html/test/VoltServers-V1/

# Download and run the setup script
curl -sSL https://raw.githubusercontent.com/yourusername/voltservers/main/ubuntu-setup.sh | bash
```

This will:
- Install Node.js, PostgreSQL, Nginx
- Deploy your application properly
- Make it accessible at `http://135.148.137.158/`

### Option 2: Manual Quick Setup

**If you prefer manual setup:**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup your app
git clone https://github.com/yourusername/voltservers.git
cd voltservers
npm install
npm run build

# Create environment file
cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL=your_database_url_here
PORT=5000
SESSION_SECRET=your_session_secret
EOF

# Start the application
pm2 start dist/index.js --name voltservers

# Configure Nginx to proxy to your app
sudo nano /etc/nginx/sites-available/default
```

**Add this to Nginx config:**
```nginx
server {
    listen 80;
    server_name 135.148.137.158;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Restart Nginx
sudo systemctl restart nginx
```

### Option 3: Use Replit Deployment (Easiest)

Instead of managing your own server:

1. In your Replit project, click "Deploy" 
2. Choose "Autoscale" deployment
3. Get a `yourapp.replit.app` URL that works automatically

## Why Static File Hosting Doesn't Work

VoltServers is a **full-stack application** that requires:
- Node.js runtime for the backend API
- PostgreSQL database
- Real-time server communication
- Session management

Static file hosting only serves HTML/CSS/JS files without server functionality.

## Test After Setup

Once properly deployed, your app should be accessible at:
- `http://135.148.137.158/` (not in a subdirectory)

You should see the VoltServers homepage with working game listings, not a file directory.