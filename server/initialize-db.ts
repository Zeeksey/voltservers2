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

    console.log("Database initialization complete");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}