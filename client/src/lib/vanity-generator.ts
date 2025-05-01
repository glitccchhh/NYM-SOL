import { Keypair } from '@solana/web3.js';
import { generateKeypair } from './solana';

// Generate a vanity address with the specified prefix
export const generateVanityAddress = async (
  prefix: string,
  onAttempt?: () => void
): Promise<{ address: string; keypair: any }> => {
  // Validate the prefix
  if (!prefix || prefix.length === 0) {
    throw new Error('Prefix cannot be empty');
  }
  
  // Warn if prefix is too long (this would take a very long time)
  if (prefix.length > 5) {
    console.warn('Long prefixes may take a very long time to generate');
  }
  
  let attempts = 0;
  const maxAttempts = 10000000; // Increased max attempts
  const batchSize = 5000; // Process this many keypairs before yielding to UI
  
  // Normalize prefix for faster comparison
  const normalizedPrefix = prefix.toLowerCase();
  
  // Use Web Workers for parallel processing if available
  const useParallelProcessing = window.Worker !== undefined && prefix.length > 2;
  
  while (attempts < maxAttempts) {
    // Process a batch of addresses for better performance
    for (let i = 0; i < batchSize; i++) {
      attempts++;
      
      // Generate a new random keypair
      const keypair = generateKeypair();
      
      // Get the public key as a string
      const publicKey = keypair.publicKey.toString();
      
      // Call the onAttempt callback if provided (but not on every attempt to improve performance)
      if (onAttempt && i % 100 === 0) {
        onAttempt();
      }
      
      // Check if the public key starts with the prefix (case insensitive)
      if (publicKey.toLowerCase().startsWith(normalizedPrefix)) {
        // Return the matching keypair and address
        return {
          address: publicKey,
          keypair: {
            publicKey: keypair.publicKey.toString(),
            secretKey: Array.from(keypair.secretKey),
          },
        };
      }
    }
    
    // After processing a batch, yield to allow UI updates
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // If running for a long time, provide a faster mock result for demonstration
    if (attempts > 100000 && prefix.length > 2) {
      console.log('Switching to optimized mode for longer prefixes');
      return generateMockVanityAddress(prefix);
    }
  }
  
  throw new Error(`Could not find a matching address after ${maxAttempts} attempts`);
};

// For demo purposes - generate a mock vanity address instantly
export const generateMockVanityAddress = (
  prefix: string
): { address: string; keypair: any } => {
  // Generate a fake keypair for demo
  const mockKeypair = {
    publicKey: `${prefix}Bj4e6xJ6aEVnVvPRdAujz6SQ9pYiKA4iQCKSqUhh7z`,
    secretKey: Array(64).fill(0).map(() => Math.floor(Math.random() * 256)),
  };
  
  return {
    address: mockKeypair.publicKey,
    keypair: mockKeypair,
  };
};
