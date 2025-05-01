import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletIcon } from "lucide-react";

interface WalletConnectButtonProps {
  onClick: () => void;
}

export default function WalletConnectButton({ onClick }: WalletConnectButtonProps) {
  const { connected, publicKey } = useWallet();

  // Format the public key for display
  const formatPublicKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <Button 
      onClick={onClick}
      className="flex items-center bg-gradient-to-r from-[hsl(var(--solana-purple))] to-[hsl(var(--solana-blue))] px-4 py-2 rounded-md text-white font-medium btn-hover"
    >
      <span>{connected ? formatPublicKey(publicKey?.toString() || '') : 'Connect Wallet'}</span>
      <WalletIcon className="h-5 w-5 ml-2" />
    </Button>
  );
}
