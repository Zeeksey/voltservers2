import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
  name: text("name").notNull(),
  region: text("region").notNull(),
  status: text("status").notNull(),
  icon: text("icon").notNull(),
});

export const minecraftTools = pgTable("minecraft_tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolType: text("tool_type").notNull(), // "server_query", "skin_viewer", "uuid_converter", "color_generator"
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
