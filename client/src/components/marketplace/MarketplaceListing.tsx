import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";

interface ListingProps {
  listing: {
    id: string;
    name: string;
    owner: string;
    price: number;
    isPremium: boolean;
  };
}

export default function MarketplaceListing({ listing }: ListingProps) {
  const { toast } = useToast();
  const { connected } = useWallet();
  
  const domainName = listing.name.split('.')[0];
  const usdPrice = (listing.price * 68).toFixed(2); // Assuming 1 SOL = $68 USD

  const handleBuyNow = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to buy this domain",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would trigger the purchase transaction
    toast({
      title: "Purchase initiated",
      description: `Starting purchase process for ${listing.name}`,
    });
  };

  return (
    <Card className="domain-card bg-darkBg/60 border-solana-purple overflow-hidden shadow-lg shadow-[hsl(var(--solana-purple))]/10">
      <CardContent className="p-5">
        <h3 className="text-xl font-bold">
          {domainName}<span className="text-solana-teal">.sol</span>
        </h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-300 text-sm">
            Listed by: <span className="font-mono">{listing.owner}</span>
          </span>
          {listing.isPremium && (
            <Badge variant="premium" className="text-xs px-2 py-1">Premium</Badge>
          )}
        </div>
        <div className="mt-4">
          <p className="text-lg font-bold">{listing.price} SOL</p>
          <p className="text-xs text-gray-400">~${usdPrice} USD</p>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10 p-4 bg-darkBg/80">
        <Button 
          onClick={handleBuyNow}
          className="w-full solana-gradient btn-hover"
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
