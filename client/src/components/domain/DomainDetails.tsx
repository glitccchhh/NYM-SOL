import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface DomainRecord {
  twitter: string;
  website: string;
  ipfs: string;
  bio: string;
  email: string;
}

interface Domain {
  id: string;
  name: string;
  records: DomainRecord;
}

interface DomainDetailsProps {
  domain: Domain;
  onTransfer: () => void;
}

export default function DomainDetails({ domain, onTransfer }: DomainDetailsProps) {
  const [records, setRecords] = useState<DomainRecord>(domain.records);
  const { toast } = useToast();

  const handleRecordChange = (field: keyof DomainRecord, value: string) => {
    setRecords((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save the changes to the blockchain
    toast({
      title: "Changes saved",
      description: `Records updated for ${domain.name}`,
    });
  };

  const handleUpload = () => {
    // In a real app, this would open a file upload dialog
    toast({
      title: "Upload avatar",
      description: "Avatar upload functionality coming soon",
    });
  };

  return (
    <Card className="bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10] mb-10">
      <CardContent className="p-6">
        <div className="mb-6 pb-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">
            Edit Domain: <span className="text-solana-teal">{domain.name}</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Update records for this domain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-300 mb-2">Twitter</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">@</span>
                <Input 
                  className="bg-white/5 border-white/20 pl-8" 
                  value={records.twitter}
                  onChange={(e) => handleRecordChange('twitter', e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-300 mb-2">Website URL</Label>
              <Input 
                className="bg-white/5 border-white/20" 
                value={records.website}
                onChange={(e) => handleRecordChange('website', e.target.value)}
              />
            </div>

            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-300 mb-2">Avatar</Label>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-[hsl(var(--solana-purple))/20] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[hsl(var(--solana-purple))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <Button onClick={handleUpload} variant="outline" size="sm" className="ml-4">Upload</Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-300 mb-2">IPFS Content Hash</Label>
              <Input 
                className="bg-white/5 border-white/20 font-mono text-sm" 
                value={records.ipfs}
                onChange={(e) => handleRecordChange('ipfs', e.target.value)}
              />
            </div>

            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-300 mb-2">Bio</Label>
              <Textarea 
                className="bg-white/5 border-white/20 h-24" 
                value={records.bio}
                onChange={(e) => handleRecordChange('bio', e.target.value)}
                placeholder="Tell the world about yourself"
              />
            </div>

            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-300 mb-2">Email</Label>
              <Input 
                type="email" 
                className="bg-white/5 border-white/20" 
                value={records.email}
                onChange={(e) => handleRecordChange('email', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button onClick={onTransfer} variant="outline">
            Transfer Domain
          </Button>
          <Button onClick={handleSave} className="solana-gradient btn-hover">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
