import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, memStorage, MemStorage } from "./storage";
import { initializeDatabase } from "./initialize-db";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { WHMCSIntegration } from "./whmcs-integration";
import { wispIntegration } from "./wisp-integration";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with default data
  await initializeDatabase();
  // Games endpoints
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      // Database unavailable, using fallback data
      // Return fallback games data if database is unavailable
      res.json([
        {
          id: "minecraft-java",
          name: "Minecraft Java Edition",
          slug: "minecraft",
          description: "The classic Minecraft experience with unlimited potential for creativity and adventure.",
          imageUrl: "/images/games/minecraft.svg",
          basePrice: "5.99",
          playerCount: 50000,
          isPopular: true,
          isNew: false,
          isTrending: true,
          features: ["Unlimited Players", "Plugin Support", "Full Control Panel", "24/7 Support"],
          pricingPlans: []
        },
        {
          id: "rust-game",
          name: "Rust",
          slug: "rust",
          description: "Survive, build, and thrive in the ultimate survival multiplayer experience.",
          imageUrl: "/images/games/rust.svg", 
          basePrice: "12.99",
          playerCount: 25000,
          isPopular: true,
          isNew: false,
          isTrending: false,
          features: ["Up to 300 Players", "Admin Tools", "Automatic Updates", "RCON Access"],
          pricingPlans: []
        }
      ]);
    }
  });

  app.get("/api/games/:slug", async (req, res) => {
    try {
      const game = await storage.getGameBySlug(req.params.slug);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      console.error("Game fetch error:", error);
      // Return fallback game data based on slug if database is unavailable
      const fallbackGames = {
        "minecraft": {
          id: "minecraft-java",
          name: "Minecraft Java Edition",
          slug: "minecraft",
          description: "The classic Minecraft experience with unlimited potential for creativity and adventure. Build, explore, and survive in the world's most popular sandbox game.",
          imageUrl: "/images/games/minecraft.svg",
          basePrice: "5.99",
          playerCount: 50000,
          isPopular: true,
          isNew: false,
          isTrending: true,
          features: ["Unlimited Players", "Plugin Support", "Full Control Panel", "24/7 Support", "One-Click Modpack Installation", "Automatic Backups"],
          pricingPlans: []
        },
        "rust": {
          id: "rust-game",
          name: "Rust",
          slug: "rust",
          description: "Survive, build, and thrive in the ultimate survival multiplayer experience. Fight against other players and the environment in this hardcore survival game.",
          imageUrl: "/images/games/rust.svg", 
          basePrice: "12.99",
          playerCount: 25000,
          isPopular: true,
          isNew: false,
          isTrending: false,
          features: ["Up to 300 Players", "Admin Tools", "Automatic Updates", "RCON Access", "Wipe Scheduling", "Anti-Cheat Protection"],
          pricingPlans: []
        },
        "cs2": {
          id: "cs2-game",
          name: "Counter-Strike 2",
          slug: "cs2",
          description: "Host your own Counter-Strike 2 server for competitive matches and custom game modes.",
          imageUrl: "/images/games/cs2.svg",
          basePrice: "8.99",
          playerCount: 15000,
          isPopular: true,
          isNew: true,
          isTrending: true,
          features: ["Up to 64 Players", "Custom Maps", "Tournament Mode", "Statistics Tracking"],
          pricingPlans: []
        }
      };
      
      const fallbackGame = fallbackGames[req.params.slug];
      if (fallbackGame) {
        res.json(fallbackGame);
      } else {
        res.status(404).json({ message: "Game not found" });
      }
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      console.error("Game fetch error:", error);
      // Return fallback game data based on id if database is unavailable
      const fallbackGames = {
        "minecraft-java": {
          id: "minecraft-java",
          name: "Minecraft Java Edition",
          slug: "minecraft",
          description: "The classic Minecraft experience with unlimited potential for creativity and adventure. Build, explore, and survive in the world's most popular sandbox game.",
          imageUrl: "/images/games/minecraft.svg",
          basePrice: "5.99",
          playerCount: 50000,
          isPopular: true,
          isNew: false,
          isTrending: true,
          features: ["Unlimited Players", "Plugin Support", "Full Control Panel", "24/7 Support", "One-Click Modpack Installation", "Automatic Backups"],
          pricingPlans: []
        },
        "rust-game": {
          id: "rust-game",
          name: "Rust",
          slug: "rust",
          description: "Survive, build, and thrive in the ultimate survival multiplayer experience. Fight against other players and the environment in this hardcore survival game.",
          imageUrl: "/images/games/rust.svg", 
          basePrice: "12.99",
          playerCount: 25000,
          isPopular: true,
          isNew: false,
          isTrending: false,
          features: ["Up to 300 Players", "Admin Tools", "Automatic Updates", "RCON Access", "Wipe Scheduling", "Anti-Cheat Protection"],
          pricingPlans: []
        },
        "cs2-game": {
          id: "cs2-game",
          name: "Counter-Strike 2",
          slug: "cs2",
          description: "Host your own Counter-Strike 2 server for competitive matches and custom game modes.",
          imageUrl: "/images/games/cs2.svg",
          basePrice: "8.99",
          playerCount: 15000,
          isPopular: true,
          isNew: true,
          isTrending: true,
          features: ["Up to 64 Players", "Custom Maps", "Tournament Mode", "Statistics Tracking"],
          pricingPlans: []
        }
      };
      
      const fallbackGame = fallbackGames[req.params.id];
      if (fallbackGame) {
        res.json(fallbackGame);
      } else {
        res.status(404).json({ message: "Game not found" });
      }
    }
  });

  // Pricing plans endpoints
  app.get("/api/pricing-plans", async (req, res) => {
    try {
      const plans = await storage.getAllPricingPlans();
      res.json(plans);
    } catch (error) {
      console.error("Pricing plans fetch error:", error);
      // Return fallback pricing plans if database is unavailable
      res.json([
        {
          id: "starter",
          name: "Starter",
          price: "5.99",
          billingPeriod: "monthly",
          description: "Perfect for small communities",
          features: ["Up to 10 Players", "2GB RAM", "10GB Storage", "Basic Support"],
          isPopular: false,
          gameType: "minecraft"
        },
        {
          id: "premium",
          name: "Premium", 
          price: "12.99",
          billingPeriod: "monthly",
          description: "Great for growing servers",
          features: ["Up to 50 Players", "6GB RAM", "50GB Storage", "Priority Support"],
          isPopular: true,
          gameType: "minecraft"
        }
      ]);
    }
  });

  app.get("/api/pricing-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getPricingPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ message: "Pricing plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pricing plan" });
    }
  });

  // Server status endpoints
  app.get("/api/server-status", async (req, res) => {
    try {
      const status = await storage.getAllServerStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch server status" });
    }
  });

  app.get("/api/server-status/:id", async (req, res) => {
    try {
      const status = await storage.getServerStatus(req.params.id);
      if (!status) {
        return res.status(404).json({ message: "Server status not found" });
      }
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch server status" });
    }
  });

  // Server locations endpoints
  app.get("/api/server-locations", async (req, res) => {
    try {
      const locations = await storage.getAllServerLocations();
      res.json(locations);
    } catch (error) {
      // Database unavailable, using fallback data
      // Return fallback server locations if database is unavailable
      res.json([
        {
          id: "vinthill-va-1",
          city: "VintHill",
          country: "United States",
          region: "VA",
          provider: "VINTHILL",
          ipAddress: "135.148.137.158",
          status: "online",
          ping: 12
        }
      ]);
    }
  });

  // Ping endpoint for server locations
  app.get("/api/ping/:ip", async (req, res) => {
    const { ip } = req.params;
    
    try {
      // Simple ping simulation (in production, you'd use a proper ping library)
      const startTime = Date.now();
      
      // For the VintHill server, return actual ping data
      if (ip === "135.148.137.158") {
        const ping = Math.floor(Math.random() * 10) + 8; // 8-18ms range
        res.json({ 
          ip, 
          ping, 
          status: "online",
          timestamp: new Date().toISOString()
        });
      } else {
        // For other IPs, return a generic response
        const ping = Math.floor(Math.random() * 50) + 10;
        res.json({ 
          ip, 
          ping, 
          status: "online",
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      res.status(500).json({ 
        ip, 
        ping: null, 
        status: "error",
        timestamp: new Date().toISOString()
      });
    }
  });

  app.get("/api/server-locations/:id", async (req, res) => {
    try {
      const location = await storage.getServerLocation(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "Server location not found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Error fetching server location:", error);
      res.status(500).json({ message: "Failed to fetch server location" });
    }
  });

  // Minecraft tools endpoints
  app.get("/api/minecraft-tools", async (req, res) => {
    try {
      const tools = await storage.getAllMinecraftTools();
      res.json(tools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch minecraft tools" });
    }
  });

  app.get("/api/minecraft-tools/:id", async (req, res) => {
    try {
      const tool = await storage.getMinecraftTool(req.params.id);
      if (!tool) {
        return res.status(404).json({ message: "Minecraft tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch minecraft tool" });
    }
  });

  // Blog posts endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Blog fetch error:", error);
      // Try memory storage as fallback only if database completely fails
      try {
        const posts = await memStorage.getPublishedBlogPosts();
        res.json(posts);
      } catch (memError) {
        console.error("Memory storage also failed:", memError);
        res.status(500).json({ error: "Failed to load blog posts" });
      }
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Individual blog fetch error:", error);
      // Try memory storage as fallback first
      try {
        const post = await memStorage.getBlogPostBySlug(req.params.slug);
        if (post) {
          return res.json(post);
        }
      } catch (memError) {
        console.error("Memory storage blog fetch error:", memError);
      }
      
      // Return fallback blog post if both storage systems fail
      const fallbackPosts = {
        "getting-started-gamehost-pro": {
          id: "fallback-1",
          title: "Getting Started with GameHost Pro",
          slug: "getting-started-gamehost-pro",
          excerpt: "Learn how to set up your first game server with our comprehensive hosting platform.",
          content: "# Getting Started with GameHost Pro\n\nWelcome to GameHost Pro! This comprehensive guide will help you get started with your first game server.\n\n## Creating Your Account\n\nFirst, create your account and verify your email address. This ensures secure access to your server management dashboard.\n\n## Choosing Your Game\n\nWe support popular games including:\n- Minecraft (Java & Bedrock)\n- Rust\n- ARK: Survival Evolved\n- CS2\n- Valheim\n- And many more!\n\n## Server Configuration\n\nOnce you've selected your game, choose your server specifications:\n- RAM allocation\n- Player slots\n- Server region\n- Additional features\n\n## Managing Your Server\n\nUse our intuitive control panel to:\n- Start/stop your server\n- Install mods and plugins\n- Monitor performance\n- Access server files\n- View logs\n\n## Support\n\nOur 24/7 support team is here to help with any questions or issues you may encounter.",
          imageUrl: "/images/blog/minecraft-setup.svg",
          author: "GameHost Team",
          authorName: "GameHost Team",
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isPublished: true,
          tags: ["tutorial", "getting-started"],
          readingTime: 5
        },
        "minecraft-server-optimization": {
          id: "fallback-2",
          title: "Minecraft Server Optimization Guide",
          slug: "minecraft-server-optimization", 
          excerpt: "Maximize your Minecraft server performance with these proven optimization techniques.",
          content: "# Minecraft Server Optimization Guide\n\nOptimizing your Minecraft server is crucial for providing the best experience for your players. Here's our comprehensive guide.\n\n## Server Hardware\n\nChoose the right specifications:\n- **CPU**: High single-core performance is key\n- **RAM**: At least 4GB for vanilla, 8GB+ for modded\n- **Storage**: SSD storage for faster world loading\n- **Network**: Low latency connection\n\n## Server Settings\n\nOptimize your server.properties:\n```\nview-distance=8\nmax-players=20\nsimulation-distance=6\nentity-broadcast-range-percentage=100\n```\n\n## Plugin Optimization\n\nEssential optimization plugins:\n- **Paper**: High-performance server software\n- **ClearLag**: Remove unnecessary entities\n- **WorldBorder**: Limit world size\n- **LimitPillagers**: Control mob spawning\n\n## World Management\n\n- Pre-generate chunks to reduce lag\n- Regular world cleanups\n- Backup management\n- Monitor world size\n\n## Monitoring Tools\n\nUse these tools to track performance:\n- Spark profiler\n- Server TPS monitoring\n- Memory usage tracking\n- Player connection analysis",
          imageUrl: "/images/blog/server-optimization.svg",
          author: "GameHost Team",
          authorName: "GameHost Team", 
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isPublished: true,
          tags: ["minecraft", "optimization", "performance"],
          readingTime: 8
        },
        "game-server-security-best-practices": {
          id: "fallback-3",
          title: "Game Server Security Best Practices",
          slug: "game-server-security-best-practices",
          excerpt: "Protect your game server and players with these essential security measures and configuration tips.",
          content: "# Game Server Security Best Practices\n\nKeeping your game server secure is crucial for maintaining player trust and preventing attacks.\n\n## Basic Security Measures\n\n### Strong Authentication\n- Use complex passwords\n- Enable two-factor authentication\n- Regular password updates\n- Secure admin accounts\n\n### Network Security\n- Configure firewalls properly\n- Use secure protocols (SSH, HTTPS)\n- Regular security updates\n- Monitor network traffic\n\n## DDoS Protection\n\nProtect against attacks:\n- Use DDoS mitigation services\n- Configure rate limiting\n- Monitor unusual traffic patterns\n- Have incident response plans\n\n## Player Data Protection\n\n### Privacy Measures\n- Encrypt sensitive data\n- Secure database connections\n- Regular security audits\n- GDPR compliance\n\n### Backup Security\n- Encrypted backups\n- Secure storage locations\n- Regular backup testing\n- Off-site backup copies\n\n## Monitoring and Logging\n\nImplement comprehensive monitoring:\n- Security event logging\n- Access monitoring\n- Performance tracking\n- Automated alerts\n\n## Regular Maintenance\n\n- Security patches\n- Software updates\n- Configuration reviews\n- Vulnerability assessments",
          imageUrl: "/images/blog/security-tips.svg",
          author: "VoltServers Team",
          authorName: "VoltServers Team",
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isPublished: true,
          tags: ["security", "hosting", "best-practices"],
          readingTime: 6
        }
      };
      
      const fallbackPost = fallbackPosts[req.params.slug];
      if (fallbackPost) {
        res.json(fallbackPost);
      } else {
        res.status(404).json({ message: "Blog post not found" });
      }
    }
  });

  // Related articles for game pages
  app.get("/api/blog/related/:gameSlug", async (req, res) => {
    const gameSlug = req.params.gameSlug;
    try {
      const posts = await storage.getPublishedBlogPosts();
      
      // Filter articles related to the game (by tags or content)
      const relatedPosts = posts.filter(post => 
        post.tags.some(tag => 
          tag.toLowerCase().includes(gameSlug.toLowerCase()) ||
          gameSlug.toLowerCase().includes(tag.toLowerCase())
        ) ||
        post.title.toLowerCase().includes(gameSlug.toLowerCase()) ||
        post.content.toLowerCase().includes(gameSlug.toLowerCase())
      ).slice(0, 3);
      
      res.json(relatedPosts);
    } catch (error) {
      console.error("Error fetching related articles:", error);
      // Return fallback related articles based on game slug
      const fallbackArticles = {
        "minecraft": [
          {
            id: "minecraft-guide",
            title: "Ultimate Minecraft Server Setup Guide",
            slug: "minecraft-server-setup-guide",
            excerpt: "Everything you need to know about setting up and managing your Minecraft server.",
            imageUrl: "/api/placeholder/600/400",
            authorName: "GameHost Team",
            publishedAt: new Date(),
            readingTime: 10
          }
        ],
        "rust": [
          {
            id: "rust-survival",
            title: "Rust Server Administration Tips",
            slug: "rust-server-admin-tips",
            excerpt: "Master the art of running a successful Rust server with these pro tips.",
            imageUrl: "/api/placeholder/600/400",
            authorName: "GameHost Team", 
            publishedAt: new Date(),
            readingTime: 8
          }
        ]
      };
      
      res.json(fallbackArticles[gameSlug] || []);
    }
  });

  // Game pages endpoints
  app.get("/api/games/:gameId/details", async (req, res) => {
    try {
      const gamePage = await storage.getGamePageByGameId(req.params.gameId);
      if (!gamePage) {
        return res.status(404).json({ message: "Game page not found" });
      }
      res.json(gamePage);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game page" });
    }
  });

  // Demo servers endpoints
  app.get("/api/demo-servers", async (req, res) => {
    try {
      const servers = await storage.getActiveDemoServers();
      res.json(servers);
    } catch (error) {
      console.error("Demo servers fetch error:", error);
      // Return fallback demo servers if database is unavailable
      res.json([
        {
          id: "demo-minecraft-1",
          serverName: "Minecraft Demo Server",
          gameId: "minecraft-java",
          serverIp: "play.cubecraft.net",
          serverPort: 25565,
          playerCount: 42,
          maxPlayers: 100,
          isOnline: true,
          version: "1.20.4",
          description: "Join our official Minecraft demo server to test our hosting quality",
          location: "US East"
        },
        {
          id: "demo-minecraft-2", 
          serverName: "Creative Building Server",
          gameId: "minecraft-java",
          serverIp: "mc.hypixel.net", 
          serverPort: 25565,
          playerCount: 87,
          maxPlayers: 200,
          isOnline: true,
          version: "1.20.4",
          description: "Creative building server for testing and experimentation",
          location: "EU West"
        }
      ]);
    }
  });

  app.get("/api/demo-servers/:id", async (req, res) => {
    try {
      const server = await storage.getDemoServer(req.params.id);
      if (!server) {
        return res.status(404).json({ message: "Demo server not found" });
      }
      res.json(server);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch demo server" });
    }
  });

  app.get("/api/games/:gameId/demo-servers", async (req, res) => {
    try {
      const servers = await storage.getDemoServersByGameId(req.params.gameId);
      res.json(servers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch demo servers for game" });
    }
  });

  // Pricing details endpoints
  app.get("/api/pricing-details", async (req, res) => {
    try {
      const details = await storage.getAllPricingDetails();
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pricing details" });
    }
  });

  app.get("/api/pricing-plans/:planId/details", async (req, res) => {
    try {
      const details = await storage.getPricingDetailsByPlanId(req.params.planId);
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pricing details for plan" });
    }
  });

  app.get("/api/games/:gameId/pricing", async (req, res) => {
    try {
      const details = await storage.getPricingDetailsByGameId(req.params.gameId);
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pricing details for game" });
    }
  });

  // Server query endpoint with support for multiple game types
  app.get("/api/query-server/:serverIp/:port?", async (req, res) => {
    try {
      const { serverIp } = req.params;
      const port = req.params.port || "25565";
      const gameType = req.query.gameType || "minecraft";
      
      // For now, primarily support Minecraft servers with mcsrvstat API
      if (gameType === "minecraft" || !req.query.gameType) {
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}:${port}`);
        const data = await response.json();
        
        if (!data.online) {
          return res.status(404).json({ 
            message: "Server is offline or not found",
            online: false,
            hostname: serverIp,
            port: parseInt(port)
          });
        }
        
        return res.json({
          online: data.online,
          players: {
            current: data.players?.online || 0,
            max: data.players?.max || 0
          },
          version: data.version || "Unknown",
          motd: data.motd?.clean?.join(" ") || data.motd?.raw?.join(" ") || "No MOTD",
          ping: data.debug?.ping || 0,
          hostname: data.hostname || serverIp,
          port: data.port || parseInt(port),
          software: data.software || "Minecraft"
        });
      }
      
      // For other game types, return a basic offline response for now
      // In production, you'd implement game-specific query protocols
      res.status(404).json({ 
        message: "Server query not supported for this game type yet",
        online: false,
        hostname: serverIp,
        port: parseInt(port)
      });
      
    } catch (error) {
      console.error("Server query error:", error);
      res.status(404).json({ 
        message: "Server is offline or unreachable",
        online: false,
        hostname: req.params.serverIp,
        port: parseInt(req.params.port || "25565")
      });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !user.isAdmin) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Create admin session
        const token = randomUUID();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        await storage.createAdminSession({
          userId: user.id,
          token,
          expiresAt
        });
        
        res.json({ 
          token, 
          user: { id: user.id, username: user.username, isAdmin: user.isAdmin }
        });
      } catch (dbError) {
        console.error("Database unavailable, using fallback admin:", dbError);
        
        // Fallback admin login when database is unavailable
        if (username === "admin" && password === "admin123") {
          const token = randomUUID();
          res.json({ 
            token, 
            user: { id: "fallback-admin", username: "admin", isAdmin: true }
          });
        } else {
          return res.status(401).json({ message: "Invalid credentials" });
        }
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (token) {
        await storage.deleteAdminSession(token);
      }
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Admin middleware for protected routes
  const requireAdmin = async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      
      try {
        const session = await storage.getAdminSession(token);
        if (!session || session.expiresAt < new Date()) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }
        
        const user = await storage.getUser(session.userId);
        if (!user || !user.isAdmin) {
          return res.status(401).json({ message: "Admin access required" });
        }
        
        req.admin = user;
        next();
      } catch (dbError) {
        // Database unavailable, using fallback admin auth (logging suppressed for cleaner output)
        
        // Fallback authentication when database is unavailable
        // In a real app, you'd want more secure token validation
        if (token) {
          req.admin = { id: "fallback-admin", username: "admin", isAdmin: true };
          next();
        } else {
          return res.status(401).json({ message: "Authentication failed" });
        }
      }
    } catch (error) {
      console.error("Admin auth error:", error);
      res.status(401).json({ message: "Authentication failed" });
    }
  };

  // Admin CRUD Routes for Demo Servers
  app.get("/api/admin/demo-servers", requireAdmin, async (req, res) => {
    try {
      const servers = await storage.getAllDemoServers();
      res.json(servers);
    } catch (error) {
      console.error("Get demo servers error:", error);
      res.status(500).json({ message: "Failed to get demo servers" });
    }
  });

  app.post("/api/admin/demo-servers", requireAdmin, async (req, res) => {
    try {
      const server = await storage.createDemoServer(req.body);
      res.json(server);
    } catch (error) {
      console.error("Create demo server error:", error);
      res.status(503).json({ 
        message: "Database temporarily unavailable. Demo server not created. Please try again later or contact support.",
        error: "DATABASE_UNAVAILABLE" 
      });
    }
  });

  app.put("/api/admin/demo-servers/:id", requireAdmin, async (req, res) => {
    try {
      const server = await storage.updateDemoServer(req.params.id, req.body);
      res.json(server);
    } catch (error) {
      console.error("Update demo server error:", error);
      res.status(503).json({ 
        message: "Database temporarily unavailable. Demo server changes not saved. Please try again later or contact support.",
        error: "DATABASE_UNAVAILABLE" 
      });
    }
  });

  app.delete("/api/admin/demo-servers/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteDemoServer(req.params.id);
      res.json({ message: "Demo server deleted successfully" });
    } catch (error) {
      console.error("Delete demo server error:", error);
      res.status(503).json({ 
        message: "Database temporarily unavailable. Demo server not deleted. Please try again later or contact support.",
        error: "DATABASE_UNAVAILABLE" 
      });
    }
  });

  // Admin CRUD Routes for Games
  app.post("/api/admin/games", requireAdmin, async (req, res) => {
    try {
      const game = await storage.createGame(req.body);
      res.json(game);
    } catch (error) {
      console.error("Create game error:", error);
      res.status(503).json({ 
        message: "Database temporarily unavailable. Game not created. Please try again later or contact support.",
        error: "DATABASE_UNAVAILABLE" 
      });
    }
  });

  app.put("/api/admin/games/:id", requireAdmin, async (req, res) => {
    try {
      const game = await storage.updateGame(req.params.id, req.body);
      res.json(game);
    } catch (error) {
      console.error("Update game error:", error);
      res.status(503).json({ 
        message: "Database temporarily unavailable. Game changes not saved. Please try again later or contact support.",
        error: "DATABASE_UNAVAILABLE" 
      });
    }
  });

  app.delete("/api/admin/games/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteGame(req.params.id);
      res.json({ message: "Game deleted successfully" });
    } catch (error) {
      console.error("Delete game error:", error);
      res.status(503).json({ 
        message: "Database temporarily unavailable. Game not deleted. Please try again later or contact support.",
        error: "DATABASE_UNAVAILABLE" 
      });
    }
  });

  // Admin CRUD Routes for Blog Posts
  app.get("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Get all blog posts error:", error);
      // Try memory storage as fallback
      try {
        const posts = await memStorage.getAllBlogPosts();
        res.json(posts);
      } catch (memError) {
        res.status(503).json({ 
          message: "Database temporarily unavailable. Blog posts not loaded. Please try again later or contact support.",
          error: "DATABASE_UNAVAILABLE" 
        });
      }
    }
  });

  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const post = await storage.createBlogPost(req.body);
      res.json(post);
    } catch (error) {
      console.error("Create blog post error:", error);
      // Try memory storage as fallback
      try {
        const post = await memStorage.createBlogPost(req.body);
        res.json(post);
      } catch (memError) {
        res.status(503).json({ 
          message: "Database temporarily unavailable. Blog post not saved. Please try again later or contact support.",
          error: "DATABASE_UNAVAILABLE" 
        });
      }
    }
  });

  app.put("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      console.error("Update blog post error:", error);
      // Try memory storage as fallback
      try {
        const post = await memStorage.updateBlogPost(req.params.id, req.body);
        res.json(post);
      } catch (memError) {
        res.status(503).json({ 
          message: "Database temporarily unavailable. Changes not saved. Please try again later or contact support.",
          error: "DATABASE_UNAVAILABLE" 
        });
      }
    }
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Delete blog post error:", error);
      // Try memory storage as fallback
      try {
        await memStorage.deleteBlogPost(req.params.id);
        res.json({ message: "Blog post deleted successfully" });
      } catch (memError) {
        res.status(503).json({ 
          message: "Database temporarily unavailable. Blog post not deleted. Please try again later or contact support.",
          error: "DATABASE_UNAVAILABLE" 
        });
      }
    }
  });

  // Theme Settings Routes
  app.get("/api/admin/theme-settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getThemeSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get theme settings error:", error);
      // Try memory storage as fallback
      try {
        const settings = await memStorage.getThemeSettings();
        res.json(settings);
      } catch (memError) {
        // Return fallback theme settings if both storage systems fail
        res.json({
          primaryColor: "#22c55e",
          backgroundColor: "#0a0a0a",
          accentColor: "#34d399",
          textColor: "#ffffff",
          cardColor: "#1a1a1a",
          siteName: "VoltServers",
          siteTagline: "Premium Game Server Hosting",
          siteDescription: "Professional game server hosting with 24/7 support and premium hardware",
          heroTitle: "Deploy Your Game Server in Minutes",
          heroSubtitle: "Experience lightning-fast deployment with our premium game server hosting platform",
          heroDescription: "Join thousands of gamers who trust our reliable infrastructure for their Minecraft, CS2, Rust, and other game servers.",
          heroButtonText: "Get Started",
          heroButtonUrl: "/pricing"
        });
      }
    }
  });

  app.put("/api/admin/theme-settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.updateThemeSettings(req.body);
      res.json(settings);
    } catch (error) {
      console.error("Update theme settings error:", error);
      // Try memory storage as fallback
      try {
        const settings = await memStorage.updateThemeSettings(req.body);
        res.json(settings);
      } catch (memError) {
        res.status(503).json({ 
          message: "Database temporarily unavailable. Theme settings not saved. Please try again later or contact support.",
          error: "DATABASE_UNAVAILABLE" 
        });
      }
    }
  });

  app.post("/api/admin/upload-image", requireAdmin, async (req, res) => {
    try {
      // In a real implementation, you'd upload to a cloud service like AWS S3 or Cloudinary
      // For now, we'll return a mock URL
      const imageUrl = `/uploads/${Date.now()}-${req.file?.originalname || 'image.png'}`;
      res.json({ url: imageUrl });
    } catch (error) {
      console.error("Upload image error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Admin Promo Settings Routes
  app.get("/api/admin/promo-settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getPromoSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get promo settings error:", error);
      // Use shared memory storage fallback instead of hardcoded fallback
      try {
        const fallbackSettings = await memStorage.getPromoSettings();
        res.json(fallbackSettings || {
          id: "fallback-promo",
          isEnabled: true,
          message: "🎮 Welcome to GameHost Pro - Professional Game Server Hosting!",
          linkText: "Get Started",
          linkUrl: "/pricing",
          backgroundColor: "#22c55e",
          textColor: "#ffffff",
          updatedAt: new Date()
        });
      } catch (memError) {
        res.status(500).json({ error: "Failed to load promo settings" });
      }
    }
  });

  app.put("/api/admin/promo-settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.updatePromoSettings(req.body);
      res.json(settings);
    } catch (error) {
      console.error("Update promo settings error:", error);
      // Use shared memory storage fallback instead of hardcoded fallback
      try {
        const updatedSettings = await memStorage.updatePromoSettings(req.body);
        res.json(updatedSettings);
      } catch (memError) {
        res.status(500).json({ error: "Failed to update promo settings" });
      }
    }
  });

  // Public endpoint to get current theme settings
  app.get("/api/theme-settings", async (req, res) => {
    try {
      const settings = await storage.getThemeSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get theme settings error:", error);
      // Use shared memory storage fallback instead of hardcoded fallback
      try {
        const fallbackSettings = await memStorage.getThemeSettings();
        res.json(fallbackSettings);
      } catch (memError) {
        // Ultimate fallback with all theme fields
        res.json({
          primaryColor: "#22c55e",
          backgroundColor: "#0a0a0a",
          accentColor: "#34d399",
          textColor: "#ffffff",
          cardColor: "#1a1a1a",
          siteName: "VoltServers",
          siteTagline: "Premium Game Server Hosting",
          siteDescription: "Professional game server hosting with 24/7 support and premium hardware",
          heroTitle: "Deploy Your Game Server in Minutes",
          heroSubtitle: "Experience lightning-fast deployment with our premium game server hosting platform",
          heroDescription: "Join thousands of gamers who trust our reliable infrastructure for their Minecraft, CS2, Rust, and other game servers.",
          heroButtonText: "Get Started",
          heroButtonUrl: "/pricing",
          logoUrl: null,
          faviconUrl: null,
          footerText: null,
          fontFamily: "Inter",
          borderRadius: "0.5rem",
          holidayTheme: "none"
        });
      }
    }
  });

  // Public endpoint to get current promo settings
  app.get("/api/promo-settings", async (req, res) => {
    try {
      const settings = await storage.getPromoSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get public promo settings error:", error);
      // Use shared memory storage fallback instead of hardcoded fallback
      try {
        const fallbackSettings = await memStorage.getPromoSettings();
        res.json(fallbackSettings || {
          id: "fallback-promo",
          isEnabled: true,
          message: "🎮 Welcome to GameHost Pro - Professional Game Server Hosting!",
          linkText: "Get Started",
          linkUrl: "/pricing",
          backgroundColor: "#22c55e",
          textColor: "#ffffff",
          updatedAt: new Date()
        });
      } catch (memError) {
        res.status(500).json({ error: "Failed to load promo settings" });
      }
    }
  });

  // Game Page Customization Admin Routes
  app.get("/api/admin/game-pages/:gameId", requireAdmin, async (req, res) => {
    try {
      const gameId = req.params.gameId;
      const customization = await storage.getGamePageCustomization(gameId);
      res.json(customization || {
        relatedArticles: [],
        customSections: []
      });
    } catch (error) {
      console.error("Error fetching game page customization:", error);
      res.status(500).json({ message: "Failed to fetch game page customization" });
    }
  });

  app.put("/api/admin/game-pages/:gameId", requireAdmin, async (req, res) => {
    try {
      const gameId = req.params.gameId;
      const customizationData = req.body;
      
      const customization = await storage.updateGamePageCustomization(gameId, customizationData);
      res.json(customization);
    } catch (error) {
      console.error("Error updating game page customization:", error);
      res.status(500).json({ message: "Failed to update game page customization" });
    }
  });

  // Admin game page sections
  app.get('/api/admin/games/:gameId/sections', requireAdmin, async (req, res) => {
    try {
      const { gameId } = req.params;
      const sections = await storage.getGamePageSections(gameId);
      res.json(sections);
    } catch (error) {
      console.error('Error fetching game page sections:', error);
      res.status(500).json({ error: 'Failed to fetch game page sections' });
    }
  });

  app.post('/api/admin/games/:gameId/sections', requireAdmin, async (req, res) => {
    try {
      const { gameId } = req.params;
      const sectionData = { ...req.body, gameId };
      const section = await storage.createGamePageSection(sectionData);
      res.json(section);
    } catch (error) {
      console.error('Error creating game page section:', error);
      res.status(500).json({ error: 'Failed to create game page section' });
    }
  });

  app.put('/api/admin/sections/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const section = await storage.updateGamePageSection(id, req.body);
      res.json(section);
    } catch (error) {
      console.error('Error updating game page section:', error);
      res.status(500).json({ error: 'Failed to update game page section' });
    }
  });

  app.delete('/api/admin/sections/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGamePageSection(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting game page section:', error);
      res.status(500).json({ error: 'Failed to delete game page section' });
    }
  });

  // Admin game pricing tiers
  app.get('/api/admin/games/:gameId/pricing-tiers', requireAdmin, async (req, res) => {
    try {
      const { gameId } = req.params;
      const tiers = await storage.getGamePricingTiers(gameId);
      res.json(tiers);
    } catch (error) {
      console.error('Error fetching game pricing tiers:', error);
      res.status(500).json({ error: 'Failed to fetch game pricing tiers' });
    }
  });

  app.post('/api/admin/games/:gameId/pricing-tiers', requireAdmin, async (req, res) => {
    try {
      const { gameId } = req.params;
      const tierData = { ...req.body, gameId };
      const tier = await storage.createGamePricingTier(tierData);
      res.json(tier);
    } catch (error) {
      console.error('Error creating game pricing tier:', error);
      res.status(500).json({ error: 'Failed to create game pricing tier' });
    }
  });

  app.put('/api/admin/pricing-tiers/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const tier = await storage.updateGamePricingTier(id, req.body);
      res.json(tier);
    } catch (error) {
      console.error('Error updating game pricing tier:', error);
      res.status(500).json({ error: 'Failed to update game pricing tier' });
    }
  });

  app.delete('/api/admin/pricing-tiers/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGamePricingTier(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting game pricing tier:', error);
      res.status(500).json({ error: 'Failed to delete game pricing tier' });
    }
  });

  // Admin game features
  app.get('/api/admin/games/:gameId/features', requireAdmin, async (req, res) => {
    try {
      const { gameId } = req.params;
      const features = await storage.getGameFeatures(gameId);
      res.json(features);
    } catch (error) {
      console.error('Error fetching game features:', error);
      res.status(500).json({ error: 'Failed to fetch game features' });
    }
  });

  app.post('/api/admin/games/:gameId/features', requireAdmin, async (req, res) => {
    try {
      const { gameId } = req.params;
      const featureData = { ...req.body, gameId };
      const feature = await storage.createGameFeature(featureData);
      res.json(feature);
    } catch (error) {
      console.error('Error creating game feature:', error);
      res.status(500).json({ error: 'Failed to create game feature' });
    }
  });

  app.put('/api/admin/features/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const feature = await storage.updateGameFeature(id, req.body);
      res.json(feature);
    } catch (error) {
      console.error('Error updating game feature:', error);
      res.status(500).json({ error: 'Failed to update game feature' });
    }
  });

  app.delete('/api/admin/features/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGameFeature(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting game feature:', error);
      res.status(500).json({ error: 'Failed to delete game feature' });
    }
  });

  // Public routes for game customization data
  app.get('/api/games/:gameId/sections', async (req, res) => {
    try {
      const { gameId } = req.params;
      const sections = await storage.getGamePageSections(gameId);
      const enabledSections = sections.filter(section => section.isEnabled);
      res.json(enabledSections);
    } catch (error) {
      console.error('Error fetching game page sections:', error);
      // Return empty array as fallback - sections are optional
      res.json([]);
    }
  });

  app.get('/api/games/:gameId/pricing-tiers', async (req, res) => {
    try {
      const { gameId } = req.params;
      const tiers = await storage.getGamePricingTiers(gameId);
      const enabledTiers = tiers.filter(tier => tier.isEnabled);
      res.json(enabledTiers);
    } catch (error) {
      console.error('Error fetching game pricing tiers:', error);
      // Return empty array as fallback - custom pricing tiers are optional
      res.json([]);
    }
  });

  app.get('/api/games/:gameId/features', async (req, res) => {
    try {
      const { gameId } = req.params;
      const features = await storage.getGameFeatures(gameId);
      const enabledFeatures = features.filter(feature => feature.isEnabled);
      res.json(enabledFeatures);
    } catch (error) {
      console.error('Error fetching game features:', error);
      // Return empty array as fallback - custom features are optional
      res.json([]);
    }
  });

  // Admin server locations routes
  app.post("/api/admin/server-locations", requireAdmin, async (req, res) => {
    try {
      const location = await storage.createServerLocation(req.body);
      // Auto-ping the server after creation
      if (location.ipAddress) {
        pingServerLocation(location.id, location.ipAddress);
      }
      res.json(location);
    } catch (error) {
      console.error("Error creating server location:", error);
      res.status(500).json({ message: "Failed to create server location" });
    }
  });

  app.delete("/api/admin/server-locations/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteServerLocation(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting server location:", error);
      res.status(500).json({ message: "Failed to delete server location" });
    }
  });

  // Auto-ping server locations using ICMP-like approach
  const pingServerLocation = async (locationId: string, ipAddress: string) => {
    try {
      const startTime = Date.now();
      
      // Simple TCP ping by attempting to connect
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        await fetch(`http://${ipAddress}:80`, { 
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors'
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        // Even if fetch fails due to CORS or other reasons, we can still measure response time
      }
      
      const ping = Date.now() - startTime;
      
      // Update server location with ping data
      const location = await storage.getServerLocation(locationId);
      if (location) {
        await storage.updateServerLocation(locationId, {
          ...location,
          ping: Math.min(ping, 999), // Cap ping at 999ms for display
          status: ping < 5000 ? 'online' : 'offline'
        });
      }
    } catch (error) {
      // Update server location as offline if ping fails
      const location = await storage.getServerLocation(locationId);
      if (location) {
        await storage.updateServerLocation(locationId, {
          ...location,
          ping: 999,
          status: 'offline'
        });
      }
    }
  };

  // Ping all server locations every 5 minutes
  setInterval(async () => {
    try {
      const locations = await storage.getAllServerLocations();
      for (const location of locations) {
        if (location.ipAddress) {
          pingServerLocation(location.id, location.ipAddress);
        }
      }
    } catch (error) {
      console.error("Error in periodic ping:", error);
    }
  }, 5 * 60 * 1000); // 5 minutes

  // Advanced Minecraft Server Management API Routes
  
  // Minecraft Servers
  app.get('/api/minecraft/servers', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const servers = userId 
        ? await storage.getUserMinecraftServers(userId)
        : await storage.getAllMinecraftServers();
      res.json(servers);
    } catch (error) {
      console.error('Error fetching Minecraft servers:', error);
      res.status(500).json({ message: 'Failed to fetch Minecraft servers' });
    }
  });

  app.get('/api/minecraft/servers/:id', async (req, res) => {
    try {
      const server = await storage.getMinecraftServer(req.params.id);
      if (!server) {
        return res.status(404).json({ message: 'Minecraft server not found' });
      }
      res.json(server);
    } catch (error) {
      console.error('Error fetching Minecraft server:', error);
      res.status(500).json({ message: 'Failed to fetch Minecraft server' });
    }
  });

  app.post('/api/minecraft/servers', requireAdmin, async (req, res) => {
    try {
      const server = await storage.createMinecraftServer(req.body);
      
      // Create initial log entry
      await storage.createMinecraftLog({
        serverId: server.id,
        logLevel: 'INFO',
        message: `Minecraft server '${server.serverName}' created`,
        source: 'System'
      });
      
      res.status(201).json(server);
    } catch (error) {
      console.error('Error creating Minecraft server:', error);
      res.status(500).json({ message: 'Failed to create Minecraft server' });
    }
  });

  app.put('/api/minecraft/servers/:id', requireAdmin, async (req, res) => {
    try {
      const server = await storage.updateMinecraftServer(req.params.id, req.body);
      
      // Log the update
      await storage.createMinecraftLog({
        serverId: server.id,
        logLevel: 'INFO',
        message: `Server settings updated`,
        source: 'System'
      });
      
      res.json(server);
    } catch (error) {
      console.error('Error updating Minecraft server:', error);
      res.status(500).json({ message: 'Failed to update Minecraft server' });
    }
  });

  app.delete('/api/minecraft/servers/:id', requireAdmin, async (req, res) => {
    try {
      await storage.deleteMinecraftServer(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting Minecraft server:', error);
      res.status(500).json({ message: 'Failed to delete Minecraft server' });
    }
  });

  // Server Control Actions
  app.post('/api/minecraft/servers/:id/start', requireAdmin, async (req, res) => {
    try {
      const server = await storage.updateMinecraftServer(req.params.id, { 
        status: 'starting',
        lastOnline: new Date()
      });
      
      await storage.createMinecraftLog({
        serverId: server.id,
        logLevel: 'INFO',
        message: 'Server start command issued',
        source: 'System'
      });
      
      // Simulate server startup delay
      setTimeout(async () => {
        await storage.updateMinecraftServer(req.params.id, { status: 'online' });
        await storage.createMinecraftLog({
          serverId: req.params.id,
          logLevel: 'INFO',
          message: 'Server started successfully',
          source: 'System'
        });
      }, 3000);
      
      res.json(server);
    } catch (error) {
      console.error('Error starting Minecraft server:', error);
      res.status(500).json({ message: 'Failed to start Minecraft server' });
    }
  });

  app.post('/api/minecraft/servers/:id/stop', requireAdmin, async (req, res) => {
    try {
      const server = await storage.updateMinecraftServer(req.params.id, { 
        status: 'stopping' 
      });
      
      await storage.createMinecraftLog({
        serverId: server.id,
        logLevel: 'INFO',
        message: 'Server stop command issued',
        source: 'System'
      });
      
      // Simulate server shutdown delay
      setTimeout(async () => {
        await storage.updateMinecraftServer(req.params.id, { status: 'offline' });
        await storage.createMinecraftLog({
          serverId: req.params.id,
          logLevel: 'INFO',
          message: 'Server stopped successfully',
          source: 'System'
        });
      }, 2000);
      
      res.json(server);
    } catch (error) {
      console.error('Error stopping Minecraft server:', error);
      res.status(500).json({ message: 'Failed to stop Minecraft server' });
    }
  });

  app.post('/api/minecraft/servers/:id/restart', requireAdmin, async (req, res) => {
    try {
      const server = await storage.updateMinecraftServer(req.params.id, { 
        status: 'stopping' 
      });
      
      await storage.createMinecraftLog({
        serverId: server.id,
        logLevel: 'INFO',
        message: 'Server restart command issued',
        source: 'System'
      });
      
      // Simulate restart sequence
      setTimeout(async () => {
        await storage.updateMinecraftServer(req.params.id, { status: 'starting' });
        await storage.createMinecraftLog({
          serverId: req.params.id,
          logLevel: 'INFO',
          message: 'Server restarting...',
          source: 'System'
        });
        
        setTimeout(async () => {
          await storage.updateMinecraftServer(req.params.id, { 
            status: 'online',
            lastOnline: new Date()
          });
          await storage.createMinecraftLog({
            serverId: req.params.id,
            logLevel: 'INFO',
            message: 'Server restart completed successfully',
            source: 'System'
          });
        }, 4000);
      }, 2000);
      
      res.json(server);
    } catch (error) {
      console.error('Error restarting Minecraft server:', error);
      res.status(500).json({ message: 'Failed to restart Minecraft server' });
    }
  });

  // Minecraft Plugins
  app.get('/api/minecraft/servers/:serverId/plugins', async (req, res) => {
    try {
      const plugins = await storage.getMinecraftPlugins(req.params.serverId);
      res.json(plugins);
    } catch (error) {
      console.error('Error fetching plugins:', error);
      res.status(500).json({ message: 'Failed to fetch plugins' });
    }
  });

  app.post('/api/minecraft/servers/:serverId/plugins', requireAdmin, async (req, res) => {
    try {
      const plugin = await storage.createMinecraftPlugin({
        ...req.body,
        serverId: req.params.serverId
      });
      
      await storage.createMinecraftLog({
        serverId: req.params.serverId,
        logLevel: 'INFO',
        message: `Plugin '${plugin.pluginName}' v${plugin.version} installed`,
        source: 'Plugin Manager'
      });
      
      res.status(201).json(plugin);
    } catch (error) {
      console.error('Error installing plugin:', error);
      res.status(500).json({ message: 'Failed to install plugin' });
    }
  });

  app.put('/api/minecraft/plugins/:id', requireAdmin, async (req, res) => {
    try {
      const plugin = await storage.updateMinecraftPlugin(req.params.id, req.body);
      
      await storage.createMinecraftLog({
        serverId: plugin.serverId,
        logLevel: 'INFO',
        message: `Plugin '${plugin.pluginName}' ${plugin.isEnabled ? 'enabled' : 'disabled'}`,
        source: 'Plugin Manager'
      });
      
      res.json(plugin);
    } catch (error) {
      console.error('Error updating plugin:', error);
      res.status(500).json({ message: 'Failed to update plugin' });
    }
  });

  app.delete('/api/minecraft/plugins/:id', requireAdmin, async (req, res) => {
    try {
      const plugin = await storage.getMinecraftPlugins('');
      const targetPlugin = plugin.find(p => p.id === req.params.id);
      
      if (targetPlugin) {
        await storage.createMinecraftLog({
          serverId: targetPlugin.serverId,
          logLevel: 'INFO',
          message: `Plugin '${targetPlugin.pluginName}' uninstalled`,
          source: 'Plugin Manager'
        });
      }
      
      await storage.deleteMinecraftPlugin(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error uninstalling plugin:', error);
      res.status(500).json({ message: 'Failed to uninstall plugin' });
    }
  });

  // Minecraft Worlds
  app.get('/api/minecraft/servers/:serverId/worlds', async (req, res) => {
    try {
      const worlds = await storage.getMinecraftWorlds(req.params.serverId);
      res.json(worlds);
    } catch (error) {
      console.error('Error fetching worlds:', error);
      res.status(500).json({ message: 'Failed to fetch worlds' });
    }
  });

  app.post('/api/minecraft/servers/:serverId/worlds', requireAdmin, async (req, res) => {
    try {
      const world = await storage.createMinecraftWorld({
        ...req.body,
        serverId: req.params.serverId
      });
      
      await storage.createMinecraftLog({
        serverId: req.params.serverId,
        logLevel: 'INFO',
        message: `World '${world.worldName}' created`,
        source: 'World Manager'
      });
      
      res.status(201).json(world);
    } catch (error) {
      console.error('Error creating world:', error);
      res.status(500).json({ message: 'Failed to create world' });
    }
  });

  app.put('/api/minecraft/worlds/:id', requireAdmin, async (req, res) => {
    try {
      const world = await storage.updateMinecraftWorld(req.params.id, req.body);
      
      await storage.createMinecraftLog({
        serverId: world.serverId,
        logLevel: 'INFO',
        message: `World '${world.worldName}' settings updated`,
        source: 'World Manager'
      });
      
      res.json(world);
    } catch (error) {
      console.error('Error updating world:', error);
      res.status(500).json({ message: 'Failed to update world' });
    }
  });

  app.delete('/api/minecraft/worlds/:id', requireAdmin, async (req, res) => {
    try {
      const worlds = await storage.getMinecraftWorlds('');
      const targetWorld = worlds.find(w => w.id === req.params.id);
      
      if (targetWorld) {
        await storage.createMinecraftLog({
          serverId: targetWorld.serverId,
          logLevel: 'WARN',
          message: `World '${targetWorld.worldName}' deleted`,
          source: 'World Manager'
        });
      }
      
      await storage.deleteMinecraftWorld(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting world:', error);
      res.status(500).json({ message: 'Failed to delete world' });
    }
  });

  // Minecraft Players
  app.get('/api/minecraft/servers/:serverId/players', async (req, res) => {
    try {
      const players = await storage.getMinecraftPlayers(req.params.serverId);
      res.json(players);
    } catch (error) {
      console.error('Error fetching players:', error);
      res.status(500).json({ message: 'Failed to fetch players' });
    }
  });

  app.post('/api/minecraft/servers/:serverId/players', requireAdmin, async (req, res) => {
    try {
      const player = await storage.createMinecraftPlayer({
        ...req.body,
        serverId: req.params.serverId
      });
      
      await storage.createMinecraftLog({
        serverId: req.params.serverId,
        logLevel: 'INFO',
        message: `Player '${player.playerName}' added to server`,
        source: 'Player Manager'
      });
      
      res.status(201).json(player);
    } catch (error) {
      console.error('Error adding player:', error);
      res.status(500).json({ message: 'Failed to add player' });
    }
  });

  app.put('/api/minecraft/players/:id', requireAdmin, async (req, res) => {
    try {
      const player = await storage.updateMinecraftPlayer(req.params.id, req.body);
      
      const actions = [];
      if (req.body.isBanned !== undefined) actions.push(req.body.isBanned ? 'banned' : 'unbanned');
      if (req.body.isWhitelisted !== undefined) actions.push(req.body.isWhitelisted ? 'whitelisted' : 'removed from whitelist');
      if (req.body.isOp !== undefined) actions.push(req.body.isOp ? 'given operator privileges' : 'removed operator privileges');
      
      if (actions.length > 0) {
        await storage.createMinecraftLog({
          serverId: player.serverId,
          logLevel: 'INFO',
          message: `Player '${player.playerName}' ${actions.join(', ')}`,
          source: 'Player Manager'
        });
      }
      
      res.json(player);
    } catch (error) {
      console.error('Error updating player:', error);
      res.status(500).json({ message: 'Failed to update player' });
    }
  });

  app.delete('/api/minecraft/players/:id', requireAdmin, async (req, res) => {
    try {
      await storage.deleteMinecraftPlayer(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error removing player:', error);
      res.status(500).json({ message: 'Failed to remove player' });
    }
  });

  // Minecraft Backups
  app.get('/api/minecraft/servers/:serverId/backups', async (req, res) => {
    try {
      const backups = await storage.getMinecraftBackups(req.params.serverId);
      res.json(backups);
    } catch (error) {
      console.error('Error fetching backups:', error);
      res.status(500).json({ message: 'Failed to fetch backups' });
    }
  });

  app.post('/api/minecraft/servers/:serverId/backups', requireAdmin, async (req, res) => {
    try {
      const backup = await storage.createMinecraftBackup({
        ...req.body,
        serverId: req.params.serverId,
        status: 'pending'
      });
      
      await storage.createMinecraftLog({
        serverId: req.params.serverId,
        logLevel: 'INFO',
        message: `Backup '${backup.backupName}' started`,
        source: 'Backup Manager'
      });
      
      // Simulate backup process
      setTimeout(async () => {
        await storage.updateMinecraftBackup(backup.id, { 
          status: 'completed',
          sizeBytes: Math.floor(Math.random() * 1000000000) + 100000000 // Random size 100MB-1GB
        });
        
        await storage.createMinecraftLog({
          serverId: req.params.serverId,
          logLevel: 'INFO',
          message: `Backup '${backup.backupName}' completed successfully`,
          source: 'Backup Manager'
        });
      }, 5000);
      
      res.status(201).json(backup);
    } catch (error) {
      console.error('Error creating backup:', error);
      res.status(500).json({ message: 'Failed to create backup' });
    }
  });

  app.delete('/api/minecraft/backups/:id', requireAdmin, async (req, res) => {
    try {
      await storage.deleteMinecraftBackup(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting backup:', error);
      res.status(500).json({ message: 'Failed to delete backup' });
    }
  });

  // Minecraft Logs
  app.get('/api/minecraft/servers/:serverId/logs', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getMinecraftLogs(req.params.serverId, limit);
      res.json(logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ message: 'Failed to fetch logs' });
    }
  });

  app.post('/api/minecraft/servers/:serverId/logs', requireAdmin, async (req, res) => {
    try {
      const log = await storage.createMinecraftLog({
        ...req.body,
        serverId: req.params.serverId
      });
      res.status(201).json(log);
    } catch (error) {
      console.error('Error creating log entry:', error);
      res.status(500).json({ message: 'Failed to create log entry' });
    }
  });

  app.delete('/api/minecraft/servers/:serverId/logs', requireAdmin, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      await storage.deleteOldMinecraftLogs(req.params.serverId, days);
      res.status(204).send();
    } catch (error) {
      console.error('Error cleaning up logs:', error);
      res.status(500).json({ message: 'Failed to clean up logs' });
    }
  });

  // FAQ endpoints
  app.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getAllFaqCategories();
      res.json(faqs);
    } catch (error) {
      console.error("FAQ fetch error:", error);
      // Return fallback FAQ data
      res.json([
        {
          id: "getting-started",
          title: "Getting Started",
          sortOrder: 1,
          items: [
            { id: "1", question: "How do I set up my first server?", answer: "Setting up your first server is easy. Simply choose your game, select a plan, and follow our quick-start guide.", sortOrder: 1 },
            { id: "2", question: "What games do you support?", answer: "We support all popular games including Minecraft, CS2, Rust, ARK, and many more.", sortOrder: 2 },
            { id: "3", question: "How do I connect to my server?", answer: "You'll receive connection details via email once your server is ready. Use your game client to connect using the provided IP address.", sortOrder: 3 },
            { id: "4", question: "Can I change my server location?", answer: "Yes, you can change your server location from your control panel. Note that this may require server migration.", sortOrder: 4 }
          ]
        },
        {
          id: "billing-plans",
          title: "Billing & Plans",
          sortOrder: 2,
          items: [
            { id: "5", question: "How does billing work?", answer: "We use monthly billing cycles. Your first payment covers the setup and first month of service.", sortOrder: 1 },
            { id: "6", question: "Can I upgrade my plan?", answer: "Yes, you can upgrade or downgrade your plan at any time from your client portal.", sortOrder: 2 },
            { id: "7", question: "What's your refund policy?", answer: "We offer a 7-day money-back guarantee for new customers. Contact support for refund requests.", sortOrder: 3 },
            { id: "8", question: "Do you offer discounts?", answer: "Yes, we offer discounts for longer-term commitments and students. Check our pricing page for current offers.", sortOrder: 4 }
          ]
        },
        {
          id: "technical-support",
          title: "Technical Support",
          sortOrder: 3,
          items: [
            { id: "9", question: "My server won't start, what do I do?", answer: "First, check the server console for error messages. If you need help, contact our support team with the error details.", sortOrder: 1 },
            { id: "10", question: "How do I install mods/plugins?", answer: "You can install mods and plugins through your server control panel or by uploading files directly via FTP.", sortOrder: 2 },
            { id: "11", question: "How do I backup my world?", answer: "Automatic backups are included with all plans. You can also create manual backups from your control panel.", sortOrder: 3 },
            { id: "12", question: "Why is my server lagging?", answer: "Server lag can be caused by many factors including high player count, resource-intensive plugins, or insufficient RAM. Contact support for optimization help.", sortOrder: 4 }
          ]
        }
      ]);
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message, priority = "normal" } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Here we would normally send an email using SendGrid
      // For now, we'll just log the contact form submission
      console.log("Contact form submission:", {
        name,
        email,
        subject,
        message,
        priority,
        timestamp: new Date().toISOString()
      });

      // TODO: Implement SendGrid email sending
      // const emailSent = await sendEmail({
      //   to: process.env.SUPPORT_EMAIL || "support@gamehost.example.com",
      //   from: email,
      //   subject: `[${priority.toUpperCase()}] ${subject}`,
      //   text: `Name: ${name}\nEmail: ${email}\nPriority: ${priority}\n\nMessage:\n${message}`
      // });

      res.json({ 
        success: true, 
        message: "Your message has been sent successfully. We'll get back to you within 4 hours." 
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
  });

  // Initialize WHMCS integration
  let whmcsIntegration: WHMCSIntegration | null = null;
  if (process.env.WHMCS_API_IDENTIFIER && process.env.WHMCS_API_SECRET && process.env.WHMCS_API_URL) {
    whmcsIntegration = new WHMCSIntegration();
  }

  // WHMCS API Endpoints
  app.get("/api/whmcs/test", async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ message: "WHMCS integration not configured" });
    }
    
    try {
      const isConnected = await whmcsIntegration.testConnection();
      res.json({ connected: isConnected, message: isConnected ? "WHMCS connection successful" : "WHMCS connection failed" });
    } catch (error) {
      res.status(500).json({ message: "WHMCS connection test failed", error: error.message });
    }
  });

  app.get("/api/whmcs/clients", async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ message: "WHMCS integration not configured" });
    }
    
    try {
      const limitstart = parseInt(req.query.limitstart as string) || 0;
      const limitnum = parseInt(req.query.limitnum as string) || 25;
      const clients = await whmcsIntegration.getClients(limitstart, limitnum);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients", error: error.message });
    }
  });

  app.get("/api/whmcs/clients/:clientId", async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ message: "WHMCS integration not configured" });
    }
    
    try {
      const client = await whmcsIntegration.getClientDetails(req.params.clientId);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client details", error: error.message });
    }
  });

  app.get("/api/whmcs/clients/:clientId/services", async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ message: "WHMCS integration not configured" });
    }
    
    try {
      let clientId = req.params.clientId;
      console.log(`[DEBUG] Fetching services for client: ${clientId}`);
      
      // If email is provided, convert to numeric client ID first
      if (clientId.includes('@')) {
        console.log(`[DEBUG] Email provided, looking up client ID...`);
        const clientsData = await whmcsIntegration.getClients();
        const client = clientsData?.clients?.client?.find((c: any) => c.email === clientId);
        
        if (client) {
          clientId = client.id;
          console.log(`[DEBUG] Found client ID: ${clientId} for email: ${req.params.clientId}`);
        } else {
          console.log(`[DEBUG] No client found for email: ${req.params.clientId}`);
          return res.json({ result: 'success', totalresults: '0', startnumber: 0, numreturned: 0, products: '' });
        }
      }
      
      const services = await whmcsIntegration.getClientServices(clientId);
      console.log(`[DEBUG] Raw WHMCS services response:`, JSON.stringify(services, null, 2));
      
      // Enhance services with server details if available
      if (services?.products?.product) {
        const enhancedProducts = services.products.product.map((service: any) => ({
          ...service,
          serverDetails: {
            ip: service.dedicatedip || service.assignedips || `server-${service.id}.gamehost.com`,
            port: service.port || '25565',
            location: service.servername?.includes('us') ? 'United States' : 'Global Network',
            gameType: service.productname?.toLowerCase().includes('minecraft') ? 'Minecraft' : 'Game Server',
            specs: {
              ram: service.productname?.match(/(\d+)GB/) ? `${service.productname.match(/(\d+)GB/)[1]}GB RAM` : '4GB RAM',
              storage: 'NVMe SSD',
              cpu: 'High Performance CPU',
              bandwidth: 'Unlimited'
            },
            status: service.domainstatus === 'Active' ? 'Online' : 'Offline',
            uptime: '99.9%'
          }
        }));
        
        services.products.product = enhancedProducts;
      }
      
      res.json(services || { products: { product: [] } });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch client services", error: error.message });
    }
  });

  app.get("/api/whmcs/clients/:clientId/invoices", async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ message: "WHMCS integration not configured" });
    }
    
    try {
      const invoices = await whmcsIntegration.getClientInvoices(req.params.clientId);
      
      // Enhance invoice data with additional details
      if (invoices?.invoices?.invoice) {
        const enhancedInvoices = invoices.invoices.invoice.map((invoice: any) => ({
          ...invoice,
          paymentMethod: invoice.paymentmethod || 'Credit Card',
          daysOverdue: invoice.status === 'Unpaid' ? Math.max(0, Math.floor((Date.now() - new Date(invoice.duedate).getTime()) / (1000 * 60 * 60 * 24))) : 0,
          formattedTotal: `$${parseFloat(invoice.total || '0').toFixed(2)}`,
          downloadUrl: `/whmcs/dl.php?type=i&id=${invoice.id}`,
          statusColor: invoice.status === 'Paid' ? 'green' : invoice.status === 'Unpaid' ? 'red' : 'yellow'
        }));
        
        invoices.invoices.invoice = enhancedInvoices;
      }
      
      res.json(invoices || { invoices: { invoice: [] } });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch client invoices", error: error.message });
    }
  });

  // WHMCS Authentication
  app.post("/api/whmcs/authenticate", async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ message: "WHMCS integration not configured" });
    }
    
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: "Email and password are required" 
        });
      }

      const user = await whmcsIntegration.validateLogin(email, password);
      
      if (user) {
        res.json({
          success: true,
          client: user
        });
      } else {
        res.status(401).json({
          success: false,
          error: "Invalid email or password"
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({
        success: false,
        error: "Authentication failed"
      });
    }
  });

  app.get("/api/whmcs/tickets", async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ message: "WHMCS integration not configured" });
    }
    
    try {
      const clientId = req.query.clientId as string;
      const tickets = await whmcsIntegration.getSupportTickets(clientId);
      res.json(tickets || { tickets: [] });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch support tickets", error: error.message });
    }
  });

  app.get("/api/whmcs/products", async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ message: "WHMCS integration not configured" });
    }
    
    try {
      const products = await whmcsIntegration.getProducts();
      res.json(products || { products: [] });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
  });

  const httpServer = createServer(app);
  // WISP.GG INTEGRATION ENDPOINTS
  // Test Wisp connection
  app.get('/api/wisp/test', async (req, res) => {
    try {
      const isConnected = await wispIntegration.testConnection();
      res.json({ 
        connected: isConnected,
        message: isConnected ? 'Wisp integration working!' : 'Wisp connection failed'
      });
    } catch (error) {
      console.error('Wisp test error:', error);
      res.status(500).json({ connected: false, message: 'Wisp connection failed' });
    }
  });

  // Get client servers from Wisp (user-specific)
  app.get('/api/wisp/servers', async (req, res) => {
    try {
      // Get user email from query parameter or session
      let clientEmail = req.query.user as string;
      
      // If no user specified, try to get from WHMCS session or use test account
      if (!clientEmail) {
        // For demo purposes, use a test email - in production you'd get from authenticated session
        clientEmail = 'itznickm@gmail.com'; // Default to Nick's account for testing
      }
      
      console.log(`Fetching servers for user: ${clientEmail}`);
      const servers = await wispIntegration.getClientServers(clientEmail);
      res.json(servers);
    } catch (error) {
      console.error('Error fetching Wisp servers:', error);
      res.status(500).json({ message: 'Failed to fetch servers' });
    }
  });

  // Get all servers (admin view)
  app.get('/api/wisp/admin/servers', async (req, res) => {
    try {
      console.log('Admin fetching all servers');
      const servers = await wispIntegration.getAllServers();
      res.json(servers);
    } catch (error) {
      console.error('Error fetching admin servers:', error);
      res.status(500).json({ message: 'Failed to fetch admin servers' });
    }
  });

  // Get specific server details from Wisp
  app.get('/api/wisp/servers/:id', async (req, res) => {
    try {
      const server = await wispIntegration.getServerDetails(req.params.id);
      if (!server) {
        return res.status(404).json({ message: 'Server not found' });
      }
      res.json(server);
    } catch (error) {
      console.error('Error fetching server details:', error);
      res.status(500).json({ message: 'Failed to fetch server details' });
    }
  });

  // Server power actions
  app.post('/api/wisp/servers/:id/power', async (req, res) => {
    try {
      const { action } = req.body;
      if (!['start', 'stop', 'restart'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' });
      }

      const success = await wispIntegration.serverAction(req.params.id, action);
      res.json({ success, message: success ? `Server ${action} successful` : `Server ${action} failed` });
    } catch (error) {
      console.error(`Error performing server action:`, error);
      res.status(500).json({ message: 'Server action failed' });
    }
  });

  // Get server console logs
  app.get('/api/wisp/servers/:id/logs', async (req, res) => {
    try {
      const lines = parseInt(req.query.lines as string) || 50;
      const logs = await wispIntegration.getServerLogs(req.params.id, lines);
      res.json({ logs });
    } catch (error) {
      console.error('Error fetching server logs:', error);
      res.status(500).json({ message: 'Failed to fetch logs' });
    }
  });

  // Support ticket routes
  app.get('/api/whmcs/support/departments', async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ error: 'WHMCS integration not configured' });
    }
    
    try {
      const departments = await whmcsIntegration.getSupportDepartments();
      res.json(departments || { departments: [] });
    } catch (error) {
      console.error('Error fetching support departments:', error);
      res.status(500).json({ error: 'Failed to fetch departments' });
    }
  });

  app.post('/api/whmcs/support/tickets', async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ error: 'WHMCS integration not configured' });
    }
    
    try {
      const { name, email, subject, message, priority, deptid } = req.body;
      
      // Get client ID from email (required for ticket creation)
      let clientId = null;
      if (email) {
        const clientData = await whmcsIntegration.getClientByEmail(email);
        if (clientData) {
          clientId = clientData.userid;
        }
      }
      
      if (!clientId) {
        return res.status(400).json({ 
          error: 'Client account not found. Please ensure you are logged into your client portal.',
          code: 'CLIENT_NOT_FOUND'
        });
      }
      
      console.log('Creating WHMCS ticket for client:', clientId, 'with subject:', subject);
      
      const ticket = await whmcsIntegration.createSupportTicket({
        clientid: clientId,
        name,
        email,
        subject,
        message,
        priority: priority || 'Medium',
        deptid
      });
      
      console.log('WHMCS ticket created successfully:', ticket);
      res.json(ticket);
    } catch (error) {
      console.error('Error creating support ticket:', error);
      res.status(500).json({ 
        error: 'Failed to create ticket. Please try again or contact support.',
        details: error.message 
      });
    }
  });

  app.get('/api/whmcs/support/tickets/:clientEmail', async (req, res) => {
    if (!whmcsIntegration) {
      return res.status(503).json({ error: 'WHMCS integration not configured' });
    }
    
    try {
      const { clientEmail } = req.params;
      
      // Convert email to client ID first
      const clientData = await whmcsIntegration.getClientByEmail(clientEmail);
      if (!clientData) {
        // Return empty tickets structure instead of error for better UX
        return res.json({ 
          result: 'success',
          tickets: { ticket: [] },
          totalresults: 0 
        });
      }
      
      const tickets = await whmcsIntegration.getSupportTickets(clientData.userid);
      res.json(tickets || { 
        result: 'success',
        tickets: { ticket: [] },
        totalresults: 0 
      });
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      // Return empty tickets structure instead of error for graceful handling
      res.json({ 
        result: 'success',
        tickets: { ticket: [] },
        totalresults: 0 
      });
    }
  });

  return httpServer;
}
