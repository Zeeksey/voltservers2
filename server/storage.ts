import { 
  type Game, 
  type InsertGame,
  type PricingPlan,
  type InsertPricingPlan,
  type ServerStatus,
  type InsertServerStatus,
  type ServerLocation,
  type InsertServerLocation,
  type MinecraftTool,
  type InsertMinecraftTool,
  type User, 
  type InsertUser,
  type BlogPost,
  type InsertBlogPost,
  type GamePage,
  type InsertGamePage,
  type DemoServer,
  type InsertDemoServer,
  type PricingDetail,
  type InsertPricingDetail
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game methods
  getAllGames(): Promise<Game[]>;
  getGame(id: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Pricing methods
  getAllPricingPlans(): Promise<PricingPlan[]>;
  getPricingPlan(id: string): Promise<PricingPlan | undefined>;
  createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan>;
  
  // Server status methods
  getAllServerStatus(): Promise<ServerStatus[]>;
  getServerStatus(id: string): Promise<ServerStatus | undefined>;
  createServerStatus(status: InsertServerStatus): Promise<ServerStatus>;
  
  // Server location methods
  getAllServerLocations(): Promise<ServerLocation[]>;
  getServerLocation(id: string): Promise<ServerLocation | undefined>;
  createServerLocation(location: InsertServerLocation): Promise<ServerLocation>;
  
  // Minecraft tools methods
  getAllMinecraftTools(): Promise<MinecraftTool[]>;
  getMinecraftTool(id: string): Promise<MinecraftTool | undefined>;
  createMinecraftTool(tool: InsertMinecraftTool): Promise<MinecraftTool>;
  
  // Blog posts methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  
  // Game pages methods
  getAllGamePages(): Promise<GamePage[]>;
  getGamePage(id: string): Promise<GamePage | undefined>;
  getGamePageByGameId(gameId: string): Promise<GamePage | undefined>;
  createGamePage(page: InsertGamePage): Promise<GamePage>;
  
  // Demo servers methods
  getAllDemoServers(): Promise<DemoServer[]>;
  getDemoServer(id: string): Promise<DemoServer | undefined>;
  getDemoServersByGameId(gameId: string): Promise<DemoServer[]>;
  createDemoServer(server: InsertDemoServer): Promise<DemoServer>;
  getActiveDemoServers(): Promise<DemoServer[]>;
  
  // Pricing details methods
  getAllPricingDetails(): Promise<PricingDetail[]>;
  getPricingDetail(id: string): Promise<PricingDetail | undefined>;
  getPricingDetailsByPlanId(planId: string): Promise<PricingDetail[]>;
  getPricingDetailsByGameId(gameId: string): Promise<PricingDetail[]>;
  createPricingDetail(detail: InsertPricingDetail): Promise<PricingDetail>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private games: Map<string, Game>;
  private pricingPlans: Map<string, PricingPlan>;
  private serverStatus: Map<string, ServerStatus>;
  private serverLocations: Map<string, ServerLocation>;
  private minecraftTools: Map<string, MinecraftTool>;
  private blogPosts: Map<string, BlogPost>;
  private gamePages: Map<string, GamePage>;
  private demoServers: Map<string, DemoServer>;
  private pricingDetails: Map<string, PricingDetail>;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.pricingPlans = new Map();
    this.serverStatus = new Map();
    this.serverLocations = new Map();
    this.minecraftTools = new Map();
    this.blogPosts = new Map();
    this.gamePages = new Map();
    this.demoServers = new Map();
    this.pricingDetails = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample games
    const sampleGames: Game[] = [
      {
        id: randomUUID(),
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
        id: randomUUID(),
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
        id: randomUUID(),
        name: "Rust",
        slug: "rust",
        description: "Survival servers with oxide plugins and custom maps",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        basePrice: "6.99",
        playerCount: 892,
        isPopular: false,
        isNew: false,
        isTrending: false
      },
      {
        id: randomUUID(),
        name: "ARK: Survival",
        slug: "ark",
        description: "Dinosaur survival with clusters and mod support",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        basePrice: "8.99",
        playerCount: 445,
        isPopular: false,
        isNew: true,
        isTrending: false
      },
      {
        id: randomUUID(),
        name: "Valheim",
        slug: "valheim",
        description: "Viking survival servers with dedicated worlds",
        imageUrl: "https://pixabay.com/get/g33c7bac813749618f16afdca5ee0feed251e74f4603a0fa395097d3bd61a82d70e151d59a5c90442f5cbea5228a4406bbed95fcbcb903ccd663509f00d72e42c_1280.jpg",
        basePrice: "5.99",
        playerCount: 678,
        isPopular: false,
        isNew: false,
        isTrending: false
      },
      {
        id: randomUUID(),
        name: "7 Days to Die",
        slug: "7dtd",
        description: "Zombie survival with custom mods and maps",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        basePrice: "7.99",
        playerCount: 223,
        isPopular: false,
        isNew: false,
        isTrending: false
      },
      {
        id: randomUUID(),
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

    sampleGames.forEach(game => this.games.set(game.id, game));

    // Initialize pricing plans
    const samplePlans: PricingPlan[] = [
      {
        id: randomUUID(),
        name: "Starter",
        price: "2.99",
        maxPlayers: 10,
        ram: "2GB RAM",
        storage: "20GB SSD Storage",
        features: ["DDoS Protection", "Basic Support"],
        isPopular: false
      },
      {
        id: randomUUID(),
        name: "Pro",
        price: "7.99",
        maxPlayers: 50,
        ram: "6GB RAM",
        storage: "100GB SSD Storage",
        features: ["Advanced DDoS Protection", "Priority Support", "Mod Support", "Daily Backups"],
        isPopular: true
      },
      {
        id: randomUUID(),
        name: "Enterprise",
        price: "19.99",
        maxPlayers: 999999,
        ram: "16GB RAM",
        storage: "500GB SSD Storage",
        features: ["Enterprise DDoS Protection", "24/7 Dedicated Support", "Custom Plugins", "Hourly Backups", "Multi-Server Management"],
        isPopular: false
      }
    ];

    samplePlans.forEach(plan => this.pricingPlans.set(plan.id, plan));

    // Initialize server status
    const sampleStatus: ServerStatus[] = [
      {
        id: randomUUID(),
        service: "Game Servers",
        status: "operational",
        responseTime: 12,
        uptime: "99.97",
        lastUpdated: new Date()
      },
      {
        id: randomUUID(),
        service: "Control Panel",
        status: "operational",
        responseTime: 15,
        uptime: "99.95",
        lastUpdated: new Date()
      },
      {
        id: randomUUID(),
        service: "API Services",
        status: "operational",
        responseTime: 8,
        uptime: "99.99",
        lastUpdated: new Date()
      },
      {
        id: randomUUID(),
        service: "Billing System",
        status: "operational",
        responseTime: 20,
        uptime: "99.98",
        lastUpdated: new Date()
      }
    ];

    sampleStatus.forEach(status => this.serverStatus.set(status.id, status));

    // Initialize server locations
    const sampleLocations: ServerLocation[] = [
      {
        id: randomUUID(),
        name: "US East, US West",
        region: "North America",
        status: "online",
        icon: "fas fa-globe-americas"
      },
      {
        id: randomUUID(),
        name: "London, Frankfurt",
        region: "Europe",
        status: "online",
        icon: "fas fa-globe-europe"
      },
      {
        id: randomUUID(),
        name: "Singapore, Tokyo",
        region: "Asia Pacific",
        status: "online",
        icon: "fas fa-globe-asia"
      },
      {
        id: randomUUID(),
        name: "Sydney, Melbourne",
        region: "Australia",
        status: "online",
        icon: "fas fa-globe"
      }
    ];

    sampleLocations.forEach(location => this.serverLocations.set(location.id, location));

    // Initialize blog posts
    const samplePosts: BlogPost[] = [
      {
        id: randomUUID(),
        title: "How to Optimize Your Minecraft Server for Better Performance",
        slug: "optimize-minecraft-server-performance",
        excerpt: "Learn essential tips and tricks to boost your Minecraft server performance and reduce lag for your players.",
        content: "# Server Optimization Guide\n\nRunning a smooth Minecraft server requires careful configuration and regular maintenance. Here are the key steps to optimize your server...",
        imageUrl: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        author: "GameHost Pro Team",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        tags: ["minecraft", "optimization", "performance"],
        isPublished: true
      },
      {
        id: randomUUID(),
        title: "Best Rust Server Plugins for 2025",
        slug: "best-rust-server-plugins-2025",
        excerpt: "Discover the top Rust server plugins that will enhance gameplay and keep your community engaged.",
        content: "# Top Rust Plugins\n\nRust servers can be greatly enhanced with the right plugins. Here are our top recommendations...",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        author: "Sarah Johnson",
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        tags: ["rust", "plugins", "mods"],
        isPublished: true
      }
    ];

    samplePosts.forEach(post => this.blogPosts.set(post.id, post));

    // Initialize demo servers
    const gameIds = Array.from(this.games.keys());
    const sampleDemoServers: DemoServer[] = [
      {
        id: randomUUID(),
        gameId: gameIds[0], // Minecraft
        serverName: "GameHost Pro Minecraft Demo",
        serverIp: "demo-mc.gamehostpro.com",
        serverPort: 25565,
        maxPlayers: 20,
        description: "Try our Minecraft hosting with this demo server. Explore our optimized world and test our performance!",
        isActive: true,
        playtime: 30
      },
      {
        id: randomUUID(),
        gameId: gameIds[1], // CS2
        serverName: "GameHost Pro CS2 Demo",
        serverIp: "demo-cs2.gamehostpro.com",
        serverPort: 27015,
        maxPlayers: 16,
        description: "Experience Counter-Strike 2 on our high-performance servers. Try different maps and game modes!",
        isActive: true,
        playtime: 15
      }
    ];

    sampleDemoServers.forEach(server => this.demoServers.set(server.id, server));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Game methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = { 
      ...insertGame, 
      id,
      playerCount: insertGame.playerCount ?? 0,
      isPopular: insertGame.isPopular ?? false,
      isNew: insertGame.isNew ?? false,
      isTrending: insertGame.isTrending ?? false
    };
    this.games.set(id, game);
    return game;
  }

  // Pricing methods
  async getAllPricingPlans(): Promise<PricingPlan[]> {
    return Array.from(this.pricingPlans.values());
  }

  async getPricingPlan(id: string): Promise<PricingPlan | undefined> {
    return this.pricingPlans.get(id);
  }

  async createPricingPlan(insertPlan: InsertPricingPlan): Promise<PricingPlan> {
    const id = randomUUID();
    const plan: PricingPlan = { 
      ...insertPlan, 
      id,
      isPopular: insertPlan.isPopular ?? false,
      maxPlayers: insertPlan.maxPlayers ?? null
    };
    this.pricingPlans.set(id, plan);
    return plan;
  }

  // Server status methods
  async getAllServerStatus(): Promise<ServerStatus[]> {
    return Array.from(this.serverStatus.values());
  }

  async getServerStatus(id: string): Promise<ServerStatus | undefined> {
    return this.serverStatus.get(id);
  }

  async createServerStatus(insertStatus: InsertServerStatus): Promise<ServerStatus> {
    const id = randomUUID();
    const status: ServerStatus = { 
      ...insertStatus, 
      id, 
      lastUpdated: new Date(),
      responseTime: insertStatus.responseTime ?? null,
      uptime: insertStatus.uptime ?? null
    };
    this.serverStatus.set(id, status);
    return status;
  }

  // Server location methods
  async getAllServerLocations(): Promise<ServerLocation[]> {
    return Array.from(this.serverLocations.values());
  }

  async getServerLocation(id: string): Promise<ServerLocation | undefined> {
    return this.serverLocations.get(id);
  }

  async createServerLocation(insertLocation: InsertServerLocation): Promise<ServerLocation> {
    const id = randomUUID();
    const location: ServerLocation = { ...insertLocation, id };
    this.serverLocations.set(id, location);
    return location;
  }

  // Minecraft tools methods
  async getAllMinecraftTools(): Promise<MinecraftTool[]> {
    return Array.from(this.minecraftTools.values());
  }

  async getMinecraftTool(id: string): Promise<MinecraftTool | undefined> {
    return this.minecraftTools.get(id);
  }

  async createMinecraftTool(insertTool: InsertMinecraftTool): Promise<MinecraftTool> {
    const id = randomUUID();
    const tool: MinecraftTool = { ...insertTool, id };
    this.minecraftTools.set(id, tool);
    return tool;
  }

  // Blog posts methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = { 
      ...insertPost, 
      id, 
      publishedAt: new Date(),
      isPublished: insertPost.isPublished ?? true
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(post => post.isPublished);
  }

  // Game pages methods
  async getAllGamePages(): Promise<GamePage[]> {
    return Array.from(this.gamePages.values());
  }

  async getGamePage(id: string): Promise<GamePage | undefined> {
    return this.gamePages.get(id);
  }

  async getGamePageByGameId(gameId: string): Promise<GamePage | undefined> {
    return Array.from(this.gamePages.values()).find(page => page.gameId === gameId);
  }

  async createGamePage(insertPage: InsertGamePage): Promise<GamePage> {
    const id = randomUUID();
    const page: GamePage = { ...insertPage, id };
    this.gamePages.set(id, page);
    return page;
  }

  // Demo servers methods
  async getAllDemoServers(): Promise<DemoServer[]> {
    return Array.from(this.demoServers.values());
  }

  async getDemoServer(id: string): Promise<DemoServer | undefined> {
    return this.demoServers.get(id);
  }

  async getDemoServersByGameId(gameId: string): Promise<DemoServer[]> {
    return Array.from(this.demoServers.values()).filter(server => server.gameId === gameId);
  }

  async createDemoServer(insertServer: InsertDemoServer): Promise<DemoServer> {
    const id = randomUUID();
    const server: DemoServer = { 
      ...insertServer, 
      id,
      isActive: insertServer.isActive ?? true,
      playtime: insertServer.playtime ?? 0
    };
    this.demoServers.set(id, server);
    return server;
  }

  async getActiveDemoServers(): Promise<DemoServer[]> {
    return Array.from(this.demoServers.values()).filter(server => server.isActive);
  }

  // Pricing details methods
  async getAllPricingDetails(): Promise<PricingDetail[]> {
    return Array.from(this.pricingDetails.values());
  }

  async getPricingDetail(id: string): Promise<PricingDetail | undefined> {
    return this.pricingDetails.get(id);
  }

  async getPricingDetailsByPlanId(planId: string): Promise<PricingDetail[]> {
    return Array.from(this.pricingDetails.values()).filter(detail => detail.planId === planId);
  }

  async getPricingDetailsByGameId(gameId: string): Promise<PricingDetail[]> {
    return Array.from(this.pricingDetails.values()).filter(detail => detail.gameId === gameId);
  }

  async createPricingDetail(insertDetail: InsertPricingDetail): Promise<PricingDetail> {
    const id = randomUUID();
    const detail: PricingDetail = { 
      ...insertDetail, 
      id,
      customPrice: insertDetail.customPrice ?? null
    };
    this.pricingDetails.set(id, detail);
    return detail;
  }
}

export const storage = new MemStorage();
