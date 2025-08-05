import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initializeDatabase } from "./initialize-db";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with default data
  await initializeDatabase();
  // Games endpoints
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
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
      res.status(500).json({ message: "Failed to fetch game" });
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
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  // Pricing plans endpoints
  app.get("/api/pricing-plans", async (req, res) => {
    try {
      const plans = await storage.getAllPricingPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pricing plans" });
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
      console.error("Error fetching server locations:", error);
      res.status(500).json({ message: "Failed to fetch server locations" });
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
      res.status(500).json({ message: "Failed to fetch blog posts" });
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
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Related articles for game pages
  app.get("/api/blog/related/:gameSlug", async (req, res) => {
    try {
      const gameSlug = req.params.gameSlug;
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
      res.status(500).json({ error: "Failed to fetch related articles" });
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
      res.status(500).json({ message: "Failed to fetch demo servers" });
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

  // Server query endpoint
  app.get("/api/query-server/:serverIp/:port?", async (req, res) => {
    try {
      const { serverIp } = req.params;
      const port = req.params.port || "25565";
      
      // Use mcsrvstat.us API to get real server data
      const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}:${port}`);
      const data = await response.json();
      
      if (!data.online) {
        return res.status(404).json({ 
          message: "Server is offline or not found",
          online: false 
        });
      }
      
      res.json({
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
        software: data.software || "Unknown"
      });
    } catch (error) {
      console.error("Server query error:", error);
      res.status(500).json({ message: "Failed to query server" });
    }
  });

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
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
    } catch (error) {
      console.error("Admin auth error:", error);
      res.status(401).json({ message: "Authentication failed" });
    }
  };

  // Admin CRUD Routes for Games
  app.post("/api/admin/games", requireAdmin, async (req, res) => {
    try {
      const game = await storage.createGame(req.body);
      res.json(game);
    } catch (error) {
      console.error("Create game error:", error);
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  app.put("/api/admin/games/:id", requireAdmin, async (req, res) => {
    try {
      const game = await storage.updateGame(req.params.id, req.body);
      res.json(game);
    } catch (error) {
      console.error("Update game error:", error);
      res.status(500).json({ message: "Failed to update game" });
    }
  });

  app.delete("/api/admin/games/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteGame(req.params.id);
      res.json({ message: "Game deleted successfully" });
    } catch (error) {
      console.error("Delete game error:", error); 
      res.status(500).json({ message: "Failed to delete game" });
    }
  });

  // Admin CRUD Routes for Blog Posts
  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const post = await storage.createBlogPost(req.body);
      res.json(post);
    } catch (error) {
      console.error("Create blog post error:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      console.error("Update blog post error:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Delete blog post error:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Admin Promo Settings Routes
  app.get("/api/admin/promo-settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getPromoSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get promo settings error:", error);
      res.status(500).json({ message: "Failed to get promo settings" });
    }
  });

  app.put("/api/admin/promo-settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.updatePromoSettings(req.body);
      res.json(settings);
    } catch (error) {
      console.error("Update promo settings error:", error);
      res.status(500).json({ message: "Failed to update promo settings" });
    }
  });

  // Public endpoint to get current promo settings
  app.get("/api/promo-settings", async (req, res) => {
    try {
      const settings = await storage.getPromoSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get public promo settings error:", error);
      res.status(500).json({ message: "Failed to get promo settings" });
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

  const httpServer = createServer(app);
  return httpServer;
}
