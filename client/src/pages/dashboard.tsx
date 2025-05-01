import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, History } from "lucide-react";
import DomainDetails from "@/components/domain/DomainDetails";
import TransferDomain from "@/components/domain/TransferDomain";
import DomainExpirationTracker from "@/components/domain/DomainExpirationTracker";
import DomainRecordManager from "@/components/domain/DomainRecordManager";
import TransactionHistory from "@/components/domain/TransactionHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Mock data - In a real app, this would come from the blockchain
const mockDomains = [
  {
    id: "1",
    name: "satoshi.sol",
    isActive: true,
    expiresAt: "2024-06-15T00:00:00Z",
    records: {
      twitter: "satoshi_nakamoto",
      website: "https://example.com",
      ipfs: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      bio: "Crypto enthusiast and developer in the Solana ecosystem.",
      email: "contact@example.com",
    }
  },
  {
    id: "2",
    name: "crypto.sol",
    isActive: true,
    expiresAt: "2023-12-22T00:00:00Z", // Soon to expire domain
    records: {
      twitter: "crypto_official",
      website: "https://crypto-sol.example",
      bio: "The official crypto domain on Solana",
    }
  }
];

// Mock transaction history data
const mockTransactions = [
  {
    id: "tx1",
    type: 'registration' as const,
    status: 'confirmed' as const,
    timestamp: "2023-09-15T14:30:00Z",
    domainName: "satoshi.sol",
    txHash: "5UfEFyJv6r9nmBrQxQT7yVvq9yUMxBBECQDC6cLHG4KfFpGRNj",
    fee: 0.5
  },
  {
    id: "tx2",
    type: 'update' as const,
    status: 'confirmed' as const,
    timestamp: "2023-10-20T09:45:00Z",
    domainName: "satoshi.sol",
    txHash: "8UfJKLyv7r2nmCrQzGU4yVmq2yZMzVVECQER6cLBG4KbRtGNKp",
    fee: 0.01
  },
  {
    id: "tx3",
    type: 'renewal' as const,
    status: 'processing' as const,
    timestamp: "2023-11-01T16:20:00Z",
    domainName: "crypto.sol",
    txHash: "3KfGPAyv1r7nwCrQzFY9yTvq5yUMzBRFEQHC6fLTR4KdGpLSMj",
    fee: 0.5
  }
];

// Define the interface for a domain based on DomainDetails component requirements
interface Domain {
  id: string;
  name: string;
  records: {
    twitter: string;
    website: string;
    ipfs: string;
    bio: string;
    email: string;
  };
}

// Type for our enhanced dashboard domains
interface EnhancedDomain {
  id: string;
  name: string;
  isActive: boolean;
  expiresAt: string;
  records: {
    twitter?: string;
    website?: string;
    ipfs?: string;
    bio?: string;
    email?: string;
    [key: string]: string | undefined;
  };
}

// Convert to proper Domain type for DomainDetails
const convertToDomainType = (domain: EnhancedDomain): Domain => {
  return {
    id: domain.id,
    name: domain.name,
    records: {
      twitter: domain.records.twitter || "",
      website: domain.records.website || "",
      ipfs: domain.records.ipfs || "",
      bio: domain.records.bio || "",
      email: domain.records.email || ""
    }
  };
};

export default function Dashboard() {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [domains] = useState<EnhancedDomain[]>(mockDomains);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
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
  
  const handleRenewDomain = (domainId: string) => {
    toast({
      title: "Renewal initiated",
      description: `Starting renewal process for domain ID: ${domainId}`,
    });
  };
  
  const handleSaveRecords = async (records: any) => {
    // In a real app, this would call an API to save the records on the blockchain
    toast({
      title: "Records saved",
      description: "Domain records have been updated successfully",
    });
    return true;
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
                    <p className="text-sm text-gray-400 mt-1">Expires: {new Date(domain.expiresAt).toLocaleDateString()}</p>
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
          
          <Tabs defaultValue="details" className="w-full mb-8">
            <TabsList className="w-full">
              <TabsTrigger value="details" onClick={() => setActiveTab("details")} className="flex-1">
                Domain Details
              </TabsTrigger>
              <TabsTrigger value="records" onClick={() => setActiveTab("records")} className="flex-1">
                Records
              </TabsTrigger>
              <TabsTrigger value="expiration" onClick={() => setActiveTab("expiration")} className="flex-1">
                <Clock className="h-4 w-4 mr-2" />
                Expiration
              </TabsTrigger>
              <TabsTrigger value="history" onClick={() => setActiveTab("history")} className="flex-1">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <DomainDetails
                domain={convertToDomainType(domains.find(d => d.id === selectedDomain)!)}
                onTransfer={() => handleTransferDomain(selectedDomain)} 
              />
            </TabsContent>
            
            <TabsContent value="records" className="mt-6">
              <DomainRecordManager
                domainName={domains.find(d => d.id === selectedDomain)!.name}
                records={domains.find(d => d.id === selectedDomain)!.records}
                onSave={handleSaveRecords}
              />
            </TabsContent>
            
            <TabsContent value="expiration" className="mt-6">
              <DomainExpirationTracker
                domains={domains}
                onRenew={handleRenewDomain}
              />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <TransactionHistory
                transactions={mockTransactions}
                hasMore={false}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {selectedDomain && isTransferring && (
        <div>
          <Button variant="outline" onClick={handleBackToDomains} className="mb-4">
            ← Back to Domains
          </Button>
          <TransferDomain 
            domain={convertToDomainType(domains.find(d => d.id === selectedDomain)!)}
            onCancel={handleBackToDomains}
          />
        </div>
      )}
    </div>
  );
}
