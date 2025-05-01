// API handler for domain data on Vercel
export default function handler(req, res) {
  // Sample domain data
  const domains = [
    {
      id: "1",
      name: "satoshi.sol",
      owner: "BvzKvn6nUUAYNFGFzqfQ9tBFUdpkADAGzAZFXQqJimJN",
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
      owner: "FidaeBkZkvDq1hGKJoUX9DY3WmecD8NwVVVv5wSbKm1v",
      isActive: true,
      expiresAt: "2023-12-22T00:00:00Z",
      records: {
        twitter: "crypto_official",
        website: "https://crypto-sol.example",
        bio: "The official crypto domain on Solana",
      }
    },
    {
      id: "3",
      name: "bonfida.sol",
      owner: "EPwk2n9vRiVdxrFJgwMhHWS4KREVsJzH9kJvr7ZP1whL",
      isActive: true,
      expiresAt: "2024-08-30T00:00:00Z",
      records: {
        twitter: "bonfida",
        website: "https://bonfida.org",
        discord: "https://discord.gg/bonfida",
        email: "contact@bonfida.com"
      }
    },
    {
      id: "4",
      name: "solana.sol",
      owner: "EvVrzsxoj118sxxSTrcnc9u3fRdQfCc7d4gRzzX6TSqj",
      isActive: true,
      expiresAt: "2024-10-15T00:00:00Z",
      records: {
        twitter: "solana",
        website: "https://solana.com",
        github: "https://github.com/solana-labs"
      }
    }
  ];

  // Get domain by name if specified
  const domainName = req.query.name;
  if (domainName) {
    const domain = domains.find(d => d.name.toLowerCase() === `${domainName.toLowerCase()}.sol` || 
                                     d.name.toLowerCase() === domainName.toLowerCase());
    if (domain) {
      return res.status(200).json(domain);
    } else {
      return res.status(404).json({ message: "Domain not found" });
    }
  }

  // Return all domains
  return res.status(200).json({ domains });
}