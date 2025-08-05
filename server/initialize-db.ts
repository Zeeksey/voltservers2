import { DatabaseStorage } from "./database-storage";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export async function initializeDatabase() {
  const storage = new DatabaseStorage();
  
  try {
    // Create default admin user if it doesn't exist
    const existingAdmin = await storage.getUserByUsername("admin");
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await storage.createUser({
        username: "admin",
        password: hashedPassword,
        isAdmin: true
      });
      console.log("Created default admin user (username: admin, password: admin123)");
    }

    // Initialize default promo settings
    const existingPromo = await storage.getPromoSettings();
    if (!existingPromo) {
      await storage.updatePromoSettings({
        isEnabled: true,
        message: "🎮 New Year Special: Save 50% on all game servers! Limited time offer.",
        linkText: "Get Started",
        linkUrl: "#pricing",
        backgroundColor: "#22c55e",
        textColor: "#ffffff"
      });
      console.log("Initialized default promo settings");
    }

    // Create sample games if none exist
    const existingGames = await storage.getAllGames();
    if (existingGames.length === 0) {
      const sampleGames = [
        {
          name: "Minecraft",
          slug: "minecraft",
          description: "Java & Bedrock support, unlimited mods, automatic backups",
          imageUrl: "https://pixabay.com/get/g0f2a95e2a858acb44e5d404e612a684317375d9652e4fff2b2923d96673c86b933d76959bb030775cb48e79fb4a1b88692657d6eb50405ad040ba1f2dd006e09_1280.jpg",
          basePrice: "2.99",
          playerCount: 2847,
          isPopular: true,
          isNew: false,
          isTrending: false
        },
        {
          name: "CS2",
          slug: "cs2", 
          description: "Counter-Strike 2 servers with custom maps and plugins",
          imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          basePrice: "4.99",
          playerCount: 1234,
          isPopular: false,
          isNew: false,
          isTrending: false
        },
        {
          name: "Palworld",
          slug: "palworld",
          description: "Creature collection servers with multiplayer support",
          imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          basePrice: "9.99",
          playerCount: 1567,
          isPopular: false,
          isNew: false,
          isTrending: true
        }
      ];

      for (const game of sampleGames) {
        await storage.createGame(game);
      }
      console.log("Created sample games");
    }

    // Create sample blog posts if none exist
    const existingPosts = await storage.getAllBlogPosts();
    if (existingPosts.length === 0) {
      const samplePosts = [
        {
          title: "How to Optimize Your Minecraft Server for Better Performance",
          slug: "optimize-minecraft-server-performance",
          excerpt: "Learn essential tips and tricks to boost your Minecraft server performance and reduce lag for your players.",
          content: "# Server Optimization Guide\n\nRunning a smooth Minecraft server requires careful configuration and regular maintenance. Here are the key steps to optimize your server...",
          imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          author: "GameHost Pro Team",
          tags: ["minecraft", "optimization", "performance"],
          isPublished: true
        },
        {
          title: "Best Game Server Hosting Tips for 2025",
          slug: "best-game-server-hosting-tips-2025",
          excerpt: "Discover the top tips for choosing and managing game servers that will keep your community engaged.",
          content: "# Game Server Hosting in 2025\n\nThe gaming landscape is evolving rapidly. Here's what you need to know...",
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          author: "Sarah Johnson",
          tags: ["hosting", "gaming", "servers"],
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
          features: ["DDoS Protection", "Automatic Backups", "24/7 Support", "Custom Control Panel"],
          isPopular: false
        },
        {
          name: "Pro",
          price: "5.99",
          ram: "4GB RAM", 
          storage: "50GB SSD",
          maxPlayers: 50,
          features: ["DDoS Protection", "Automatic Backups", "24/7 Support", "Custom Control Panel", "Plugin Manager", "FTP Access"],
          isPopular: true
        },
        {
          name: "Enterprise", 
          price: "12.99",
          ram: "8GB RAM",
          storage: "100GB SSD",
          maxPlayers: 999999,
          features: ["DDoS Protection", "Automatic Backups", "24/7 Support", "Custom Control Panel", "Plugin Manager", "FTP Access", "Database Access", "Priority Support"],
          isPopular: false
        }
      ];

      for (const plan of samplePlans) {
        await storage.createPricingPlan(plan);
      }
      console.log("Created sample pricing plans");
    }

    // Create sample demo servers if none exist
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
          version: "1.21.4",
          gameMode: "Creative",
          platform: "Crossplay",
          isEnabled: true,
          sortOrder: 1
        },
        {
          serverName: "VoltServers Deathmatch",
          gameType: "cs2",
          serverIp: "cs2-demo.voltservers.com",
          serverPort: 27015,
          maxPlayers: 32,
          description: "Fast-paced deathmatch with custom maps and weapons",
          version: "2.1.9",
          gameMode: "Deathmatch", 
          platform: "PC",
          isEnabled: true,
          sortOrder: 2
        },
        {
          serverName: "VoltServers Survival",
          gameType: "rust",
          serverIp: "rust-demo.voltservers.com",
          serverPort: 28015,
          maxPlayers: 200,
          description: "Classic Rust survival experience on a fresh-wiped server",
          version: "2024.12.10",
          gameMode: "Vanilla",
          platform: "PC", 
          isEnabled: true,
          sortOrder: 3
        }
      ];

      for (const server of sampleDemoServers) {
        await storage.createDemoServer(server);
      }
      console.log("Created sample demo servers");
    }

    // Create sample server status data if none exist
    const existingServerStatus = await storage.getAllServerStatus();
    if (existingServerStatus.length === 0) {
      const sampleServerStatus = [
        {
          service: "Web Panel",
          status: "operational",
          responseTime: 156,
          uptime: "99.98"
        },
        {
          service: "Game Servers",
          status: "operational", 
          responseTime: 23,
          uptime: "99.94"
        },
        {
          service: "Database",
          status: "operational",
          responseTime: 12,
          uptime: "99.99"
        },
        {
          service: "File Manager",
          status: "operational",
          responseTime: 89,
          uptime: "99.96"
        },
        {
          service: "Support System",
          status: "operational",
          responseTime: 203,
          uptime: "99.92"
        }
      ];

      for (const status of sampleServerStatus) {
        await storage.createServerStatus(status);
      }
      console.log("Created sample server status data");
    }

    console.log("Database initialization complete");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}