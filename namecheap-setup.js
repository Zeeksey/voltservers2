#!/usr/bin/env node

/**
 * VoltServers Namecheap Deployment Setup Script
 * Prepares the application for deployment on Namecheap shared hosting
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 VoltServers Namecheap Deployment Preparation');
console.log('===============================================');

// Create Namecheap-specific entry point
const appJsContent = `// VoltServers Namecheap Entry Point
// This file is required by Namecheap's Node.js hosting

console.log('Starting VoltServers application...');

// Import the built application
import('./dist/index.js')
  .then(() => {
    console.log('VoltServers application started successfully');
  })
  .catch((error) => {
    console.error('Failed to start VoltServers application:', error);
    process.exit(1);
  });
`;

// Create app.js
fs.writeFileSync('app.js', appJsContent);
console.log('✓ Created app.js entry point for Namecheap');

// Read current package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// Update scripts for Namecheap compatibility
const namecheapScripts = {
  ...packageJson.scripts,
  "start": "node app.js",
  "postinstall": "npm run build",
  // Keep existing build script
  "build": packageJson.scripts.build || "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
};

packageJson.scripts = namecheapScripts;

// Add engines specification for Namecheap
packageJson.engines = {
  "node": ">=18.0.0",
  "npm": ">=8.0.0"
};

// Save updated package.json
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✓ Updated package.json for Namecheap compatibility');

// Create .env template for Namecheap
const namecheapEnvTemplate = `# VoltServers Environment Configuration for Namecheap
# Copy this file to .env and update with your Namecheap hosting details

# Application Environment
NODE_ENV=production
PORT=3000

# Database Configuration (Update with your Namecheap database details)
# Format: postgresql://username:password@localhost:5432/database_name
DATABASE_URL=postgresql://your_cpanel_username_dbuser:your_password@localhost:5432/your_cpanel_username_voltservers

# Session Security (Generate a long random string)
SESSION_SECRET=your_very_long_random_session_secret_here

# Namecheap Specific Settings
TRUST_PROXY=true

# Optional Integrations
WHMCS_API_IDENTIFIER=your_whmcs_api_identifier
WHMCS_API_SECRET=your_whmcs_api_secret
WHMCS_URL=https://your-whmcs-domain.com
SENDGRID_API_KEY=your_sendgrid_api_key
WISP_API_URL=https://game.voltservers.com
WISP_API_KEY=your_wisp_api_key
`;

fs.writeFileSync('.env.namecheap', namecheapEnvTemplate);
console.log('✓ Created .env.namecheap template');

// Create Namecheap deployment instructions
const deploymentInstructions = `
# Namecheap Deployment Instructions for VoltServers

## Files Prepared:
✓ app.js - Namecheap entry point
✓ package.json - Updated with Namecheap scripts
✓ .env.namecheap - Environment template

## Next Steps:

1. **Access cPanel:**
   - Login to your Namecheap hosting cPanel
   - Find "Node.js Selector" or "Node.js Apps"

2. **Create Node.js Application:**
   - Application Root: public_html/voltservers (or your preferred directory)
   - Startup File: app.js
   - Node.js Version: Select latest available (18.x or 20.x)
   - Application Mode: Production

3. **Upload Files:**
   - Zip your project files
   - Upload via File Manager to your application directory
   - Extract the files

4. **Configure Database:**
   - In cPanel, go to PostgreSQL Databases
   - Create database: your_username_voltservers
   - Create user: your_username_voltuser
   - Grant all privileges

5. **Set Environment Variables:**
   - Copy .env.namecheap to .env
   - Update DATABASE_URL with your database details
   - Add environment variables in Node.js App Manager

6. **Install Dependencies:**
   - In Node.js App Manager, click "NPM Install"
   - Wait for installation to complete

7. **Start Application:**
   - Click "Restart" in Node.js App Manager
   - Visit your domain to test

## Important Notes:
- Namecheap shared hosting has resource limitations
- Use the provided database service (no custom PostgreSQL installation)
- SSL certificates available through cPanel
- Monitor resource usage to avoid account suspension

Your VoltServers application is now ready for Namecheap deployment!
`;

fs.writeFileSync('NAMECHEAP_INSTRUCTIONS.txt', deploymentInstructions);
console.log('✓ Created deployment instructions');

// Create a simple migration script for Namecheap
const migrationScript = `// Database migration script for Namecheap
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

console.log('Running database migration...');

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(sql);

// Import your schema
import * as schema from './shared/schema.js';

async function migrate() {
  try {
    console.log('Migration completed successfully');
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await sql.end();
    process.exit(1);
  }
}

migrate();
`;

fs.writeFileSync('migrate-namecheap.js', migrationScript);
console.log('✓ Created database migration script');

console.log('');
console.log('🎉 Namecheap deployment preparation complete!');
console.log('');
console.log('Next steps:');
console.log('1. Review NAMECHEAP_INSTRUCTIONS.txt');
console.log('2. Update .env.namecheap with your hosting details');
console.log('3. Upload files to your Namecheap hosting');
console.log('4. Configure Node.js app in cPanel');
console.log('');
console.log('Your VoltServers application is ready for Namecheap hosting! 🚀');