import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, PlusCircle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { checkDomainAvailability, getDomainOwner } from "@/lib/bonfida";

interface DomainResultsProps {
  query: string;
}

export default function DomainResults({ query }: DomainResultsProps) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [registrationDate, setRegistrationDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connected } = useWallet();
  const { toast } = useToast();

  // Alternatives are suggested similar domains that are available
  const [alternatives, setAlternatives] = useState<string[]>([]);

  // Generate domain alternatives by adding common prefixes/suffixes
  const generateAlternatives = (domain: string): string[] => {
    const prefixes = ["my", "get", "use", "the"];
    const suffixes = ["app", "dao", "coin", "io", "sol"];
    const alternatives: string[] = [];
    
    // Add prefix alternatives
    prefixes.forEach(prefix => {
      const alternative = `${prefix}${domain}`;
      if (alternative !== domain) {
        alternatives.push(alternative);
      }
    });
    
    // Add suffix alternatives
    suffixes.forEach(suffix => {
      const alternative = `${domain}${suffix}`;
      if (alternative !== domain) {
        alternatives.push(alternative);
      }
    });
    
    // Return a random selection of 4 alternatives
    return alternatives.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  useEffect(() => {
    // Check domain availability using the Bonfida SNS implementation
    const checkAvailability = async () => {
      setIsLoading(true);
      try {
        // Check if the domain is available
        const available = await checkDomainAvailability(query);
        setIsAvailable(available);
        
        // If not available, get the owner
        if (!available) {
          const domainOwner = await getDomainOwner(query);
          setOwner(domainOwner);
          
          // For now, we don't have registration date from the blockchain
          // This would require additional data fetching in a production app
          setRegistrationDate("N/A");
        } else {
          setOwner(null);
          setRegistrationDate(null);
        }
        
        // Generate alternative domain suggestions
        // In a production app, we would verify these are actually available
        const alternativeDomains = generateAlternatives(query);
        setAlternatives(alternativeDomains);
      } catch (error) {
        console.error("Error checking domain:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check domain availability. Network issues or rate limiting may be occurring.",
        });
        
        // Set fallback values in case of error
        setIsAvailable(null);
        setOwner(null);
        setAlternatives([]);
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [query, toast]);

  const handleRegister = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to register a domain",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would trigger the domain registration process
    toast({
      title: "Registration initiated",
      description: `Starting registration process for ${query}.sol`,
    });
  };

  const handleMakeOffer = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make an offer",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would open an offer dialog
    toast({
      title: "Make Offer",
      description: `Offer functionality for ${query}.sol coming soon`,
    });
  };

  if (isLoading) {
    return (
      <div id="search-results" className="max-w-4xl mx-auto text-center py-10">
        <div className="animate-spin w-12 h-12 border-4 border-[hsl(var(--solana-purple))] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-400">Checking domain availability...</p>
      </div>
    );
  }

  return (
    <div id="search-results" className="max-w-4xl mx-auto">
      {/* Primary Result */}
      <Card className="mb-8 domain-card bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {query}<span className="text-solana-teal">.sol</span>
              </h2>
              {isAvailable ? (
                <Badge variant="success" className="mb-4">
                  <span className="w-2 h-2 bg-[hsl(var(--success))] rounded-full mr-2"></span>
                  Available
                </Badge>
              ) : (
                <Badge variant="error" className="mb-4">
                  <span className="w-2 h-2 bg-[hsl(var(--error))] rounded-full mr-2"></span>
                  Already Registered
                </Badge>
              )}
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              {isAvailable ? (
                <Button 
                  onClick={handleRegister} 
                  className="solana-gradient btn-hover"
                >
                  Register Now
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleMakeOffer}
                    className="flex items-center"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Make Offer
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    View Details
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {!isAvailable && owner && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="text-sm text-gray-400">
                <p>Owner: <span className="font-mono text-white">{owner}</span></p>
                {registrationDate && (
                  <p className="mt-1">Registered on: <span>{registrationDate}</span></p>
                )}
              </div>
            </div>
          )}
          
          {isAvailable && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="text-sm text-gray-400">
                <p>Price: <span className="text-white">0.5 SOL/year</span></p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Alternatives */}
      {!isAvailable && alternatives.length > 0 && (
        <>
          <h3 className="text-xl font-medium mb-4">Available Alternatives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {alternatives.map((alt, index) => (
              <Card key={index} className="domain-card bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10]">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">
                        {alt}<span className="text-solana-teal">.sol</span>
                      </h3>
                      <Badge variant="success" className="mt-2">
                        <span className="w-2 h-2 bg-[hsl(var(--success))] rounded-full mr-2"></span>
                        Available
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => handleRegister()} 
                      className="solana-gradient btn-hover"
                      size="sm"
                    >
                      Register
                    </Button>
                  </div>
                  <p className="mt-3 text-sm text-gray-400">Price: 0.5 SOL/year</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
