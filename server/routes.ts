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

  const httpServer = createServer(app);
  return httpServer;
}
