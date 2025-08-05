import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const promoSettings = pgTable("promo_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  isEnabled: boolean("is_enabled").notNull().default(true),
  message: text("message").notNull(),
  linkText: text("link_text"),
  linkUrl: text("link_url"),
  backgroundColor: text("background_color").notNull().default("#22c55e"),
  textColor: text("text_color").notNull().default("#ffffff"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  playerCount: integer("player_count").notNull().default(0),
  isPopular: boolean("is_popular").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  // Game page content
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroImageUrl: text("hero_image_url"),
  features: text("features").array().default(sql`'{}'::text[]`),
  pricingPlans: jsonb("pricing_plans").default(sql`'[]'::jsonb`),

  detailedDescription: text("detailed_description"),
  systemRequirements: text("system_requirements"),
  supportInfo: text("support_info"),
});

export const pricingPlans = pgTable("pricing_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  maxPlayers: integer("max_players"),
  ram: text("ram").notNull(),
  storage: text("storage").notNull(),
  features: text("features").array().notNull(),
  isPopular: boolean("is_popular").notNull().default(false),
});

export const serverStatus = pgTable("server_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  service: text("service").notNull(),
  status: text("status").notNull(), // "operational", "degraded", "down"
  responseTime: integer("response_time"), // in milliseconds
  uptime: decimal("uptime", { precision: 5, scale: 2 }), // percentage
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const serverLocations = pgTable("server_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  city: text("city").notNull(),
  country: text("country").notNull(),
  region: text("region").notNull(),
  provider: text("provider").notNull(),
  ipAddress: text("ip_address").notNull(),
  status: text("status").notNull().default("online"),
  ping: integer("ping").default(0),
});

export const minecraftTools = pgTable("minecraft_tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolType: text("tool_type").notNull(), // "server_query", "skin_viewer", "uuid_converter", "color_generator"
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  tags: text("tags").array().notNull(),
  isPublished: boolean("is_published").notNull().default(true),
});

export const gamePages = pgTable("game_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull(),
  features: text("features").array().notNull(),
  requirements: text("requirements").array().notNull(),
  mods: text("mods").array().notNull(),
  screenshots: text("screenshots").array().notNull(),
  setupGuide: text("setup_guide").notNull(),
  faq: text("faq").array().notNull(),
  relatedArticles: text("related_articles").array().default(sql`'{}'::text[]`), // Array of blog post slugs
  customSections: jsonb("custom_sections").default(sql`'[]'::jsonb`), // Custom admin-defined sections
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const demoServers = pgTable("demo_servers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull(),
  serverName: text("server_name").notNull(),
  serverIp: text("server_ip").notNull(),
  serverPort: integer("server_port").notNull(),
  maxPlayers: integer("max_players").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  playtime: integer("playtime").notNull().default(0), // in minutes
});

export const pricingDetails = pgTable("pricing_details", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  planId: varchar("plan_id").notNull(),
  gameId: varchar("game_id").notNull(),
  customPrice: decimal("custom_price", { precision: 10, scale: 2 }),
  gameSpecificFeatures: text("game_specific_features").array().notNull(),
  limitations: text("limitations").array().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAdminSessionSchema = createInsertSchema(adminSessions).omit({
  id: true,
  createdAt: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertPromoSettingSchema = createInsertSchema(promoSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
});

export const insertPricingPlanSchema = createInsertSchema(pricingPlans).omit({
  id: true,
});

export const insertServerStatusSchema = createInsertSchema(serverStatus).omit({
  id: true,
  lastUpdated: true,
});

export const insertServerLocationSchema = createInsertSchema(serverLocations).omit({
  id: true,
});

export const insertMinecraftToolSchema = createInsertSchema(minecraftTools).omit({
  id: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
});

export const insertGamePageSchema = createInsertSchema(gamePages).omit({
  id: true,
});

export const insertDemoServerSchema = createInsertSchema(demoServers).omit({
  id: true,
});

export const insertPricingDetailSchema = createInsertSchema(pricingDetails).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

export type InsertPromoSetting = z.infer<typeof insertPromoSettingSchema>;
export type PromoSetting = typeof promoSettings.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertPricingPlan = z.infer<typeof insertPricingPlanSchema>;
export type PricingPlan = typeof pricingPlans.$inferSelect;

export type InsertServerStatus = z.infer<typeof insertServerStatusSchema>;
export type ServerStatus = typeof serverStatus.$inferSelect;

export type InsertServerLocation = z.infer<typeof insertServerLocationSchema>;
export type ServerLocation = typeof serverLocations.$inferSelect;

export type InsertMinecraftTool = z.infer<typeof insertMinecraftToolSchema>;
export type MinecraftTool = typeof minecraftTools.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertGamePage = z.infer<typeof insertGamePageSchema>;
export type GamePage = typeof gamePages.$inferSelect;

export type InsertDemoServer = z.infer<typeof insertDemoServerSchema>;
export type DemoServer = typeof demoServers.$inferSelect;

export type InsertPricingDetail = z.infer<typeof insertPricingDetailSchema>;
export type PricingDetail = typeof pricingDetails.$inferSelect;
