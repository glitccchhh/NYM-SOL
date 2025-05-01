import { Card, CardContent } from "@/components/ui/card";

export default function VanityExplanation() {
  return (
    <Card className="bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))]/10">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">How Vanity Wallets Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">What are vanity addresses?</h3>
            <p className="text-gray-300">
              Vanity addresses are custom cryptocurrency addresses that start with a specific prefix you choose, making them more recognizable.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">How are they generated?</h3>
            <p className="text-gray-300">
              We generate thousands of keypairs until we find one with your desired prefix. Longer prefixes take exponentially more time to create.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Are they secure?</h3>
            <p className="text-gray-300">
              Yes! Vanity addresses have the same security as regular Solana addresses. Your keys are generated locally in your browser for maximum security.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
