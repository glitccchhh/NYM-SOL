import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import DomainDetails from "@/components/domain/DomainDetails";
import TransferDomain from "@/components/domain/TransferDomain";

// Mock data - In a real app, this would come from the blockchain
const mockDomains = [
  {
    id: "1",
    name: "satoshi.sol",
    isActive: true,
    expiry: "March 15, 2024",
    records: {
      twitter: "satoshi_nakamoto",
      website: "https://example.com",
      ipfs: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      bio: "Crypto enthusiast and developer in the Solana ecosystem.",
      email: "contact@example.com",
    }
  }
];

export default function Dashboard() {
  const { connected } = useWallet();
  const [domains] = useState(mockDomains);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const handleManageDomain = (domainId: string) => {
    setSelectedDomain(domainId);
    setIsEditing(true);
    setIsTransferring(false);
  };

  const handleTransferDomain = (domainId: string) => {
    setSelectedDomain(domainId);
    setIsTransferring(true);
    setIsEditing(false);
  };

  const handleBackToDomains = () => {
    setSelectedDomain(null);
    setIsEditing(false);
    setIsTransferring(false);
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My .sol Domains</h1>
          <p className="text-gray-400">Manage your Solana Name Service domains</p>
        </div>

        <Card className="bg-darkBg/60 border-solana-purple">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 mx-auto text-[hsl(var(--solana-purple))]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">Connect your Solana wallet to view and manage your .sol domains</p>
            <Button className="solana-gradient">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My .sol Domains</h1>
        <p className="text-gray-400">Manage your Solana Name Service domains</p>
      </div>

      {!selectedDomain && (
        <div id="domains-list">
          {domains.map((domain) => (
            <Card 
              key={domain.id} 
              className="bg-darkBg/60 border-solana-purple mb-6 shadow-lg shadow-[hsl(var(--solana-purple))/10]"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {domain.name.split('.')[0]}<span className="text-solana-teal">.sol</span>
                    </h2>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-success mt-2">
                      <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                      Active
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Expires: {domain.expiry}</p>
                  </div>
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <Button variant="outline" size="sm">Set as Default</Button>
                    <Button onClick={() => handleManageDomain(domain.id)} className="solana-gradient" size="sm">Manage</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedDomain && isEditing && (
        <div>
          <Button variant="outline" onClick={handleBackToDomains} className="mb-4">
            ← Back to Domains
          </Button>
          <DomainDetails
            domain={domains.find(d => d.id === selectedDomain)!}
            onTransfer={() => handleTransferDomain(selectedDomain)} 
          />
        </div>
      )}

      {selectedDomain && isTransferring && (
        <div>
          <Button variant="outline" onClick={handleBackToDomains} className="mb-4">
            ← Back to Domains
          </Button>
          <TransferDomain 
            domain={domains.find(d => d.id === selectedDomain)!} 
            onCancel={handleBackToDomains}
          />
        </div>
      )}
    </div>
  );
}
