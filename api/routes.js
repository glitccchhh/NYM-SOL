// Simplified routes for Vercel
export default function handleRequest(req, res) {
  const { method, url } = req;

  // Basic routing
  if (method === 'GET') {
    if (url === '/api/health') {
      return res.status(200).json({ status: 'healthy' });
    }
    
    if (url === '/api/domains') {
      return res.status(200).json({
        domains: [
          {
            id: "1",
            name: "satoshi.sol",
            isActive: true,
            expiresAt: "2024-06-15T00:00:00Z",
            records: {
              twitter: "satoshi_nakamoto",
              website: "https://example.com",
              ipfs: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
              bio: "Crypto enthusiast and developer in the Solana ecosystem.",
              email: "contact@example.com",
            }
          },
          {
            id: "2",
            name: "crypto.sol",
            isActive: true,
            expiresAt: "2023-12-22T00:00:00Z",
            records: {
              twitter: "crypto_official",
              website: "https://crypto-sol.example",
              bio: "The official crypto domain on Solana",
            }
          }
        ]
      });
    }
  }

  // Default response for unmatched routes
  return res.status(404).json({ error: 'Not Found' });
}