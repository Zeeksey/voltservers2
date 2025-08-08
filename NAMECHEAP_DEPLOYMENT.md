# VoltServers Deployment on Namecheap Node.js Hosting

## Overview
Namecheap offers Node.js hosting through their shared hosting plans with cPanel. This guide covers the specific steps to deploy your VoltServers application.

## Prerequisites
- Namecheap shared hosting plan with Node.js support
- cPanel access to your hosting account
- Your VoltServers repository ready for deployment

## Important Limitations
- **No root access** - Can't install global packages or services
- **No PM2** - Use Namecheap's Node.js app manager instead
- **Limited database options** - Must use provided MySQL/PostgreSQL
- **Memory/CPU limits** - Shared hosting resource constraints
- **Port restrictions** - Application must use assigned port

## Step 1: Prepare Your Application for Namecheap

### 1.1 Create Namecheap-specific Configuration
```bash
# Create Namecheap deployment files
touch app.js
touch package.json.namecheap
```

### 1.2 Modify Application Entry Point
Since Namecheap expects `app.js` as the main file, create a simple wrapper:

**Create `app.js`:**
```javascript
// Namecheap Node.js entry point
import('./dist/index.js').catch(console.error);
```

### 1.3 Update Package.json for Namecheap
Namecheap requires specific script configurations:

**Modify scripts section:**
```json
{
  "scripts": {
    "start": "node app.js",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "postinstall": "npm run build"
  }
}
```

## Step 2: Database Configuration

### 2.1 Use Namecheap's Database
Namecheap provides PostgreSQL/MySQL databases through cPanel:

1. **Access cPanel** → **PostgreSQL Databases**
2. **Create Database**: `your_username_voltservers`
3. **Create User**: `your_username_voltuser`
4. **Grant Privileges**: Full access to the database

### 2.2 Update Environment Configuration
**Create `.env` for Namecheap:**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://your_username_voltuser:password@localhost:5432/your_username_voltservers
SESSION_SECRET=your_secure_session_secret

# Namecheap specific
TRUST_PROXY=true
```

## Step 3: Deploy to Namecheap

### 3.1 Access Node.js Selector in cPanel
1. **Login to cPanel**
2. **Find "Node.js Selector"** or "Node.js Apps"
3. **Click "Create Application"**

### 3.2 Configure Node.js Application
- **Node.js Version**: Select latest available (18.x or 20.x)
- **Application Mode**: Production
- **Application Root**: `public_html/voltservers` (or subdirectory)
- **Application URL**: Your domain or subdomain
- **Startup File**: `app.js`

### 3.3 Upload Your Files
**Option A: File Manager**
1. **Access cPanel File Manager**
2. **Navigate** to your application directory
3. **Upload** your project files (zip recommended)
4. **Extract** the files

**Option B: Git (if available)**
1. **Access Git Version Control** in cPanel
2. **Create Repository**: Clone from GitHub
3. **Set Branch**: main/master

### 3.4 Install Dependencies
In the Node.js App interface:
1. **Click "NPM Install"** or run: `npm install`
2. **Wait for installation** to complete
3. **Check for errors** in the log

## Step 4: Configure Environment Variables

### 4.1 Set Environment Variables in cPanel
1. **In Node.js App Manager**
2. **Click "Environment Variables"**
3. **Add variables:**
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your database connection string
   - `SESSION_SECRET`: Your session secret
   - `PORT`: (Usually auto-assigned)

## Step 5: Database Setup

### 5.1 Run Database Migrations
**Option A: Through cPanel Terminal (if available)**
```bash
cd /home/username/public_html/voltservers
npm run db:push
```

**Option B: Create Migration Script**
Create `migrate.js`:
```javascript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const sql = postgres(process.env.DATABASE_URL);
const db = drizzle(sql);

await migrate(db, { migrationsFolder: './migrations' });
console.log('Migration completed');
process.exit(0);
```

## Step 6: Optimization for Shared Hosting

### 6.1 Reduce Memory Usage
**Update `server/index.ts`:**
```typescript
// Optimize for shared hosting
const app = express();

// Reduce memory usage
app.set('trust proxy', true);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Configure for shared hosting
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown for shared hosting
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
```

### 6.2 Static File Optimization
Since shared hosting has limitations, optimize static file serving:

```typescript
// In production mode for Namecheap
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/public', {
    maxAge: '1d',
    etag: true,
    immutable: true
  }));
}
```

## Step 7: Start and Test Application

### 7.1 Start the Application
1. **In Node.js App Manager**
2. **Click "Restart"** or **"Start App"**
3. **Monitor logs** for any errors

### 7.2 Test Your Application
1. **Visit your domain**: `http://yourdomain.com`
2. **Check functionality**:
   - Homepage loads
   - Game pages work
   - Database connectivity
   - Admin panel accessible

## Step 8: Domain and SSL Configuration

### 8.1 Configure Domain
1. **In cPanel**: **Subdomains** or **Addon Domains**
2. **Point to application directory**
3. **Update DNS** if needed

### 8.2 Enable SSL
1. **Access "SSL/TLS"** in cPanel
2. **Enable "Force HTTPS Redirect"**
3. **Install Let's Encrypt** certificate (if available)

## Troubleshooting Common Issues

### Application Won't Start
- **Check Node.js version** compatibility
- **Verify `app.js`** exists and is correct
- **Check package.json** scripts
- **Review error logs** in Node.js App Manager

### Database Connection Issues
- **Verify DATABASE_URL** format
- **Check database permissions**
- **Ensure database exists**
- **Test connection** in cPanel

### Memory/Resource Limits
- **Optimize application** for shared hosting
- **Reduce concurrent connections**
- **Implement caching**
- **Consider upgrading** hosting plan

### File Permission Issues
- **Set correct permissions**: 755 for directories, 644 for files
- **Check ownership**: Files should be owned by your user
- **Verify file paths** are correct

## Performance Optimization

### 6.1 Enable Caching
```javascript
// Add to your Express app
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
```

### 6.2 Compress Responses
```javascript
import compression from 'compression';
app.use(compression());
```

## Maintenance and Updates

### Update Application
1. **Upload new files** via File Manager or Git
2. **Run `npm install`** if dependencies changed
3. **Restart application** in Node.js App Manager
4. **Test functionality**

### Monitor Performance
- **Check resource usage** in cPanel
- **Monitor error logs**
- **Set up uptime monitoring**

## Alternative: Subdomain Deployment

If you want to deploy to a subdomain like `app.yourdomain.com`:

1. **Create subdomain** in cPanel
2. **Point to application directory**
3. **Update environment variables**
4. **Configure DNS** if needed

## Backup Strategy

### Database Backup
```bash
# Create backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### File Backup
- **Use cPanel Backup Wizard**
- **Download application files** regularly
- **Keep version control** updated

Your VoltServers application should now be successfully running on Namecheap's Node.js hosting!