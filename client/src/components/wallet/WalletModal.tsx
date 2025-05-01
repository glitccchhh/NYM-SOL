import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { select, wallets } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Handle mounting only on client-side to avoid SSR issues with portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock wallet data for development until we have actual wallets
  const displayWallets = useMemo(() => {
    return wallets.length > 0 ? wallets : [
      {
        adapter: {
          name: "Phantom",
          icon: "https://www.phantom.app/img/logo.png" 
        }
      },
      {
        adapter: {
          name: "Solflare",
          icon: "https://solflare.com/assets/logo.svg"
        }
      }
    ];
  }, [wallets]);

  const connectWallet = (wallet: any) => {
    select(wallet.adapter.name);
    onClose();
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-[1000]" onClick={onClose}>
      <Card 
        className="bg-darkBg border border-[hsl(var(--solana-purple))] max-w-md w-full m-4 relative mt-32" 
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Connect Wallet</CardTitle>
          <Button 
            variant="ghost" 
            onClick={onClose} 
            size="icon" 
            className="absolute right-2 top-2"
          >
            <X className="h-6 w-6 text-gray-400 hover:text-white" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mt-2">
            {displayWallets.map((wallet: any, index: number) => (
              <Button
                key={index}
                className="w-full bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-all flex items-center justify-start h-auto"
                onClick={() => connectWallet(wallet)}
              >
                {wallet.adapter.icon && (
                  <img 
                    src={wallet.adapter.icon} 
                    alt={`${wallet.adapter.name} icon`} 
                    className="h-8 w-8 mr-4"
                  />
                )}
                <span className="font-medium">{wallet.adapter.name}</span>
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-6">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
