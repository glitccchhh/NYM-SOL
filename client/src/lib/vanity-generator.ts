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
  const maxAttempts = 1000000; // Prevent infinite loops
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Generate a new random keypair
    const keypair = generateKeypair();
    
    // Get the public key as a string
    const publicKey = keypair.publicKey.toString();
    
    // Call the onAttempt callback if provided
    if (onAttempt) {
      onAttempt();
    }
    
    // Check if the public key starts with the prefix (case insensitive)
    if (publicKey.toLowerCase().startsWith(prefix.toLowerCase())) {
      // Return the matching keypair and address
      return {
        address: publicKey,
        keypair: {
          publicKey: keypair.publicKey.toString(),
          secretKey: Array.from(keypair.secretKey),
        },
      };
    }
    
    // Artificial delay to prevent browser hanging and allow UI updates
    if (attempts % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
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
