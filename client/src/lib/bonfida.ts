import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection } from './solana';
import { NameRegistryState, getDomainKey, reverseLookup } from '@bonfida/spl-name-service';

// The Bonfida SNS program ID
export const SNS_PROGRAM_ID = new PublicKey('namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX');

// Root domain for .sol TLD (Top Level Domain)
export const ROOT_DOMAIN_KEY = new PublicKey('58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx');

/**
 * Check if a domain is available (not already registered)
 * @param domain The domain name without '.sol' extension
 * @returns True if domain is available, false if already registered
 */
export const checkDomainAvailability = async (domain: string): Promise<boolean> => {
  try {
    // Get the connection to Solana network
    const connection = getConnection();
    
    // Get the domain key for the given domain name
    const { pubkey } = await getDomainKey(domain);
    
    // Try to retrieve the domain registry state
    try {
      // This will throw if domain doesn't exist
      await NameRegistryState.retrieve(connection, pubkey);
      // If we reach here, domain exists
      return false;
    } catch (error: any) {
      // If the error is "Account does not exist", domain is available
      if (error?.message?.includes('Account does not exist')) {
        return true;
      }
      // Other errors should be rethrown
      throw error;
    }
  } catch (error) {
    console.error('Error checking domain availability:', error);
    
    // For development fallback, if network isn't available
    if (!import.meta.env.PROD) {
      console.warn('Using fallback for domain availability check during development');
      return domain.length >= 3 && !['crypto', 'solana', 'nft', 'defi'].includes(domain);
    }
    
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
    // Get the connection to Solana network
    const connection = getConnection();
    
    // Get the domain key for the given domain name
    const { pubkey } = await getDomainKey(domain);
    
    try {
      // Retrieve the domain registry state
      const { registry } = await NameRegistryState.retrieve(connection, pubkey);
      
      // Return owner's public key
      return registry.owner.toBase58();
    } catch (error: any) {
      // If the error is "Account does not exist", domain is not registered
      if (error?.message?.includes('Account does not exist')) {
        return null;
      }
      // Other errors should be rethrown
      throw error;
    }
  } catch (error) {
    console.error('Error getting domain owner:', error);
    
    // For development fallback, if network isn't available
    if (!import.meta.env.PROD) {
      console.warn('Using fallback for domain owner check during development');
      if (['crypto', 'solana', 'nft', 'defi'].includes(domain)) {
        return '5Hw7...X4qV'; // Mock address for development
      }
      return null;
    }
    
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
