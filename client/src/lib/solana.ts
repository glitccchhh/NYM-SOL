import { Connection, PublicKey, Keypair } from '@solana/web3.js';

// Default RPC endpoint - Use import.meta.env for Vite or fall back to public RPC
// Note: For production use, it's recommended to use a dedicated RPC endpoint
// from providers like Helius, QuickNode, or Alchemy for better reliability
export const SOLANA_RPC_ENDPOINT = import.meta.env.VITE_SOLANA_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

// Create a connection to Solana
export const getConnection = () => {
  return new Connection(SOLANA_RPC_ENDPOINT);
};

// Get the SOL balance for a wallet
export const getBalance = async (publicKey: string): Promise<number> => {
  try {
    const connection = getConnection();
    const pubKey = new PublicKey(publicKey);
    const balance = await connection.getBalance(pubKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

// Generate a new keypair
export const generateKeypair = (): Keypair => {
  return Keypair.generate();
};

// Format a public key for display
export const formatPublicKey = (publicKey: string): string => {
  if (!publicKey || publicKey.length < 10) return publicKey;
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};

// Export types
export type { Keypair, PublicKey };
