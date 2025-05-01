import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";

// Mock user domains - In a real app, these would come from the blockchain
const userDomains = [
  { id: "1", name: "satoshi.sol" }
];

export default function ListDomainForm() {
  const [selectedDomain, setSelectedDomain] = useState("");
  const [price, setPrice] = useState("");
  const { connected } = useWallet();
  const { toast } = useToast();

  const handleListDomain = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to list domains for sale",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDomain) {
      toast({
        title: "Selection required",
        description: "Please select a domain to list",
        variant: "destructive",
      });
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would create a listing on the marketplace
    toast({
      title: "Domain listed",
      description: `${selectedDomain} has been listed for ${price} SOL`,
    });
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">List Your Domain for Sale</h2>
      <p className="text-gray-300 mb-6">You can list your .sol domains for sale on our marketplace</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label className="block text-sm font-medium text-gray-300 mb-2">Domain</Label>
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="bg-white/5 border-white/20">
              <SelectValue placeholder="Select a domain you own" />
            </SelectTrigger>
            <SelectContent>
              {userDomains.map(domain => (
                <SelectItem key={domain.id} value={domain.name}>
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-300 mb-2">Price (SOL)</Label>
          <Input 
            type="number" 
            className="bg-white/5 border-white/20" 
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="flex items-end">
          <Button 
            onClick={handleListDomain}
            className="w-full solana-gradient btn-hover"
          >
            List Domain
          </Button>
        </div>
      </div>
    </>
  );
}
