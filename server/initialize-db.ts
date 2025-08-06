import type { IStorage } from "./storage";

export async function initializeDatabase(storage: IStorage) {
  console.log("Initializing database with sample data...");

  // Create sample games if none exist
  const existingGames = await storage.getAllGames();
  if (existingGames.length === 0) {
    const sampleGames = [
      {
        name: "Minecraft",
        slug: "minecraft",
        category: "Sandbox",
        description: "Build, explore, and survive in infinite worlds",
        imageUrl: "/images/games/minecraft.webp",
        features: ["Infinite Worlds", "Redstone Engineering", "Mod Support", "Creative Mode"],
        ramOptions: ["2GB", "4GB", "8GB", "16GB"],
        setupComplexity: "Easy",
        isPopular: true
      },
      {
        name: "Rust",
        slug: "rust",
        category: "Survival",
        description: "Survive, build, and dominate in this brutal multiplayer world",
        imageUrl: "/images/games/rust.webp",
        features: ["Base Building", "PvP Combat", "Crafting System", "Clan Warfare"],
        ramOptions: ["4GB", "8GB", "16GB", "32GB"],
        setupComplexity: "Medium",
        isPopular: true
      },
      {
        name: "Valheim",
        slug: "valheim",
        category: "Survival",
        description: "Viking-themed survival adventure with friends",
        imageUrl: "/images/games/valheim.webp",
        features: ["Viking Theme", "Co-op Survival", "Boss Fights", "Building"],
        ramOptions: ["4GB", "8GB", "16GB"],
        setupComplexity: "Easy",
        isPopular: false
      },
      {
        name: "Counter-Strike 2",
        slug: "cs2",
        category: "FPS",
        description: "Competitive tactical shooter with tournament-ready features",
        imageUrl: "/images/games/cs2.webp",
        features: ["Competitive Matches", "128-tick Servers", "Anti-cheat", "GOTV"],
        ramOptions: ["4GB", "8GB", "16GB"],
        setupComplexity: "Hard",
        isPopular: true
      }
    ];

    for (const game of sampleGames) {
      await storage.createGame(game);
    }
    console.log("Created sample games");
  }

  // Create sample blog posts if none exist
  const existingBlogPosts = await storage.getAllBlogPosts();
  if (existingBlogPosts.length === 0) {
    const samplePosts = [
      {
        title: "VoltServers Game Panel: Complete Management Guide",
        slug: "voltservers-game-panel-complete-guide",
        excerpt: "Master your VoltServers game panel with this comprehensive guide covering server management, file access, plugin installation, and advanced features.",
        content: `# VoltServers Game Panel: Complete Management Guide

Your VoltServers game panel provides complete control over your game servers through our advanced management interface. This guide covers everything from basic navigation to advanced server management features.

## Getting Started with Your Panel

### First Login
After purchasing your server, you'll receive login credentials via email:
1. Navigate to your server management URL
2. Enter your username and password
3. Complete two-factor authentication setup (recommended)

### Dashboard Overview
The main dashboard provides:
- **Server Status**: Real-time performance metrics
- **Resource Usage**: CPU, RAM, and storage monitoring
- **Player Activity**: Current players and connection history
- **Quick Actions**: Restart, stop, start server controls

## Essential Features

### 1. File Manager
Access and modify your server files directly through the web interface.

**Key Functions:**
- Upload/download files and folders
- Edit configuration files with syntax highlighting
- Create backups before making changes
- Set file permissions and ownership

### 2. Console Access
Real-time server console for command execution and log monitoring.

**Essential Commands for Minecraft:**
\`\`\`bash
# Player management
/ban <player>
/pardon <player>
/op <player>

# World management
/save-all
/tp <player> <coordinates>
/gamemode creative <player>
\`\`\`

**Essential Commands for Rust:**
\`\`\`bash
# Admin commands
ban <steamid>
unban <steamid>
kick <player> "reason"

# Server management
server.save
weather.fog 0
spawn.fill_populations
\`\`\`

### 3. Backup Management
Automated and manual backup solutions for server protection.

**Features:**
- Scheduled automatic backups
- Manual backup creation
- One-click backup restoration
- Cloud storage integration
- Backup compression and encryption

### 4. Plugin/Mod Management
Streamlined installation and management of server modifications.

**Minecraft Plugins:**
- Browse plugin library
- One-click installation
- Automatic updates
- Configuration editor
- Performance monitoring

**Rust Plugins (uMod/Oxide):**
- Plugin marketplace access
- Dependency management
- Configuration templates
- Performance impact tracking

## Advanced Features

### 1. Startup Parameters
Customize your server's launch configuration for optimal performance.

### 2. Performance Monitoring
Real-time metrics and historical data analysis.

**Metrics Tracked:**
- CPU usage patterns
- Memory consumption
- Network I/O
- Player connection trends
- TPS (Ticks Per Second) for Minecraft
- FPS performance for Rust

### 3. Scheduled Tasks
Automate routine server maintenance and management.

**Common Tasks:**
- Automatic restarts
- Backup scheduling
- Plugin updates
- Performance optimization
- Player activity reports

## Security and Access Control

### User Management
Control who can access your server management panel.

**Permission Levels:**
- **Owner**: Full administrative access
- **Admin**: Server management and configuration
- **Moderator**: Player management and basic controls
- **Viewer**: Read-only access to logs and statistics

### Two-Factor Authentication
Enhanced security for your server management account.

## Getting Help

Need assistance with your VoltServers panel?

**Support Resources:**
- 24/7 live chat support
- Comprehensive knowledge base
- Video tutorials
- Community forums
- Priority support for enterprise customers

Our expert team is here to ensure your gaming servers run smoothly and efficiently!`,
        imageUrl: "/images/blog/game-panel-guide.svg",
        author: "VoltServers Technical Team",
        tags: ["game-panel", "server-management", "tutorial", "voltservers", "hosting"],
        isPublished: true
      },
      {
        title: "Ultimate Minecraft Server Setup Guide 2025",
        slug: "ultimate-minecraft-server-setup-guide-2025",
        excerpt: "Complete guide to setting up and optimizing Minecraft servers for maximum performance, security, and player engagement in 2025.",
        content: `# Ultimate Minecraft Server Setup Guide 2025

Setting up a Minecraft server in 2025 requires understanding modern hosting requirements, performance optimization, and security best practices. This comprehensive guide covers everything from basic setup to advanced administration.

## Server Requirements and Planning

### Hardware Specifications
**Minimum Requirements (5-10 players):**
- CPU: Intel Core i3 or AMD Ryzen 3
- RAM: 4GB dedicated memory
- Storage: 10GB SSD space
- Network: 10Mbps upload bandwidth

**Recommended Specifications (20+ players):**
- CPU: Intel Core i5 or AMD Ryzen 5
- RAM: 8-16GB dedicated memory
- Storage: 25GB+ NVMe SSD
- Network: 50Mbps+ upload bandwidth

### Server Type Selection

**Vanilla Servers:**
- Pure Minecraft experience
- Minimal resource usage
- Maximum compatibility
- Best for: Survival gameplay

**Paper/Spigot Servers:**
- Plugin support
- Performance optimizations
- Anti-grief features
- Best for: Community servers

**Modded Servers (Forge/Fabric):**
- Complete gameplay transformation
- Higher resource requirements
- Best for: Custom experiences

## Installation and Configuration

### Java Optimization
Use the latest Java version with optimized flags:

\`\`\`bash
java -Xmx8G -Xms8G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -jar server.jar nogui
\`\`\`

### Essential Server Properties
\`\`\`properties
# server.properties optimization
server-port=25565
max-players=20
difficulty=hard
enable-command-block=true
spawn-protection=16
view-distance=10
simulation-distance=10
\`\`\`

## Performance Optimization

### Memory Management
- Allocate 1GB RAM per 5-10 players
- Reserve 2GB for system operations
- Monitor garbage collection patterns
- Implement automatic restart schedules

### World Optimization
- Pregenerate world chunks
- Limit world border size
- Regular world cleanup
- Optimize chunk loading

## Security Best Practices

### Server Protection
- Enable whitelist for private servers
- Configure proper firewall rules
- Regular security audits
- Monitor player activity logs

### Backup Strategies
- Automated daily backups
- Off-site backup storage
- Quick restoration procedures
- Version control for configurations

## Essential Plugins

### Core Management
- **LuckPerms**: Permission management
- **WorldEdit**: World editing tools
- **CoreProtect**: Logging and rollback
- **Vault**: Economy API

### Player Experience
- **EssentialsX**: Core commands
- **ChestShop**: Player shops
- **mcMMO**: RPG elements
- **WorldGuard**: Region protection

## VoltServers Panel Integration

Your VoltServers control panel provides:
- One-click plugin installation
- Automated backups
- Performance monitoring
- 24/7 expert support

Ready to start your Minecraft server? VoltServers provides optimized hosting with all these features pre-configured!`,
        imageUrl: "/images/blog/minecraft-setup.svg",
        author: "VoltServers Minecraft Team",
        tags: ["minecraft", "server-setup", "optimization", "hosting", "tutorial"],
        isPublished: true
      },
      {
        title: "Rust Server Optimization: Performance Tuning Guide",
        slug: "rust-server-optimization-performance-guide",
        excerpt: "Maximize your Rust server's performance with advanced optimization techniques, plugin management, and server configuration best practices.",
        content: `# Rust Server Optimization: Performance Tuning Guide

Optimizing Rust servers requires understanding the game's resource demands, player behavior patterns, and system-level tuning. This guide provides comprehensive optimization strategies for maximum performance.

## System-Level Optimization

### Hardware Requirements
**High-Performance Configuration:**
- CPU: AMD Ryzen 7/9 or Intel i7/i9
- RAM: 16-32GB DDR4/DDR5
- Storage: NVMe SSD with high IOPS
- Network: Dedicated bandwidth allocation

### Operating System Tuning
\`\`\`bash
# Linux system optimization
echo 'net.core.rmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 134217728' >> /etc/sysctl.conf
echo 'vm.swappiness = 1' >> /etc/sysctl.conf
sysctl -p
\`\`\`

## Rust Server Configuration

### Launch Parameters
\`\`\`bash
./RustDedicated -batchmode -nographics \\
  +server.hostname "VoltServers Rust" \\
  +server.port 28015 \\
  +server.maxplayers 100 \\
  +server.worldsize 3000 \\
  +server.seed 12345 \\
  +server.identity "server1" \\
  +server.tickrate 30
\`\`\`

### Performance Settings
Key configuration values for optimal performance:
- **server.tickrate**: 20-30 (higher = better performance)
- **server.maxplayers**: Based on available RAM
- **server.worldsize**: Smaller = better performance
- **fps.limit**: 60 for servers

## Plugin Optimization

### Essential Performance Plugins
- **Vanish**: Admin invisibility without performance impact
- **Remove**: Efficient building removal
- **Economics**: Lightweight economy system
- **Better Chat**: Optimized chat management

### Plugin Performance Monitoring
Monitor these metrics:
- CPU usage per plugin
- Memory consumption patterns
- Database query frequency
- Player action processing time

## Database and Storage

### SQLite vs MySQL
**SQLite Benefits:**
- Lower latency for small servers
- No additional setup required
- Suitable for <50 concurrent players

**MySQL Benefits:**
- Better performance for large servers
- Advanced query optimization
- Suitable for 100+ concurrent players

### Storage Optimization
- Use SSD storage for world files
- Regular database cleanup
- Implement compression for backups
- Monitor disk I/O patterns

## Network Optimization

### Bandwidth Planning
Calculate bandwidth requirements:
- Base: 1Mbps per 10 players
- Peak: 2Mbps per 10 players during events
- Upload: 3x download for server hosting

### Connection Limits
\`\`\`bash
# iptables connection limiting
iptables -A INPUT -p tcp --dport 28015 -m connlimit --connlimit-above 5 -j REJECT
\`\`\`

## Monitoring and Maintenance

### Performance Metrics
Track these key indicators:
- Server FPS (target: 60+)
- Memory usage trends
- Player connection quality
- Network latency patterns

### Automated Maintenance
\`\`\`bash
#!/bin/bash
# Daily maintenance script
# Restart server at 4 AM
0 4 * * * /path/to/restart-script.sh

# Clear logs weekly
0 0 * * 0 /path/to/log-cleanup.sh

# Database optimization
0 2 * * 1 /path/to/db-optimize.sh
\`\`\`

## Troubleshooting Common Issues

### High CPU Usage
1. Review plugin performance impact
2. Check for infinite loops in scripts
3. Monitor player count vs resources
4. Consider server upgrade

### Memory Leaks
1. Implement regular restarts
2. Monitor plugin memory usage
3. Review garbage collection logs
4. Update to latest server version

### Network Lag
1. Check bandwidth utilization
2. Review routing and latency
3. Implement connection limiting
4. Monitor DDoS protection status

## VoltServers Optimization

Your VoltServers Rust hosting includes:
- Pre-optimized server configurations
- Automated performance monitoring
- Expert tuning assistance
- 24/7 technical support

Ready for optimized Rust hosting? VoltServers delivers maximum performance with minimal management overhead!`,
        imageUrl: "/images/blog/rust-optimization.svg",
        author: "VoltServers Performance Team",
        tags: ["rust", "optimization", "performance", "server-management", "hosting"],
        isPublished: true
      }
    ];

    for (const post of samplePosts) {
      await storage.createBlogPost(post);
    }
    console.log("Created sample blog posts");
  }

  // Create sample pricing plans if none exist
  const existingPlans = await storage.getAllPricingPlans();
  if (existingPlans.length === 0) {
    const samplePlans = [
      {
        name: "Starter",
        price: "2.99",
        ram: "2GB RAM",
        storage: "25GB SSD",
        maxPlayers: 20,
        features: ["DDoS Protection", "Automatic Backups", "24/7 Support", "VoltServers Panel"],
        isPopular: false
      },
      {
        name: "Pro",
        price: "5.99",
        ram: "4GB RAM",
        storage: "50GB SSD",
        maxPlayers: 50,
        features: ["DDoS Protection", "Automatic Backups", "24/7 Support", "VoltServers Panel", "Plugin Manager", "FTP Access"],
        isPopular: true
      },
      {
        name: "Enterprise",
        price: "12.99",
        ram: "8GB RAM",
        storage: "100GB SSD",
        maxPlayers: 999999,
        features: ["DDoS Protection", "Automatic Backups", "24/7 Support", "VoltServers Panel", "Plugin Manager", "FTP Access", "Database Access", "Priority Support"],
        isPopular: false
      }
    ];

    for (const plan of samplePlans) {
      await storage.createPricingPlan(plan);
    }
    console.log("Created sample pricing plans");
  }

  // Create demo servers if none exist
  const existingDemoServers = await storage.getAllDemoServers();
  if (existingDemoServers.length === 0) {
    const minecraftGameId = existingGames.find(g => g.slug === "minecraft")?.id || existingGames[0]?.id;
    
    const sampleDemoServers = [
      {
        serverName: "VoltServers Creative Hub",
        gameType: "minecraft",
        serverIp: "demo.voltservers.com",
        serverPort: 25565,
        maxPlayers: 100,
        description: "Build anything you can imagine in our creative showcase server",
        gameId: minecraftGameId
      },
      {
        serverName: "Survival Adventures",
        gameType: "minecraft", 
        serverIp: "survival.voltservers.com",
        serverPort: 25566,
        maxPlayers: 50,
        description: "Classic survival gameplay with friendly community",
        gameId: minecraftGameId
      }
    ];

    for (const server of sampleDemoServers) {
      await storage.createDemoServer(server);
    }
    console.log("Created sample demo servers");
  }

  console.log("Database initialization complete");
}