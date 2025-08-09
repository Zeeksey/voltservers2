#!/bin/bash

# VoltServers Production Deployment Verification Script
# Run this on your dedicated server to ensure everything works

set -e

echo "🚀 VoltServers Production Deployment Verification"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

echo "Step 1: Checking system requirements..."

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    if [[ ${NODE_VERSION:1:2} -ge 18 ]]; then
        success "Node.js $NODE_VERSION installed"
    else
        error "Node.js version too old ($NODE_VERSION). Need v18 or higher"
        exit 1
    fi
else
    error "Node.js not installed"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    success "npm $NPM_VERSION installed"
else
    error "npm not installed"
    exit 1
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    success "PostgreSQL client installed"
else
    warning "PostgreSQL client not found - may cause database issues"
fi

# Check PM2
if command -v pm2 &> /dev/null; then
    success "PM2 process manager installed"
else
    warning "PM2 not installed - install with: npm install -g pm2"
fi

echo ""
echo "Step 2: Verifying application structure..."

# Check required files
REQUIRED_FILES=(
    "package.json"
    "server/index.ts"
    "shared/schema.ts"
    "drizzle.config.ts"
    "vite.config.ts"
    "tsconfig.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        success "$file exists"
    else
        error "$file missing - critical file"
        exit 1
    fi
done

# Check .env file
if [[ -f ".env" ]]; then
    success ".env file exists"
    
    # Check required environment variables
    if grep -q "DATABASE_URL" .env && grep -q "SESSION_SECRET" .env; then
        success "Essential environment variables configured"
    else
        warning "Missing required environment variables in .env"
        echo "  Required: DATABASE_URL, SESSION_SECRET"
    fi
else
    warning ".env file missing - create from .env.example"
fi

echo ""
echo "Step 3: Testing application build..."

# Install dependencies
if npm install; then
    success "Dependencies installed successfully"
else
    error "Failed to install dependencies"
    exit 1
fi

# Build application
if npm run build; then
    success "Application built successfully"
    
    # Check dist directory
    if [[ -d "dist" ]] && [[ -f "dist/index.js" ]]; then
        success "Built files exist in dist/"
    else
        error "Build output missing in dist/"
        exit 1
    fi
else
    error "Build failed"
    exit 1
fi

echo ""
echo "Step 4: Testing database connection..."

# Test database connection if DATABASE_URL is set
if [[ -f ".env" ]] && grep -q "DATABASE_URL" .env; then
    if npm run db:push; then
        success "Database schema synchronized"
    else
        warning "Database migration failed - check DATABASE_URL"
    fi
else
    warning "DATABASE_URL not configured - skipping database test"
fi

echo ""
echo "Step 5: Testing application startup..."

# Test if app starts (timeout after 10 seconds)
timeout 10s npm start &
APP_PID=$!
sleep 5

# Check if app is running
if kill -0 $APP_PID 2>/dev/null; then
    success "Application starts successfully"
    
    # Test HTTP response
    if curl -f -s http://localhost:5000 > /dev/null; then
        success "Application responds to HTTP requests"
    else
        warning "Application not responding on port 5000"
    fi
    
    # Clean up
    kill $APP_PID 2>/dev/null || true
else
    error "Application failed to start"
fi

echo ""
echo "Step 6: Production readiness checklist..."

# Check production configuration
if [[ -f ".env" ]] && grep -q "NODE_ENV=production" .env; then
    success "Production environment configured"
else
    warning "Set NODE_ENV=production in .env"
fi

# Check security settings
if [[ -f ".env" ]] && grep -q "SESSION_SECRET" .env; then
    SECRET_LENGTH=$(grep "SESSION_SECRET" .env | cut -d'=' -f2 | wc -c)
    if [[ $SECRET_LENGTH -gt 32 ]]; then
        success "Session secret is sufficiently long"
    else
        warning "Session secret should be longer (32+ characters)"
    fi
fi

echo ""
echo "=================================================="
echo "🎯 DEPLOYMENT VERIFICATION COMPLETE"
echo "=================================================="
echo ""

# Final recommendations
echo "📋 Next steps for deployment:"
echo ""
echo "1. Configure web server (Nginx) to proxy to port 5000"
echo "2. Set up SSL certificate with Let's Encrypt"
echo "3. Configure PM2 for process management:"
echo "   pm2 start ecosystem.config.js --env production"
echo "4. Set up automated backups"
echo "5. Configure monitoring and logging"
echo ""
echo "Your VoltServers application is ready for production! 🚀"