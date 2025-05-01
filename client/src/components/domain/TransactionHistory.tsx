import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RotateCw, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw,
  PlusCircle,
  Edit,
  Send
} from "lucide-react";

interface Transaction {
  id: string;
  type: 'registration' | 'renewal' | 'update' | 'transfer';
  status: 'confirmed' | 'processing' | 'failed';
  timestamp: string; // ISO date string
  domainName: string;
  txHash?: string;
  sender?: string;
  receiver?: string;
  fee?: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function TransactionHistory({ 
  transactions: initialTransactions,
  onLoadMore,
  hasMore = false
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isLoading, setIsLoading] = useState(false);
  
  // Update when props change
  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);
  
  // Helper to format transaction type with icon
  const getTransactionTypeInfo = (type: Transaction['type']) => {
    switch (type) {
      case 'registration':
        return {
          icon: <PlusCircle className="h-4 w-4" />,
          label: 'Domain Registration'
        };
      case 'renewal':
        return {
          icon: <RefreshCw className="h-4 w-4" />,
          label: 'Domain Renewal'
        };
      case 'update':
        return {
          icon: <Edit className="h-4 w-4" />,
          label: 'Record Update'
        };
      case 'transfer':
        return {
          icon: <Send className="h-4 w-4" />,
          label: 'Domain Transfer'
        };
      default:
        return {
          icon: <ArrowUpRight className="h-4 w-4" />,
          label: 'Transaction'
        };
    }
  };
  
  // Helper to format transaction status
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="success" className="flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="warning" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleLoadMore = async () => {
    if (!onLoadMore || isLoading) return;
    
    setIsLoading(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoading(false);
    }
  };
  
  const getExplorerUrl = (txHash: string) => {
    return `https://explorer.solana.com/tx/${txHash}`;
  };

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <Card className="domain-card bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10]">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <RotateCw className="mr-2 h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p>No transaction history to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const { icon, label } = getTransactionTypeInfo(transaction.type);
              
              return (
                <div key={transaction.id} className="p-3 border border-white/10 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="bg-white/10 p-2 rounded-full">
                        {icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{label}</h3>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-sm mt-1">
                          <span className="text-solana-teal">{transaction.domainName}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(transaction.timestamp)}
                        </p>
                        
                        {transaction.type === 'transfer' && transaction.sender && transaction.receiver && (
                          <div className="text-xs text-gray-400 mt-2">
                            <p>From: <span className="font-mono">{shortenAddress(transaction.sender)}</span></p>
                            <p>To: <span className="font-mono">{shortenAddress(transaction.receiver)}</span></p>
                          </div>
                        )}
                        
                        {transaction.fee !== undefined && (
                          <p className="text-xs text-gray-400 mt-1">
                            Fee: <span className="text-white">{transaction.fee} SOL</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {transaction.txHash && (
                      <a
                        href={getExplorerUrl(transaction.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-solana-teal hover:underline text-xs flex items-center"
                      >
                        View
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}