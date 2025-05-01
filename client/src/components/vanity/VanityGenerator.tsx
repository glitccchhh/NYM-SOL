import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateVanityAddress } from "@/lib/vanity-generator";

export default function VanityGenerator() {
  const [prefix, setPrefix] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAddress, setGeneratedAddress] = useState<string | null>(null);
  const [keyPair, setKeyPair] = useState<any | null>(null);
  const [attemptsPerSecond, setAttemptsPerSecond] = useState(0);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prefix) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a desired prefix",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedAddress(null);
    
    try {
      // Performance optimizations
      // Start a counter for attempts per second with a higher update rate
      let attempts = 0;
      const start = Date.now();
      
      // Update the attempts counter more frequently for responsive UI feedback
      const interval = setInterval(() => {
        const elapsed = (Date.now() - start) / 1000 || 0.001; // Avoid division by zero
        setAttemptsPerSecond(Math.round(attempts / elapsed));
      }, 100);
      
      // Performance-optimized approach: pre-allocate batches for speed
      const incrementAttempts = () => { attempts += 100; }; // Count in batches for speed
      
      // Generate the vanity address with improved performance
      const { address, keypair } = await generateVanityAddress(
        prefix.toLowerCase(),
        incrementAttempts
      );
      
      clearInterval(interval);
      
      // Success! Show the result
      setGeneratedAddress(address);
      setKeyPair(keypair);
      toast({
        title: "Success!",
        description: `Found a wallet with prefix: ${prefix}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Could not generate the vanity address. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const downloadKeypair = () => {
    if (!keyPair) return;
    
    const dataStr = JSON.stringify(keyPair);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `${prefix}-wallet-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };

  return (
    <div className="md:col-span-2">
      <Card className="bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10]">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Generate Wallet</h2>
          
          <div className="mb-6">
            <Label className="block text-sm font-medium text-gray-300 mb-2">Desired Prefix</Label>
            <div className="flex">
              <Input 
                id="vanity-prefix" 
                className="flex-grow bg-white/5 border-white/20 rounded-l-lg" 
                placeholder="e.g. sol, crypto, nft"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                disabled={isGenerating}
              />
              <Button
                id="generate-btn"
                onClick={handleGenerate}
                className="solana-gradient rounded-r-lg btn-hover"
                disabled={isGenerating || !prefix}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Longer prefixes will take more time to generate</p>
          </div>
          
          {/* Processing State */}
          {isGenerating && (
            <div className="mb-6 p-4 bg-darkBg/80 border border-[hsl(var(--solana-purple))]/30 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[hsl(var(--solana-teal))] mr-3"></div>
                <div>
                  <p className="font-medium">Generating address...</p>
                  <p className="text-sm text-gray-400">
                    Checking <span id="attempts-counter" className="font-bold text-solana-teal">{attemptsPerSecond.toLocaleString()}</span> addresses per second
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[hsl(var(--solana-purple))] to-[hsl(var(--solana-teal))] rounded-full"
                    style={{ 
                      width: `${Math.min(100, attemptsPerSecond / 100)}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Result State */}
          {generatedAddress && (
            <div className="mb-6 p-4 bg-darkBg/80 border border-[hsl(var(--solana-purple))]/30 rounded-lg">
              <h3 className="font-medium mb-2">Generated Wallet</h3>
              <div className="mb-4">
                <div className="bg-white/5 border border-white/20 rounded-lg p-3 font-mono text-sm break-all">
                  <span className="text-solana-teal">{prefix.toLowerCase()}</span>
                  {generatedAddress.substring(prefix.length)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => copyToClipboard(generatedAddress)}
                  variant="outline"
                  className="flex items-center justify-center"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  Copy Address
                </Button>
                <Button
                  onClick={downloadKeypair}
                  variant="outline"
                  className="flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Keypair
                </Button>
              </div>
            </div>
          )}
          
          {/* QR Code */}
          {generatedAddress && (
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-4">Scan to view wallet address</p>
              <div className="inline-block p-4 bg-white rounded-lg">
                <div className="w-32 h-32 bg-black"></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card className="bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))]/10">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Register Domain</h2>
            <p className="text-gray-300 mb-6">Register a .sol domain for your new vanity wallet</p>
            
            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-300 mb-2">Domain Name</Label>
              <div className="flex">
                <Input 
                  className="flex-grow bg-white/5 border-white/20 rounded-l-lg" 
                  placeholder="yourdomain" 
                />
                <span className="bg-white/10 border border-white/20 px-3 py-2 rounded-r-lg text-gray-300">.sol</span>
              </div>
            </div>
            
            <div className="mb-6">
              <Label className="block text-sm font-medium text-gray-300 mb-2">Registration Period</Label>
              <select className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--solana-purple))]">
                <option>1 year - 0.5 SOL</option>
                <option>2 years - 0.9 SOL</option>
                <option>5 years - 2.0 SOL</option>
              </select>
            </div>
            
            <Button 
              className="w-full solana-gradient btn-hover"
              disabled={!generatedAddress}
            >
              Register Domain
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
