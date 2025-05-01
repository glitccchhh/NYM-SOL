import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Domain {
  id: string;
  name: string;
  expiresAt: string; // ISO date string
}

interface DomainExpirationTrackerProps {
  domains: Domain[];
  onRenew: (domainId: string) => void;
}

export default function DomainExpirationTracker({ domains, onRenew }: DomainExpirationTrackerProps) {
  const { toast } = useToast();
  const [sortedDomains, setSortedDomains] = useState<Domain[]>([]);
  
  // Sort domains by expiration date (ascending - soonest first)
  useEffect(() => {
    const sorted = [...domains].sort((a, b) => {
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
    });
    setSortedDomains(sorted);
  }, [domains]);
  
  // Calculate days until expiration
  const getDaysUntilExpiration = (expirationDate: string) => {
    const now = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get badge variant based on days until expiration
  const getExpirationBadgeVariant = (daysLeft: number) => {
    if (daysLeft < 0) return "destructive"; // Expired
    if (daysLeft < 30) return "error"; // Critical - less than 30 days
    if (daysLeft < 90) return "warning"; // Warning - less than 90 days
    return "success"; // Healthy - more than 90 days
  };
  
  const handleRenew = (domainId: string) => {
    onRenew(domainId);
    toast({
      title: "Renewal initiated",
      description: "Starting domain renewal process",
    });
  };
  
  return (
    <Card className="domain-card bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10]">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Domain Expiration Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDomains.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            <CheckCircle className="h-10 w-10 mx-auto mb-2 text-solana-teal" />
            <p>No domains to track</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDomains.map((domain) => {
              const daysLeft = getDaysUntilExpiration(domain.expiresAt);
              const badgeVariant = getExpirationBadgeVariant(daysLeft);
              const formattedDate = new Date(domain.expiresAt).toLocaleDateString();
              
              return (
                <div key={domain.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                  <div>
                    <h3 className="font-medium">
                      {domain.name.split('.')[0]}<span className="text-solana-teal">.sol</span>
                    </h3>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-xs text-gray-400">Expires: {formattedDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={badgeVariant as any} className="px-2 py-1">
                      {daysLeft < 0 ? (
                        <span className="flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Expired
                        </span>
                      ) : (
                        <span>{daysLeft} days left</span>
                      )}
                    </Badge>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleRenew(domain.id)} 
                      className="bg-gradient-to-r from-[hsl(var(--solana-purple))] to-[hsl(var(--solana-teal))] hover:shadow-md">
                      Renew
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}