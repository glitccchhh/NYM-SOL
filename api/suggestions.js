// API handler for domain name suggestions on Vercel
export default async function handler(req, res) {
  // Get the base domain name
  const { domain } = req.query;
  
  if (!domain) {
    return res.status(400).json({ 
      error: 'Domain parameter is required'
    });
  }
  
  // Clean up domain name
  const cleanDomain = domain.toLowerCase().replace('.sol', '');
  
  // List of domains that are "registered" for testing
  const registeredDomains = [
    'solana', 'bonfida', 'crypto', 'nft', 'defi', 'wallet', 'token', 'dao', 'web3',
    'satoshi', 'blockchain', 'bitcoin', 'ethereum', 'stablecoin', 'dex',
    'serum', 'raydium', 'mango', 'orca', 'marinade'
  ];
  
  // Generate suggestions
  const suggestions = [
    `${cleanDomain}sol`,
    `${cleanDomain}xyz`,
    `its${cleanDomain}`,
    `${cleanDomain}nft`,
    `${cleanDomain}dao`,
    `my${cleanDomain}`,
    `${cleanDomain}web3`,
    `${cleanDomain}verse`,
    `meta${cleanDomain}`
  ];
  
  // Check which suggestions are available
  const availableSuggestions = suggestions.filter(suggestion => {
    // Check if any registered domain is contained in the suggestion
    const isRegistered = registeredDomains.includes(suggestion);
    
    // Additional heuristic: short names are likely taken
    const isLikelyRegistered = suggestion.length <= 3;
    
    return !(isRegistered || isLikelyRegistered);
  });
  
  // Return results
  return res.status(200).json({
    original: cleanDomain,
    suggestions: availableSuggestions.map(s => `${s}.sol`),
    count: availableSuggestions.length
  });
}