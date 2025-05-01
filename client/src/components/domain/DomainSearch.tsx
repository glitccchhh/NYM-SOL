import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DomainSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function DomainSearch({ onSearch, isLoading }: DomainSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      // Normalize the search term
      let normalized = searchTerm.toLowerCase().trim();
      
      // Remove .sol suffix if the user added it
      if (normalized.endsWith(".sol")) {
        normalized = normalized.substring(0, normalized.length - 4);
      }
      
      onSearch(normalized);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-16">
      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="text" 
          id="domain-search" 
          className="w-full bg-white/5 border-2 border-[hsl(var(--solana-purple))/50] rounded-2xl px-6 py-5 text-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--solana-purple))] search-focus" 
          placeholder="Search for your .sol domain"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
        
        <div className="absolute right-2 top-2">
          <Button 
            type="submit"
            className="solana-gradient rounded-xl px-6 py-3 text-white font-medium btn-hover"
            disabled={isLoading || !searchTerm}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
