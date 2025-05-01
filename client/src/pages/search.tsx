import DomainSearch from "@/components/domain/DomainSearch";
import DomainResults from "@/components/domain/DomainResults";
import RegisterSteps from "@/components/domain/RegisterSteps";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!query) return;

    try {
      setIsLoading(true);
      setSearchQuery(query);

      // Simulate API call to check domain availability
      // In a real implementation, this would be an actual call to the Solana Name Service
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSearchPerformed(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Failed to check domain availability. Please try again.",
      });
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Digital Identity on <span className="text-solana-teal">Solana</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Register, manage, and customize your .sol domain name with NymSOL, the premier interface for the Solana Name Service.
        </p>
      </div>

      {/* Search Bar */}
      <DomainSearch onSearch={handleSearch} isLoading={isLoading} />

      {/* Search Results - Only show if search has been performed */}
      {searchPerformed && <DomainResults query={searchQuery} />}

      {/* Registration Process */}
      <RegisterSteps />
    </div>
  );
}
