module.exports = {
  apps: [{
    name: 'voltservers',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Logging configuration
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Auto-restart configuration
    watch: false,
    max_memory_restart: '1G',
    
    // Advanced PM2 configuration for production
    min_uptime: '10s',
    max_restarts: 10,
    autorestart: true,
    
    // Environment variables (these override .env file)
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      // Add other production-specific variables here if needed
    }
  }],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'ubuntu',
      host: '135.148.137.158',
      ref: 'origin/main',
      repo: 'https://github.com/Zeeksey/voltservers2.git',
      path: '/home/ubuntu/voltservers',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && npm run db:push && pm2 reload ecosystem.config.cjs --env production && pm2 save',
      'pre-setup': ''
    }
  }
}