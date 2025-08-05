import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Games endpoints
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
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

  const httpServer = createServer(app);
  return httpServer;
}
