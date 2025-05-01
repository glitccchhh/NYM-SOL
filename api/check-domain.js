// API handler for checking domain availability on Vercel
export default function handler(req, res) {
  // List of domains that are "registered" for testing
  const registeredDomains = [
    'solana', 'bonfida', 'crypto', 'nft', 'defi', 'wallet', 'token', 'dao', 'web3',
    'satoshi', 'blockchain', 'bitcoin', 'ethereum', 'stablecoin', 'dex',
    'serum', 'raydium', 'mango', 'orca', 'marinade'
  ];
  
  // Get the domain from the query
  const { domain } = req.query;
  
  if (!domain) {
    return res.status(400).json({ 
      error: 'Domain parameter is required',
      available: false
    });
  }
  
  // Clean up domain name
  const cleanDomain = domain.toLowerCase().replace('.sol', '');
  
  // Check if the domain is on our list of registered domains
  const isRegistered = registeredDomains.includes(cleanDomain);
  
  // Some heuristics for more realistic behavior:
  // - Short domains (3 chars or less) are usually taken
  // - Most short dictionary words (4-5 chars) are likely taken too
  const isLikelyRegistered = 
    cleanDomain.length <= 3 || 
    (cleanDomain.length <= 5 && /^[a-z]+$/.test(cleanDomain));
  
  const available = !(isRegistered || isLikelyRegistered);
  
  // Return the result
  return res.status(200).json({
    domain: cleanDomain,
    available
  });
}