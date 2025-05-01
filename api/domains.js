export default function handler(req, res) {
  // Mock data for domains
  const domains = [
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
  ];

  // Return domains data
  return res.status(200).json({ domains });
}