import { Link, useLocation } from "wouter";
import { useState } from "react";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";
import WalletModal from "@/components/wallet/WalletModal";

export default function Header() {
  const [location] = useLocation();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  // Define tab routes and their names
  const tabs = [
    { path: "/", name: "Search" },
    { path: "/dashboard", name: "Dashboard" },
    { path: "/vanity-wallet", name: "Vanity Wallet" },
    { path: "/marketplace", name: "Marketplace" },
  ];

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  return (
    <header className="backdrop-blur-sm bg-darkBg/90 fixed w-full z-50 border-b border-[hsl(var(--solana-purple))/20]">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex flex-shrink-0 items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(var(--solana-purple))] to-[hsl(var(--solana-teal))] flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="ml-2 text-xl font-bold text-white">Nym<span className="text-solana-teal">SOL</span></span>
            </a>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {tabs.map((tab) => (
            <Link key={tab.path} href={tab.path}>
              <a className={`px-4 py-2 rounded-md text-white hover:bg-white/10 transition-all ${location === tab.path ? 'bg-white/10' : ''}`}>
                {tab.name}
              </a>
            </Link>
          ))}
        </nav>
        
        {/* Connect Wallet */}
        <div>
          <WalletConnectButton onClick={openWalletModal} />
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-[hsl(var(--solana-purple))/20] overflow-x-auto">
        <div className="flex space-x-1 px-4 py-2">
          {tabs.map((tab) => (
            <Link key={tab.path} href={tab.path}>
              <a className={`flex-1 px-4 py-2 rounded-md text-white hover:bg-white/10 transition-all text-sm text-center ${location === tab.path ? 'bg-white/10' : ''}`}>
                {tab.name === "Vanity Wallet" ? "Vanity" : tab.name}
              </a>
            </Link>
          ))}
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
    </header>
  );
}
