import {
  users, domains, domainRecords, marketplaceListings, vanityWallets,
  type User, type InsertUser,
  type Domain, type InsertDomain,
  type DomainRecord, type InsertDomainRecord,
  type MarketplaceListing, type InsertMarketplaceListing,
  type VanityWallet, type InsertVanityWallet
} from "@shared/schema";

// Interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;

  // Domain operations
  getDomain(id: number): Promise<Domain | undefined>;
  getDomainByName(name: string): Promise<Domain | undefined>;
  getDomainsByOwner(owner: string): Promise<Domain[]>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomain(id: number, data: Partial<InsertDomain>): Promise<Domain | undefined>;
  deleteDomain(id: number): Promise<boolean>;

  // Domain record operations
  getDomainRecords(domainId: number): Promise<DomainRecord[]>;
  getDomainRecord(id: number): Promise<DomainRecord | undefined>;
  getDomainRecordByType(domainId: number, recordType: string): Promise<DomainRecord | undefined>;
  createDomainRecord(record: InsertDomainRecord): Promise<DomainRecord>;
  updateDomainRecord(id: number, data: Partial<InsertDomainRecord>): Promise<DomainRecord | undefined>;
  deleteDomainRecord(id: number): Promise<boolean>;

  // Marketplace operations
  getMarketplaceListings(): Promise<MarketplaceListing[]>;
  getMarketplaceListing(id: number): Promise<MarketplaceListing | undefined>;
  getListingsByDomain(domainId: number): Promise<MarketplaceListing[]>;
  getListingsBySeller(seller: string): Promise<MarketplaceListing[]>;
  createMarketplaceListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing>;
  updateMarketplaceListing(id: number, data: Partial<InsertMarketplaceListing>): Promise<MarketplaceListing | undefined>;
  deleteMarketplaceListing(id: number): Promise<boolean>;

  // Vanity wallet operations
  getVanityWallets(userId: number): Promise<VanityWallet[]>;
  getVanityWallet(id: number): Promise<VanityWallet | undefined>;
  getVanityWalletByPublicKey(publicKey: string): Promise<VanityWallet | undefined>;
  createVanityWallet(wallet: InsertVanityWallet): Promise<VanityWallet>;
  deleteVanityWallet(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private domains: Map<number, Domain>;
  private domainRecords: Map<number, DomainRecord>;
  private marketplaceListings: Map<number, MarketplaceListing>;
  private vanityWallets: Map<number, VanityWallet>;
  
  private userId: number;
  private domainId: number;
  private recordId: number;
  private listingId: number;
  private walletId: number;

  constructor() {
    this.users = new Map();
    this.domains = new Map();
    this.domainRecords = new Map();
    this.marketplaceListings = new Map();
    this.vanityWallets = new Map();
    
    this.userId = 1;
    this.domainId = 1;
    this.recordId = 1;
    this.listingId = 1;
    this.walletId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Domain operations
  async getDomain(id: number): Promise<Domain | undefined> {
    return this.domains.get(id);
  }

  async getDomainByName(name: string): Promise<Domain | undefined> {
    return Array.from(this.domains.values()).find(
      (domain) => domain.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async getDomainsByOwner(owner: string): Promise<Domain[]> {
    return Array.from(this.domains.values()).filter(
      (domain) => domain.owner === owner,
    );
  }

  async createDomain(insertDomain: InsertDomain): Promise<Domain> {
    const id = this.domainId++;
    const now = new Date();
    const domain: Domain = { ...insertDomain, id, registeredAt: now };
    this.domains.set(id, domain);
    return domain;
  }

  async updateDomain(id: number, data: Partial<InsertDomain>): Promise<Domain | undefined> {
    const domain = this.domains.get(id);
    if (!domain) return undefined;
    
    const updatedDomain: Domain = { ...domain, ...data };
    this.domains.set(id, updatedDomain);
    return updatedDomain;
  }

  async deleteDomain(id: number): Promise<boolean> {
    return this.domains.delete(id);
  }

  // Domain record operations
  async getDomainRecords(domainId: number): Promise<DomainRecord[]> {
    return Array.from(this.domainRecords.values()).filter(
      (record) => record.domainId === domainId,
    );
  }

  async getDomainRecord(id: number): Promise<DomainRecord | undefined> {
    return this.domainRecords.get(id);
  }

  async getDomainRecordByType(domainId: number, recordType: string): Promise<DomainRecord | undefined> {
    return Array.from(this.domainRecords.values()).find(
      (record) => record.domainId === domainId && record.recordType === recordType,
    );
  }

  async createDomainRecord(insertRecord: InsertDomainRecord): Promise<DomainRecord> {
    const id = this.recordId++;
    const now = new Date();
    const record: DomainRecord = { ...insertRecord, id, updatedAt: now };
    this.domainRecords.set(id, record);
    return record;
  }

  async updateDomainRecord(id: number, data: Partial<InsertDomainRecord>): Promise<DomainRecord | undefined> {
    const record = this.domainRecords.get(id);
    if (!record) return undefined;
    
    const now = new Date();
    const updatedRecord: DomainRecord = { ...record, ...data, updatedAt: now };
    this.domainRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteDomainRecord(id: number): Promise<boolean> {
    return this.domainRecords.delete(id);
  }

  // Marketplace operations
  async getMarketplaceListings(): Promise<MarketplaceListing[]> {
    return Array.from(this.marketplaceListings.values()).filter(
      (listing) => listing.isActive,
    );
  }

  async getMarketplaceListing(id: number): Promise<MarketplaceListing | undefined> {
    return this.marketplaceListings.get(id);
  }

  async getListingsByDomain(domainId: number): Promise<MarketplaceListing[]> {
    return Array.from(this.marketplaceListings.values()).filter(
      (listing) => listing.domainId === domainId && listing.isActive,
    );
  }

  async getListingsBySeller(seller: string): Promise<MarketplaceListing[]> {
    return Array.from(this.marketplaceListings.values()).filter(
      (listing) => listing.seller === seller && listing.isActive,
    );
  }

  async createMarketplaceListing(insertListing: InsertMarketplaceListing): Promise<MarketplaceListing> {
    const id = this.listingId++;
    const now = new Date();
    const listing: MarketplaceListing = { ...insertListing, id, listedAt: now };
    this.marketplaceListings.set(id, listing);
    return listing;
  }

  async updateMarketplaceListing(id: number, data: Partial<InsertMarketplaceListing>): Promise<MarketplaceListing | undefined> {
    const listing = this.marketplaceListings.get(id);
    if (!listing) return undefined;
    
    const updatedListing: MarketplaceListing = { ...listing, ...data };
    this.marketplaceListings.set(id, updatedListing);
    return updatedListing;
  }

  async deleteMarketplaceListing(id: number): Promise<boolean> {
    return this.marketplaceListings.delete(id);
  }

  // Vanity wallet operations
  async getVanityWallets(userId: number): Promise<VanityWallet[]> {
    return Array.from(this.vanityWallets.values()).filter(
      (wallet) => wallet.userId === userId,
    );
  }

  async getVanityWallet(id: number): Promise<VanityWallet | undefined> {
    return this.vanityWallets.get(id);
  }

  async getVanityWalletByPublicKey(publicKey: string): Promise<VanityWallet | undefined> {
    return Array.from(this.vanityWallets.values()).find(
      (wallet) => wallet.publicKey === publicKey,
    );
  }

  async createVanityWallet(insertWallet: InsertVanityWallet): Promise<VanityWallet> {
    const id = this.walletId++;
    const now = new Date();
    const wallet: VanityWallet = { ...insertWallet, id, createdAt: now };
    this.vanityWallets.set(id, wallet);
    return wallet;
  }

  async deleteVanityWallet(id: number): Promise<boolean> {
    return this.vanityWallets.delete(id);
  }
}

export const storage = new MemStorage();
