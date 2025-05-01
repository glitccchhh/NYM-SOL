import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, RefreshCw } from "lucide-react";

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
  const [sortedDomains, setSortedDomains] = useState<Domain[]>([]);
  
  useEffect(() => {
    // Sort domains by expiration date (soonest first)
    const sorted = [...domains].sort((a, b) => {
      const dateA = new Date(a.expiresAt).getTime();
      const dateB = new Date(b.expiresAt).getTime();
      return dateA - dateB;
    });
    setSortedDomains(sorted);
  }, [domains]);
  
  const calculateDaysLeft = (expirationDate: string): number => {
    const expiry = new Date(expirationDate).getTime();
    const today = new Date().getTime();
    const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };
  
  const getExpirationStatus = (daysLeft: number) => {
    if (daysLeft < 0) {
      return { status: "expired", color: "bg-destructive", text: "text-destructive", label: "Expired" };
    } else if (daysLeft < 30) {
      return { status: "critical", color: "bg-destructive", text: "text-destructive", label: "Critical" };
    } else if (daysLeft < 90) {
      return { status: "warning", color: "bg-warning", text: "text-warning", label: "Warning" };
    } else {
      return { status: "good", color: "bg-success", text: "text-success", label: "Good" };
    }
  };
  
  const getProgressValue = (daysLeft: number) => {
    if (daysLeft < 0) return 0;
    if (daysLeft > 365) return 100;
    return Math.floor((daysLeft / 365) * 100);
  };
  
  return (
    <Card className="domain-card bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10]">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Domain Expiration Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDomains.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p>No domains to track</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDomains.map((domain) => {
              const daysLeft = calculateDaysLeft(domain.expiresAt);
              const { status, color, text, label } = getExpirationStatus(daysLeft);
              const progressValue = getProgressValue(daysLeft);
              
              return (
                <div key={domain.id} className="border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">
                        {domain.name.split('.')[0]}<span className="text-solana-teal">.sol</span>
                      </h3>
                      <p className="text-sm text-gray-400">
                        Expires: {new Date(domain.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Badge
                      variant={status === "good" ? "success" : status === "warning" ? "warning" : "destructive"}
                      className="flex items-center px-2 py-1"
                    >
                      {status === "expired" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {daysLeft < 0 ? 'Expired' : `${daysLeft} days left`}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Expiration</span>
                      <span className={daysLeft < 30 ? "text-destructive" : daysLeft < 90 ? "text-warning" : "text-gray-400"}>
                        {daysLeft < 0 ? 'Expired' : `${daysLeft} days remaining`}
                      </span>
                    </div>
                    <Progress 
                      value={progressValue} 
                      className={`h-2 bg-white/10`}
                      style={{
                        '--indicator-color': daysLeft < 30 
                          ? 'hsl(var(--destructive))' 
                          : daysLeft < 90 
                            ? 'hsl(var(--warning))' 
                            : 'hsl(var(--success))'
                      } as React.CSSProperties}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => onRenew(domain.id)}
                      variant={daysLeft < 90 ? "default" : "outline"}
                      size="sm"
                      className={daysLeft < 30 ? "solana-gradient" : ""}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Renew Domain
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