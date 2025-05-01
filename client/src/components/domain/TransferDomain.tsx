import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Domain {
  id: string;
  name: string;
}

interface TransferDomainProps {
  domain: Domain;
  onCancel: () => void;
}

export default function TransferDomain({ domain, onCancel }: TransferDomainProps) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!recipientAddress) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a recipient address",
      });
      return;
    }

    try {
      setIsTransferring(true);
      // In a real app, this would transfer the domain on the blockchain
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Transfer initiated",
        description: `${domain.name} is being transferred to ${recipientAddress.substring(0, 6)}...`,
      });
      
      onCancel();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Transfer failed",
        description: "There was an error transferring the domain. Please try again.",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Card className="bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10]">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Transfer Domain</h3>
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-300 mb-2">Recipient Wallet Address</Label>
          <Input 
            type="text" 
            className="bg-white/5 border-white/20 font-mono" 
            placeholder="Enter Solana address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </div>
        <div className="p-4 bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/30 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))] mr-2 mt-0.5" />
            <p className="text-sm text-[hsl(var(--warning))]">
              Warning: This action is irreversible. Once transferred, you will lose control of this domain.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="mr-3"
            disabled={isTransferring}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleTransfer}
            disabled={isTransferring}
          >
            {isTransferring ? 'Transferring...' : 'Transfer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
