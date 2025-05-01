import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection } from './solana';

// The Bonfida SNS program ID
export const SNS_PROGRAM_ID = new PublicKey('namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX');

// Root domain for .sol TLD (Top Level Domain)
export const ROOT_DOMAIN_KEY = new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx');

// List of premium or known registered domains for testing
const PREMIUM_DOMAINS = ['crypto', 'solana', 'nft', 'defi', 'wallet', 'token', 'dao', 'web3'];

/**
 * Check if a domain is available (not already registered)
 * @param domain The domain name without '.sol' extension
 * @returns True if domain is available, false if already registered
 */
export const checkDomainAvailability = async (domain: string): Promise<boolean> => {
  try {
    // For development/demo purposes
    // In a production app, this would use the @bonfida/spl-name-service library
    // to check domain availability on the Solana blockchain
    
    // Domain validation checks
    if (!domain || domain.length < 1) {
      throw new Error('Domain name is required');
    }
    
    // Check against list of known premium/registered domains
    const isDomainPremium = PREMIUM_DOMAINS.includes(domain.toLowerCase());
    
    // Some heuristics for the demo:
    // - Common dictionary words under 5 chars are likely registered
    // - Premium domains are registered
    const isLikelyRegistered = 
      isDomainPremium || 
      (domain.length <= 4 && /^[a-z]+$/.test(domain));
      
    return !isLikelyRegistered;
  } catch (error) {
    console.error('Error checking domain availability:', error);
    throw error;
  }
};

/**
 * Get the owner of a domain
 * @param domain The domain name without '.sol' extension
 * @returns The owner's public key as string, or null if domain not registered
 */
export const getDomainOwner = async (domain: string): Promise<string | null> => {
  try {
    // For development/demo purposes
    // In a production app, this would use the @bonfida/spl-name-service library
    // to get the domain owner from the Solana blockchain
    
    // Check if domain is registered first
    const isAvailable = await checkDomainAvailability(domain);
    if (isAvailable) {
      return null; // Domain not registered
    }
    
    // For premium domains, return a mock owner address
    if (PREMIUM_DOMAINS.includes(domain.toLowerCase())) {
      return 'BvzKvn6nUUAYNFGFzqfQ9tBFUdpkADAGzAZFXQqJimJN';
    }
    
    // For other "registered" domains, generate a deterministic owner
    // just for demo purposes
    const domainHash = domain.split('').reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0);
    
    // Use a prefix that looks like a Solana address
    return `${Math.abs(domainHash) % 1000}Hw7...X4qV`;
  } catch (error) {
    console.error('Error getting domain owner:', error);
    throw error;
  }
};

// Register a domain
export const registerDomain = async (domain: string, ownerPublicKey: string): Promise<boolean> => {
  try {
    // Mock implementation - In a real app, this would use Bonfida/SNS API
    // to register the domain on the blockchain
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return true to simulate successful registration
    return true;
  } catch (error) {
    console.error('Error registering domain:', error);
    throw error;
  }
};

// Get domain record value (Twitter, IPFS, etc.)
export const getDomainRecord = async (domain: string, recordType: string): Promise<string | null> => {
  try {
    // Mock implementation - In a real app, this would use Bonfida/SNS API
    // to get domain records from the blockchain
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Some mock records for demo purposes
    const mockRecords: Record<string, Record<string, string>> = {
      'crypto': {
        'twitter': 'crypto_official',
        'ipfs': 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        'website': 'https://example.com',
        'email': 'contact@example.com',
        'bio': 'Official crypto domain on Solana'
      }
    };
    
    return mockRecords[domain]?.[recordType] || null;
  } catch (error) {
    console.error('Error getting domain record:', error);
    throw error;
  }
};

// Set domain record value
export const setDomainRecord = async (
  domain: string, 
  recordType: string, 
  value: string
): Promise<boolean> => {
  try {
    // Mock implementation - In a real app, this would use Bonfida/SNS API
    // to set domain records on the blockchain
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return true to simulate successful update
    return true;
  } catch (error) {
    console.error('Error setting domain record:', error);
    throw error;
  }
};

// Transfer domain ownership
export const transferDomain = async (
  domain: string,
  currentOwnerPublicKey: string,
  newOwnerPublicKey: string
): Promise<boolean> => {
  try {
    // Mock implementation - In a real app, this would use Bonfida/SNS API
    // to transfer domain ownership on the blockchain
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return true to simulate successful transfer
    return true;
  } catch (error) {
    console.error('Error transferring domain:', error);
    throw error;
  }
};
