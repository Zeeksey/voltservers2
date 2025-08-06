import { db } from "./db";
import { eq, and, desc, asc, gte, lte, like, count } from "drizzle-orm";
import {
  users,
  games,
  pricingPlans,
  serverStatus,
  serverLocations,
  minecraftTools,
  blogPosts,
  gamePages,
  demoServers,
  pricingDetails,
  adminSessions,
  siteSettings,
  promoSettings,
  type User,
  type InsertUser,
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
  gamePageSections,
  gamePricingTiers,
  gameFeatures,
  type GamePageSection,
  type InsertGamePageSection,
  type GamePricingTier,
  type InsertGamePricingTier,
  type GameFeature,
  type InsertGameFeature
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Demo server methods
  async getAllDemoServers(): Promise<DemoServer[]> {
    return await db.select().from(demoServers).orderBy(demoServers.sortOrder);
  }

  async getDemoServer(id: string): Promise<DemoServer | undefined> {
    const [server] = await db.select().from(demoServers).where(eq(demoServers.id, id));
    return server;
  }

  async createDemoServer(server: InsertDemoServer): Promise<DemoServer> {
    const [newServer] = await db.insert(demoServers).values(server).returning();
    return newServer;
  }

  async updateDemoServer(id: string, updates: Partial<DemoServer>): Promise<DemoServer> {
    const [updatedServer] = await db
      .update(demoServers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(demoServers.id, id))
      .returning();
    return updatedServer;
  }

  async deleteDemoServer(id: string): Promise<void> {
    await db.delete(demoServers).where(eq(demoServers.id, id));
  }

  // Admin session methods
  async createAdminSession(session: InsertAdminSession): Promise<AdminSession> {
    const [newSession] = await db.insert(adminSessions).values(session).returning();
    return newSession;
  }

  async getAdminSession(token: string): Promise<AdminSession | undefined> {
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.token, token))
      .limit(1);
    return session;
  }

  async deleteAdminSession(token: string): Promise<void> {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }

  async cleanExpiredSessions(): Promise<void> {
    const now = new Date();
    await db.delete(adminSessions).where(
      eq(adminSessions.expiresAt, now)
    );
  }

  // Site settings methods
  async getAllSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async setSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [newSetting] = await db
      .insert(siteSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: setting.value, updatedAt: new Date() }
      })
      .returning();
    return newSetting;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting> {
    const [updatedSetting] = await db
      .update(siteSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteSettings.key, key))
      .returning();
    return updatedSetting;
  }

  // Theme settings methods
  async getThemeSettings(): Promise<any> {
    const settings = await db.select().from(siteSettings).where(eq(siteSettings.key, 'theme'));
    if (settings.length === 0) {
      // Return default theme settings
      return {
        primaryColor: "#22c55e",
        backgroundColor: "#0a0a0a",
        accentColor: "#34d399",
        textColor: "#ffffff",
        cardColor: "#1a1a1a"
      };
    }
    try {
      return JSON.parse(settings[0].value);
    } catch {
      // Return default if JSON parse fails
      return {
        primaryColor: "#22c55e",
        backgroundColor: "#0a0a0a", 
        accentColor: "#34d399",
        textColor: "#ffffff",
        cardColor: "#1a1a1a"
      };
    }
  }

  async updateThemeSettings(themeSettings: any): Promise<any> {
    const settingValue = JSON.stringify(themeSettings);
    await this.setSiteSetting({
      key: 'theme',
      value: settingValue,
      updatedAt: new Date()
    });
    return themeSettings;
  }

  // Promo settings methods
  async getPromoSettings(): Promise<PromoSetting | undefined> {
    const [settings] = await db.select().from(promoSettings).limit(1);
    return settings;
  }

  async updatePromoSettings(settings: InsertPromoSetting): Promise<PromoSetting> {
    // Delete existing settings and insert new ones
    await db.delete(promoSettings);
    const [newSettings] = await db.insert(promoSettings).values(settings).returning();
    return newSettings;
  }

  // Game methods
  async getAllGames(): Promise<Game[]> {
    return await db.select().from(games);
  }

  async getGame(id: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async getGameBySlug(slug: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.slug, slug));
    return game;
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }

  async updateGame(id: string, updates: Partial<InsertGame>): Promise<Game> {
    const [updatedGame] = await db
      .update(games)
      .set(updates)
      .where(eq(games.id, id))
      .returning();
    return updatedGame;
  }

  async deleteGame(id: string): Promise<void> {
    await db.delete(games).where(eq(games.id, id));
  }

  // Pricing methods
  async getAllPricingPlans(): Promise<PricingPlan[]> {
    return await db.select().from(pricingPlans);
  }

  async getPricingPlan(id: string): Promise<PricingPlan | undefined> {
    const [plan] = await db.select().from(pricingPlans).where(eq(pricingPlans.id, id));
    return plan;
  }

  async createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan> {
    const [newPlan] = await db.insert(pricingPlans).values(plan).returning();
    return newPlan;
  }

  // Server status methods
  async getAllServerStatus(): Promise<ServerStatus[]> {
    return await db.select().from(serverStatus);
  }

  async getServerStatus(id: string): Promise<ServerStatus | undefined> {
    const [status] = await db.select().from(serverStatus).where(eq(serverStatus.id, id));
    return status;
  }

  async createServerStatus(status: InsertServerStatus): Promise<ServerStatus> {
    const [newStatus] = await db.insert(serverStatus).values(status).returning();
    return newStatus;
  }

  // Server location methods
  async getAllServerLocations(): Promise<ServerLocation[]> {
    return await db.select().from(serverLocations);
  }

  async getServerLocation(id: string): Promise<ServerLocation | undefined> {
    const [location] = await db.select().from(serverLocations).where(eq(serverLocations.id, id));
    return location;
  }

  async createServerLocation(location: InsertServerLocation): Promise<ServerLocation> {
    const [newLocation] = await db.insert(serverLocations).values(location).returning();
    return newLocation;
  }

  async updateServerLocation(id: string, updates: Partial<ServerLocation>): Promise<ServerLocation> {
    const [updatedLocation] = await db
      .update(serverLocations)
      .set(updates)
      .where(eq(serverLocations.id, id))
      .returning();
    return updatedLocation;
  }

  async deleteServerLocation(id: string): Promise<void> {
    await db.delete(serverLocations).where(eq(serverLocations.id, id));
  }

  // Minecraft tools methods
  async getAllMinecraftTools(): Promise<MinecraftTool[]> {
    return await db.select().from(minecraftTools);
  }

  async getMinecraftTool(id: string): Promise<MinecraftTool | undefined> {
    const [tool] = await db.select().from(minecraftTools).where(eq(minecraftTools.id, id));
    return tool;
  }

  async createMinecraftTool(tool: InsertMinecraftTool): Promise<MinecraftTool> {
    const [newTool] = await db.insert(minecraftTools).values(tool).returning();
    return newTool;
  }

  // Blog posts methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true));
  }

  // Game pages methods
  async getAllGamePages(): Promise<GamePage[]> {
    return await db.select().from(gamePages);
  }

  async getGamePage(id: string): Promise<GamePage | undefined> {
    const [page] = await db.select().from(gamePages).where(eq(gamePages.id, id));
    return page;
  }

  async getGamePageByGameId(gameId: string): Promise<GamePage | undefined> {
    const [page] = await db.select().from(gamePages).where(eq(gamePages.gameId, gameId));
    return page;
  }

  async createGamePage(page: InsertGamePage): Promise<GamePage> {
    const [newPage] = await db.insert(gamePages).values(page).returning();
    return newPage;
  }

  // Demo servers methods
  async getAllDemoServers(): Promise<DemoServer[]> {
    return await db
      .select()
      .from(demoServers)
      .where(eq(demoServers.isEnabled, true))
      .orderBy(demoServers.sortOrder);
  }

  async getDemoServer(id: string): Promise<DemoServer | undefined> {
    const [server] = await db.select().from(demoServers).where(eq(demoServers.id, id));
    return server;
  }

  async getDemoServersByGameId(gameId: string): Promise<DemoServer[]> {
    return await db.select().from(demoServers).where(eq(demoServers.gameId, gameId));
  }

  async createDemoServer(server: InsertDemoServer): Promise<DemoServer> {
    const [newServer] = await db.insert(demoServers).values(server).returning();
    return newServer;
  }

  async getActiveDemoServers(): Promise<DemoServer[]> {
    return await db.select().from(demoServers).where(eq(demoServers.isEnabled, true));
  }

  // Pricing details methods
  async getAllPricingDetails(): Promise<PricingDetail[]> {
    return await db.select().from(pricingDetails);
  }

  async getPricingDetail(id: string): Promise<PricingDetail | undefined> {
    const [detail] = await db.select().from(pricingDetails).where(eq(pricingDetails.id, id));
    return detail;
  }

  async getPricingDetailsByPlanId(planId: string): Promise<PricingDetail[]> {
    return await db.select().from(pricingDetails).where(eq(pricingDetails.planId, planId));
  }

  async getPricingDetailsByGameId(gameId: string): Promise<PricingDetail[]> {
    return await db.select().from(pricingDetails).where(eq(pricingDetails.gameId, gameId));
  }

  async createPricingDetail(detail: InsertPricingDetail): Promise<PricingDetail> {
    const [newDetail] = await db.insert(pricingDetails).values(detail).returning();
    return newDetail;
  }

  // Game page sections
  async getGamePageSections(gameId: string): Promise<GamePageSection[]> {
    return await db.select().from(gamePageSections).where(eq(gamePageSections.gameId, gameId));
  }

  async createGamePageSection(section: InsertGamePageSection): Promise<GamePageSection> {
    const [newSection] = await db.insert(gamePageSections).values(section).returning();
    return newSection;
  }

  async updateGamePageSection(id: string, updates: Partial<GamePageSection>): Promise<GamePageSection> {
    const [updatedSection] = await db
      .update(gamePageSections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(gamePageSections.id, id))
      .returning();
    return updatedSection;
  }

  async deleteGamePageSection(id: string): Promise<void> {
    await db.delete(gamePageSections).where(eq(gamePageSections.id, id));
  }

  // Game pricing tiers
  async getGamePricingTiers(gameId: string): Promise<GamePricingTier[]> {
    return await db.select().from(gamePricingTiers).where(eq(gamePricingTiers.gameId, gameId));
  }

  async createGamePricingTier(tier: InsertGamePricingTier): Promise<GamePricingTier> {
    const [newTier] = await db.insert(gamePricingTiers).values(tier).returning();
    return newTier;
  }

  async updateGamePricingTier(id: string, updates: Partial<GamePricingTier>): Promise<GamePricingTier> {
    const [updatedTier] = await db
      .update(gamePricingTiers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(gamePricingTiers.id, id))
      .returning();
    return updatedTier;
  }

  async deleteGamePricingTier(id: string): Promise<void> {
    await db.delete(gamePricingTiers).where(eq(gamePricingTiers.id, id));
  }

  // Game features
  async getGameFeatures(gameId: string): Promise<GameFeature[]> {
    return await db.select().from(gameFeatures).where(eq(gameFeatures.gameId, gameId));
  }

  async createGameFeature(feature: InsertGameFeature): Promise<GameFeature> {
    const [newFeature] = await db.insert(gameFeatures).values(feature).returning();
    return newFeature;
  }

  async updateGameFeature(id: string, updates: Partial<GameFeature>): Promise<GameFeature> {
    const [updatedFeature] = await db
      .update(gameFeatures)
      .set(updates)
      .where(eq(gameFeatures.id, id))
      .returning();
    return updatedFeature;
  }

  async deleteGameFeature(id: string): Promise<void> {
    await db.delete(gameFeatures).where(eq(gameFeatures.id, id));
  }

  // Pricing plan methods (implementation)
  async getPricingPlansByGameId(gameId: string): Promise<PricingPlan[]> {
    return await db.select().from(pricingPlans).where(eq(pricingPlans.gameId, gameId));
  }

  async createPricingPlan(plan: InsertPricingPlan): Promise<PricingPlan> {
    const [newPlan] = await db.insert(pricingPlans).values(plan).returning();
    return newPlan;
  }

  async updatePricingPlan(id: string, updates: Partial<PricingPlan>): Promise<PricingPlan | undefined> {
    const [updatedPlan] = await db
      .update(pricingPlans)
      .set(updates)
      .where(eq(pricingPlans.id, id))
      .returning();
    return updatedPlan;
  }

  async deletePricingPlan(id: string): Promise<void> {
    await db.delete(pricingPlans).where(eq(pricingPlans.id, id));
  }
}