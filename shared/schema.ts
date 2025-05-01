import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Domains table to store information about registered domains
export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  owner: text("owner").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isDefault: boolean("is_default").default(false),
});

// Domain records table to store domain settings (Twitter, IPFS, etc.)
export const domainRecords = pgTable("domain_records", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").notNull().references(() => domains.id),
  recordType: text("record_type").notNull(), // e.g. 'twitter', 'ipfs', 'bio'
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Marketplace listings table for domains that are for sale
export const marketplaceListings = pgTable("marketplace_listings", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").notNull().references(() => domains.id),
  price: integer("price").notNull(), // Price in lamports (1 SOL = 1,000,000,000 lamports)
  seller: text("seller").notNull(),
  listedAt: timestamp("listed_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
});

// Vanity wallet records for generated wallets
export const vanityWallets = pgTable("vanity_wallets", {
  id: serial("id").primaryKey(),
  prefix: text("prefix").notNull(),
  publicKey: text("public_key").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertDomainSchema = createInsertSchema(domains).omit({
  id: true,
  registeredAt: true,
});

export const insertDomainRecordSchema = createInsertSchema(domainRecords).omit({
  id: true,
  updatedAt: true,
});

export const insertMarketplaceListingSchema = createInsertSchema(marketplaceListings).omit({
  id: true,
  listedAt: true,
});

export const insertVanityWalletSchema = createInsertSchema(vanityWallets).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type Domain = typeof domains.$inferSelect;

export type InsertDomainRecord = z.infer<typeof insertDomainRecordSchema>;
export type DomainRecord = typeof domainRecords.$inferSelect;

export type InsertMarketplaceListing = z.infer<typeof insertMarketplaceListingSchema>;
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;

export type InsertVanityWallet = z.infer<typeof insertVanityWalletSchema>;
export type VanityWallet = typeof vanityWallets.$inferSelect;
