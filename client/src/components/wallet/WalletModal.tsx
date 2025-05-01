import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { select, wallets } = useWallet();

  if (!isOpen) return null;

  const connectWallet = (wallet: any) => {
    select(wallet.adapter.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="bg-darkBg border-solana-purple max-w-md w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Connect Wallet</CardTitle>
          <Button variant="ghost" onClick={onClose} size="icon">
            <X className="h-6 w-6 text-gray-400 hover:text-white" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <Button
                key={wallet.adapter.name}
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
