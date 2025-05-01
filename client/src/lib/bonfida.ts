import { Connection, PublicKey } from '@solana/web3.js';
import { getConnection } from './solana';
import {
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
  getTwitterRegistry,
  Record,
  getRecord,
  getDomainKeySync,
  reverseLookup
} from '@bonfida/spl-name-service';

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
    if (!domain || domain.length < 1) {
      throw new Error('Domain name is required');
    }
    
    const connection = getConnection();
    const hashedName = await getHashedName(domain);
    const nameAccountKey = await getNameAccountKey(hashedName, undefined, ROOT_DOMAIN_KEY);
    
    try {
      await NameRegistryState.retrieve(connection, nameAccountKey);
      return false; // Domain exists, so it's not available
    } catch (err) {
      // If we get here, the domain does not exist in the registry
      return true; // Domain is available
    }
  } catch (error) {
    console.error('Error checking domain availability:', error);
    // For better UX, return false on error (safer to assume unavailable)
    return false;
  }
};

/**
 * Get the owner of a domain
 * @param domain The domain name without '.sol' extension
 * @returns The owner's public key as string, or null if domain not registered
 */
export const getDomainOwner = async (domain: string): Promise<string | null> => {
  try {
    const connection = getConnection();
    const hashedName = await getHashedName(domain);
    const nameAccountKey = await getNameAccountKey(hashedName, undefined, ROOT_DOMAIN_KEY);
    
    try {
      // NameRegistryState.retrieve returns the registry data directly
      const registry = await NameRegistryState.retrieve(connection, nameAccountKey);
      // Registry has an owner field which is a PublicKey
      return registry.owner.toBase58();
    } catch (err) {
      return null; // Domain not registered
    }
  } catch (error) {
    console.error('Error getting domain owner:', error);
    return null;
  }
};

/**
 * Register a domain (requires wallet connection and transaction)
 * @param domain The domain name without '.sol' extension
 * @param ownerPublicKey The public key of the wallet that will own the domain
 * @returns Boolean indicating success
 */
export const registerDomain = async (domain: string, ownerPublicKey: string): Promise<boolean> => {
  try {
    // This requires a connected wallet and transaction signature
    // Would need to use the Solana wallet adapter to create a transaction
    
    // For now, we return false as this isn't implemented yet
    console.warn('Domain registration requires wallet connection and is not implemented');
    return false;
  } catch (error) {
    console.error('Error registering domain:', error);
    return false;
  }
};

/**
 * Get a specific record for a domain
 * @param domain The domain name without '.sol' extension
 * @param recordType The type of record (twitter, website, etc.)
 * @returns The record value or null if not found
 */
export const getDomainRecord = async (domain: string, recordType: string): Promise<string | null> => {
  try {
    const connection = getConnection();
    const hashedName = await getHashedName(domain);
    const nameAccountKey = await getNameAccountKey(hashedName, undefined, ROOT_DOMAIN_KEY);
    
    // Special case for Twitter which has its own function
    if (recordType.toLowerCase() === 'twitter') {
      try {
        // Convert PublicKey to string for getTwitterRegistry
        const nameAccountKeyStr = nameAccountKey.toBase58();
        const twitter = await getTwitterRegistry(connection, nameAccountKeyStr);
        // If we get here, twitter exists and is a string
        return twitter || null;
      } catch (e) {
        return null; // No Twitter record found or error
      }
    }
    
    // For all other record types
    try {
      // Convert PublicKey to string for getRecord
      const nameAccountKeyStr = nameAccountKey.toBase58();
      const record = await getRecord(connection, nameAccountKeyStr, recordType);
      // Return stringified record or null
      return record ? record.toString() : null;
    } catch (e) {
      return null; // Record not found or error
    }
  } catch (error) {
    console.error('Error getting domain record:', error);
    return null;
  }
};

/**
 * Set a domain record (requires wallet connection and transaction)
 * @param domain The domain name without '.sol' extension
 * @param recordType The type of record to set
 * @param value The value to set for the record
 * @returns Boolean indicating success
 */
export const setDomainRecord = async (
  domain: string, 
  recordType: string, 
  value: string
): Promise<boolean> => {
  try {
    // This requires a connected wallet and transaction signature
    // Would need to use the Solana wallet adapter to create a transaction
    
    // For now, we return false as this isn't implemented yet
    console.warn('Setting records requires wallet connection and is not implemented');
    return false;
  } catch (error) {
    console.error('Error setting domain record:', error);
    return false;
  }
};

/**
 * Transfer domain ownership (requires wallet connection and transaction)
 * @param domain The domain name without '.sol' extension
 * @param currentOwnerPublicKey Current owner's public key
 * @param newOwnerPublicKey New owner's public key
 * @returns Boolean indicating success
 */
export const transferDomain = async (
  domain: string,
  currentOwnerPublicKey: string,
  newOwnerPublicKey: string
): Promise<boolean> => {
  try {
    // This requires a connected wallet and transaction signature
    // Would need to use the Solana wallet adapter to create a transaction
    
    // For now, we return false as this isn't implemented yet
    console.warn('Domain transfer requires wallet connection and is not implemented');
    return false;
  } catch (error) {
    console.error('Error transferring domain:', error);
    return false;
  }
};

/**
 * Generate alternative domain suggestions when a domain is taken
 * @param domain The original domain name that was unavailable
 * @returns Array of available alternatives
 */
export const getSuggestions = async (domain: string): Promise<string[]> => {
  const suggestions = [
    `${domain}sol`,
    `${domain}xyz`,
    `its${domain}`,
    `${domain}nft`,
    `${domain}dao`,
    `my${domain}`
  ];
  
  const results = await Promise.all(
    suggestions.map(async (suggestion) => {
      const available = await checkDomainAvailability(suggestion);
      return { name: suggestion, available };
    })
  );
  
  return results
    .filter(result => result.available)
    .map(result => result.name);
};
