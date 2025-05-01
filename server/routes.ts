import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDomainSchema, insertDomainRecordSchema, insertMarketplaceListingSchema, insertVanityWalletSchema } from "@shared/schema";
import { z } from "zod";

// Helper function to validate request body with Zod
const validateBody = <T>(schema: z.ZodType<T>) => {
  return (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      next(error);
    }
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Domain routes
  app.get(`${apiPrefix}/domains`, async (req, res) => {
    const owner = req.query.owner as string;
    
    if (owner) {
      const domains = await storage.getDomainsByOwner(owner);
      return res.json(domains);
    }
    
    // Return all domains (for marketplace)
    const domains = await storage.getDomainsByOwner("");
    res.json(domains);
  });
  
  app.get(`${apiPrefix}/domains/:name`, async (req, res) => {
    const name = req.params.name;
    const domain = await storage.getDomainByName(name);
    
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }
    
    res.json(domain);
  });
  
  app.post(
    `${apiPrefix}/domains`, 
    validateBody(insertDomainSchema), 
    async (req, res) => {
      const { name, owner, expiresAt, isDefault } = req.body;
      
      // Check if domain already exists
      const existingDomain = await storage.getDomainByName(name);
      if (existingDomain) {
        return res.status(409).json({ message: "Domain already registered" });
      }
      
      try {
        const domain = await storage.createDomain({
          name,
          owner,
          expiresAt,
          isDefault,
        });
        
        res.status(201).json(domain);
      } catch (error) {
        res.status(500).json({ message: "Failed to register domain" });
      }
    }
  );
  
  app.put(
    `${apiPrefix}/domains/:id`, 
    validateBody(insertDomainSchema.partial()), 
    async (req, res) => {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const domain = await storage.getDomain(id);
      if (!domain) {
        return res.status(404).json({ message: "Domain not found" });
      }
      
      try {
        const updatedDomain = await storage.updateDomain(id, updates);
        res.json(updatedDomain);
      } catch (error) {
        res.status(500).json({ message: "Failed to update domain" });
      }
    }
  );
  
  // Domain record routes
  app.get(`${apiPrefix}/domains/:domainId/records`, async (req, res) => {
    const domainId = parseInt(req.params.domainId);
    
    const domain = await storage.getDomain(domainId);
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }
    
    const records = await storage.getDomainRecords(domainId);
    res.json(records);
  });
  
  app.post(
    `${apiPrefix}/domains/:domainId/records`, 
    validateBody(insertDomainRecordSchema), 
    async (req, res) => {
      const domainId = parseInt(req.params.domainId);
      const { recordType, value } = req.body;
      
      const domain = await storage.getDomain(domainId);
      if (!domain) {
        return res.status(404).json({ message: "Domain not found" });
      }
      
      // Check if record already exists
      const existingRecord = await storage.getDomainRecordByType(domainId, recordType);
      if (existingRecord) {
        // Update existing record
        const updatedRecord = await storage.updateDomainRecord(existingRecord.id, { value });
        return res.json(updatedRecord);
      }
      
      try {
        const record = await storage.createDomainRecord({
          domainId,
          recordType,
          value,
        });
        
        res.status(201).json(record);
      } catch (error) {
        res.status(500).json({ message: "Failed to create record" });
      }
    }
  );
  
  // Marketplace routes
  app.get(`${apiPrefix}/marketplace`, async (req, res) => {
    const listings = await storage.getMarketplaceListings();
    
    // For each listing, get the domain details
    const listingsWithDomains = await Promise.all(
      listings.map(async (listing) => {
        const domain = await storage.getDomain(listing.domainId);
        return {
          ...listing,
          domain,
        };
      })
    );
    
    res.json(listingsWithDomains);
  });
  
  app.post(
    `${apiPrefix}/marketplace`, 
    validateBody(insertMarketplaceListingSchema), 
    async (req, res) => {
      const { domainId, price, seller } = req.body;
      
      // Check if domain exists
      const domain = await storage.getDomain(domainId);
      if (!domain) {
        return res.status(404).json({ message: "Domain not found" });
      }
      
      // Check if seller owns the domain
      if (domain.owner !== seller) {
        return res.status(403).json({ message: "You don't own this domain" });
      }
      
      // Check if domain is already listed
      const existingListings = await storage.getListingsByDomain(domainId);
      if (existingListings.length > 0) {
        return res.status(409).json({ message: "Domain already listed" });
      }
      
      try {
        const listing = await storage.createMarketplaceListing({
          domainId,
          price,
          seller,
          isActive: true,
        });
        
        res.status(201).json(listing);
      } catch (error) {
        res.status(500).json({ message: "Failed to create listing" });
      }
    }
  );
  
  // Vanity wallet routes
  app.post(
    `${apiPrefix}/vanity-wallets`, 
    validateBody(insertVanityWalletSchema), 
    async (req, res) => {
      const { prefix, publicKey, userId } = req.body;
      
      try {
        const wallet = await storage.createVanityWallet({
          prefix,
          publicKey,
          userId,
        });
        
        res.status(201).json(wallet);
      } catch (error) {
        res.status(500).json({ message: "Failed to save vanity wallet" });
      }
    }
  );
  
  app.get(`${apiPrefix}/vanity-wallets`, async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    
    const wallets = await storage.getVanityWallets(userId);
    res.json(wallets);
  });

  const httpServer = createServer(app);
  return httpServer;
}
