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
  type InsertPricingDetail,
  type AdminSession,
  type InsertAdminSession,
  type SiteSetting,
  type InsertSiteSetting,
  type PromoSetting,
  type InsertPromoSetting,
  type MinecraftServer,
  type InsertMinecraftServer,
  type MinecraftPlugin,
  type InsertMinecraftPlugin,
  type MinecraftWorld,
  type InsertMinecraftWorld,
  type MinecraftPlayer,
  type InsertMinecraftPlayer,
  type MinecraftBackup,
  type InsertMinecraftBackup,
  type MinecraftLog,
  type InsertMinecraftLog,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { DatabaseStorage } from "./database-storage";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Admin session methods
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  getAdminSession(token: string): Promise<AdminSession | undefined>;
  deleteAdminSession(token: string): Promise<void>;
  cleanExpiredSessions(): Promise<void>;
  
  // Site settings methods
  getAllSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  setSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting>;
  
  // Promo settings methods
  getPromoSettings(): Promise<PromoSetting | undefined>;
  updatePromoSettings(settings: InsertPromoSetting): Promise<PromoSetting>;

  // Game page customization methods
  getGamePageCustomization(gameId: string): Promise<any>;
  updateGamePageCustomization(gameId: string, data: any): Promise<any>;
  
  // Game methods
  getAllGames(): Promise<Game[]>;
  getGame(id: string): Promise<Game | undefined>;
  getGameBySlug(slug: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, updates: Partial<InsertGame>): Promise<Game>;
  deleteGame(id: string): Promise<void>;
  
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
  updateServerLocation(id: string, updateData: Partial<ServerLocation>): Promise<ServerLocation | undefined>;
  deleteServerLocation(id: string): Promise<void>;
  
  // Minecraft tools methods
  getAllMinecraftTools(): Promise<MinecraftTool[]>;
  getMinecraftTool(id: string): Promise<MinecraftTool | undefined>;
  createMinecraftTool(tool: InsertMinecraftTool): Promise<MinecraftTool>;
  
  // Blog posts methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;
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
  
  // Minecraft server management methods
  getAllMinecraftServers(): Promise<MinecraftServer[]>;
  getMinecraftServer(id: string): Promise<MinecraftServer | undefined>;
  getUserMinecraftServers(userId: string): Promise<MinecraftServer[]>;
  createMinecraftServer(server: InsertMinecraftServer): Promise<MinecraftServer>;
  updateMinecraftServer(id: string, updates: Partial<MinecraftServer>): Promise<MinecraftServer>;
  deleteMinecraftServer(id: string): Promise<void>;
  
  // Minecraft plugin methods
  getMinecraftPlugins(serverId: string): Promise<MinecraftPlugin[]>;
  createMinecraftPlugin(plugin: InsertMinecraftPlugin): Promise<MinecraftPlugin>;
  updateMinecraftPlugin(id: string, updates: Partial<MinecraftPlugin>): Promise<MinecraftPlugin>;
  deleteMinecraftPlugin(id: string): Promise<void>;
  
  // Minecraft world methods
  getMinecraftWorlds(serverId: string): Promise<MinecraftWorld[]>;
  createMinecraftWorld(world: InsertMinecraftWorld): Promise<MinecraftWorld>;
  updateMinecraftWorld(id: string, updates: Partial<MinecraftWorld>): Promise<MinecraftWorld>;
  deleteMinecraftWorld(id: string): Promise<void>;
  
  // Minecraft player methods
  getMinecraftPlayers(serverId: string): Promise<MinecraftPlayer[]>;
  createMinecraftPlayer(player: InsertMinecraftPlayer): Promise<MinecraftPlayer>;
  updateMinecraftPlayer(id: string, updates: Partial<MinecraftPlayer>): Promise<MinecraftPlayer>;
  deleteMinecraftPlayer(id: string): Promise<void>;
  
  // Minecraft backup methods
  getMinecraftBackups(serverId: string): Promise<MinecraftBackup[]>;
  createMinecraftBackup(backup: InsertMinecraftBackup): Promise<MinecraftBackup>;
  deleteMinecraftBackup(id: string): Promise<void>;
  
  // Minecraft log methods
  getMinecraftLogs(serverId: string, limit?: number): Promise<MinecraftLog[]>;
  createMinecraftLog(log: InsertMinecraftLog): Promise<MinecraftLog>;
  deleteOldMinecraftLogs(serverId: string, olderThanDays: number): Promise<void>;
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
  
  // Minecraft management storage
  private minecraftServers: Map<string, MinecraftServer>;
  private minecraftPlugins: Map<string, MinecraftPlugin>;
  private minecraftWorlds: Map<string, MinecraftWorld>;
  private minecraftPlayers: Map<string, MinecraftPlayer>;
  private minecraftBackups: Map<string, MinecraftBackup>;
  private minecraftLogs: Map<string, MinecraftLog>;

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
    
    // Initialize Minecraft management maps
    this.minecraftServers = new Map();
    this.minecraftPlugins = new Map();
    this.minecraftWorlds = new Map();
    this.minecraftPlayers = new Map();
    this.minecraftBackups = new Map();
    this.minecraftLogs = new Map();
    
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

    // Initialize server locations with proper ping data
    const sampleServerLocations: ServerLocation[] = [
      {
        id: randomUUID(),
        city: "Virginia Beach",
        country: "United States", 
        region: "Virginia",
        provider: "VINTHILL",
        ipAddress: "135.148.137.158",
        status: "online",
        ping: 15
      },
      {
        id: randomUUID(),
        city: "Los Angeles",
        country: "United States",
        region: "California", 
        provider: "DataPacket",
        ipAddress: "8.8.8.8",
        status: "online",
        ping: 25
      },
      {
        id: randomUUID(),
        city: "Frankfurt",
        country: "Germany",
        region: "Hesse",
        provider: "Hetzner",
        ipAddress: "1.1.1.1",
        status: "online",
        ping: 35
      }
    ];

    sampleServerLocations.forEach(location => this.serverLocations.set(location.id, location));

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

    // Initialize demo servers with real Minecraft servers
    const gameIds = Array.from(this.games.keys());
    const sampleDemoServers: DemoServer[] = [
      {
        id: randomUUID(),
        gameId: gameIds[0], // Minecraft
        serverName: "Hypixel Demo Server",
        serverIp: "mc.hypixel.net",
        serverPort: 25565,
        maxPlayers: 200000,
        description: "Experience the most popular Minecraft server with mini-games, SkyBlock, and more!",
        isActive: true,
        playtime: 30
      },
      {
        id: randomUUID(),
        gameId: gameIds[0], // Minecraft
        serverName: "Mineplex Demo Server", 
        serverIp: "us.mineplex.com",
        serverPort: 25565,
        maxPlayers: 4000,
        description: "Join one of the largest Minecraft networks with countless game modes and activities!",
        isActive: true,
        playtime: 30
      }
    ];

    sampleDemoServers.forEach(server => this.demoServers.set(server.id, server));

    // Initialize minecraft tools
    const sampleTools: MinecraftTool[] = [
      {
        id: randomUUID(),
        name: "Server Query Tool",
        description: "Check any Minecraft server's status, player count, version, and MOTD. Perfect for monitoring server health and performance.",
        category: "Server Management",
        url: "https://mcsrvstat.us/",
        features: [
          "Real-time server status checking",
          "Player count and max slots",
          "Server version detection",
          "MOTD and ping information",
          "Historical data tracking"
        ],
        isPremium: false
      },
      {
        id: randomUUID(),
        name: "Skin Viewer & Editor",
        description: "View, download, and edit Minecraft player skins. Supports both Steve and Alex models with 3D preview.",
        category: "Player Tools",
        url: "https://namemc.com/",
        features: [
          "3D skin preview",
          "High-resolution downloads",
          "Skin history tracking",
          "Custom skin upload",
          "Cape support"
        ],
        isPremium: false
      },
      {
        id: randomUUID(),
        name: "UUID Converter",
        description: "Convert between Minecraft usernames and UUIDs. Essential for server administration and player management.",
        category: "Utilities",
        url: "https://mcuuid.net/",
        features: [
          "Username to UUID conversion",
          "UUID to username lookup",
          "Bulk conversion support",
          "API integration",
          "Historical username data"
        ],
        isPremium: false
      },
      {
        id: randomUUID(),
        name: "Color Code Generator",
        description: "Generate Minecraft color codes for chat messages, signs, and books. Supports all formatting codes and hex colors.",
        category: "Design",
        url: "https://www.digminecraft.com/generators/color_text.php",
        features: [
          "All color codes supported",
          "Formatting codes (bold, italic)",
          "Hex color support (1.16+)",
          "Live preview",
          "Copy to clipboard"
        ],
        isPremium: false
      },
      {
        id: randomUUID(),
        name: "NBT Editor",
        description: "Advanced NBT data editor for items, entities, and world data. Professional tool for server administrators.",
        category: "Server Management",
        url: "https://www.nbteditor.com/",
        features: [
          "Full NBT editing capabilities",
          "Item modifier",
          "Entity data editing",
          "World data manipulation",
          "JSON export/import"
        ],
        isPremium: true
      },
      {
        id: randomUUID(),
        name: "Banner Designer",
        description: "Design custom Minecraft banners with our visual editor. Create unique banners for your server builds.",
        category: "Design",
        url: "https://www.needcoolshoes.com/banner",
        features: [
          "Visual banner editor",
          "Pattern library",
          "Color combinations",
          "Give command generator",
          "Banner gallery"
        ],
        isPremium: false
      }
    ];

    sampleTools.forEach(tool => this.minecraftTools.set(tool.id, tool));
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

  async deleteServerLocation(id: string): Promise<void> {
    this.serverLocations.delete(id);
  }

  async updateServerLocation(id: string, updateData: Partial<ServerLocation>): Promise<ServerLocation | undefined> {
    const existing = this.serverLocations.get(id);
    if (existing) {
      const updated = { ...existing, ...updateData };
      this.serverLocations.set(id, updated);
      return updated;
    }
    return undefined;
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

  // Minecraft server management methods
  async getAllMinecraftServers(): Promise<MinecraftServer[]> {
    return Array.from(this.minecraftServers.values());
  }

  async getMinecraftServer(id: string): Promise<MinecraftServer | undefined> {
    return this.minecraftServers.get(id);
  }

  async getUserMinecraftServers(userId: string): Promise<MinecraftServer[]> {
    return Array.from(this.minecraftServers.values()).filter(server => server.userId === userId);
  }

  async createMinecraftServer(insertServer: InsertMinecraftServer): Promise<MinecraftServer> {
    const id = randomUUID();
    const server: MinecraftServer = { 
      ...insertServer, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.minecraftServers.set(id, server);
    return server;
  }

  async updateMinecraftServer(id: string, updates: Partial<MinecraftServer>): Promise<MinecraftServer> {
    const existing = this.minecraftServers.get(id);
    if (!existing) {
      throw new Error(`Minecraft server with id ${id} not found`);
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.minecraftServers.set(id, updated);
    return updated;
  }

  async deleteMinecraftServer(id: string): Promise<void> {
    this.minecraftServers.delete(id);
    // Also delete related data
    const plugins = Array.from(this.minecraftPlugins.values()).filter(p => p.serverId === id);
    plugins.forEach(p => this.minecraftPlugins.delete(p.id));
    
    const worlds = Array.from(this.minecraftWorlds.values()).filter(w => w.serverId === id);
    worlds.forEach(w => this.minecraftWorlds.delete(w.id));
    
    const players = Array.from(this.minecraftPlayers.values()).filter(p => p.serverId === id);
    players.forEach(p => this.minecraftPlayers.delete(p.id));
    
    const backups = Array.from(this.minecraftBackups.values()).filter(b => b.serverId === id);
    backups.forEach(b => this.minecraftBackups.delete(b.id));
    
    const logs = Array.from(this.minecraftLogs.values()).filter(l => l.serverId === id);
    logs.forEach(l => this.minecraftLogs.delete(l.id));
  }

  // Minecraft plugin methods
  async getMinecraftPlugins(serverId: string): Promise<MinecraftPlugin[]> {
    return Array.from(this.minecraftPlugins.values()).filter(plugin => plugin.serverId === serverId);
  }

  async createMinecraftPlugin(insertPlugin: InsertMinecraftPlugin): Promise<MinecraftPlugin> {
    const id = randomUUID();
    const plugin: MinecraftPlugin = { 
      ...insertPlugin, 
      id,
      installedAt: new Date(),
    };
    this.minecraftPlugins.set(id, plugin);
    return plugin;
  }

  async updateMinecraftPlugin(id: string, updates: Partial<MinecraftPlugin>): Promise<MinecraftPlugin> {
    const existing = this.minecraftPlugins.get(id);
    if (!existing) {
      throw new Error(`Minecraft plugin with id ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.minecraftPlugins.set(id, updated);
    return updated;
  }

  async deleteMinecraftPlugin(id: string): Promise<void> {
    this.minecraftPlugins.delete(id);
  }

  // Minecraft world methods
  async getMinecraftWorlds(serverId: string): Promise<MinecraftWorld[]> {
    return Array.from(this.minecraftWorlds.values()).filter(world => world.serverId === serverId);
  }

  async createMinecraftWorld(insertWorld: InsertMinecraftWorld): Promise<MinecraftWorld> {
    const id = randomUUID();
    const world: MinecraftWorld = { 
      ...insertWorld, 
      id,
      createdAt: new Date(),
    };
    this.minecraftWorlds.set(id, world);
    return world;
  }

  async updateMinecraftWorld(id: string, updates: Partial<MinecraftWorld>): Promise<MinecraftWorld> {
    const existing = this.minecraftWorlds.get(id);
    if (!existing) {
      throw new Error(`Minecraft world with id ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.minecraftWorlds.set(id, updated);
    return updated;
  }

  async deleteMinecraftWorld(id: string): Promise<void> {
    this.minecraftWorlds.delete(id);
    // Also delete related backups
    const backups = Array.from(this.minecraftBackups.values()).filter(b => b.worldId === id);
    backups.forEach(b => this.minecraftBackups.delete(b.id));
  }

  // Minecraft player methods
  async getMinecraftPlayers(serverId: string): Promise<MinecraftPlayer[]> {
    return Array.from(this.minecraftPlayers.values()).filter(player => player.serverId === serverId);
  }

  async createMinecraftPlayer(insertPlayer: InsertMinecraftPlayer): Promise<MinecraftPlayer> {
    const id = randomUUID();
    const player: MinecraftPlayer = { 
      ...insertPlayer, 
      id,
      firstJoin: new Date(),
    };
    this.minecraftPlayers.set(id, player);
    return player;
  }

  async updateMinecraftPlayer(id: string, updates: Partial<MinecraftPlayer>): Promise<MinecraftPlayer> {
    const existing = this.minecraftPlayers.get(id);
    if (!existing) {
      throw new Error(`Minecraft player with id ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.minecraftPlayers.set(id, updated);
    return updated;
  }

  async deleteMinecraftPlayer(id: string): Promise<void> {
    this.minecraftPlayers.delete(id);
  }

  // Minecraft backup methods
  async getMinecraftBackups(serverId: string): Promise<MinecraftBackup[]> {
    return Array.from(this.minecraftBackups.values()).filter(backup => backup.serverId === serverId);
  }

  async createMinecraftBackup(insertBackup: InsertMinecraftBackup): Promise<MinecraftBackup> {
    const id = randomUUID();
    const backup: MinecraftBackup = { 
      ...insertBackup, 
      id,
      createdAt: new Date(),
    };
    this.minecraftBackups.set(id, backup);
    return backup;
  }

  async deleteMinecraftBackup(id: string): Promise<void> {
    this.minecraftBackups.delete(id);
  }

  // Minecraft log methods
  async getMinecraftLogs(serverId: string, limit: number = 100): Promise<MinecraftLog[]> {
    return Array.from(this.minecraftLogs.values())
      .filter(log => log.serverId === serverId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async createMinecraftLog(insertLog: InsertMinecraftLog): Promise<MinecraftLog> {
    const id = randomUUID();
    const log: MinecraftLog = { 
      ...insertLog, 
      id,
      timestamp: new Date(),
    };
    this.minecraftLogs.set(id, log);
    return log;
  }

  async deleteOldMinecraftLogs(serverId: string, olderThanDays: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const logsToDelete = Array.from(this.minecraftLogs.values())
      .filter(log => log.serverId === serverId && new Date(log.timestamp) < cutoffDate);
    
    logsToDelete.forEach(log => this.minecraftLogs.delete(log.id));
  }
}

// Use DatabaseStorage for persistence
export const storage = new DatabaseStorage();
