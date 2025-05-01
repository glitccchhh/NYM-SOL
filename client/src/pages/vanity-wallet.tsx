import VanityGenerator from "@/components/vanity/VanityGenerator";
import VanityExplanation from "@/components/vanity/VanityExplanation";

export default function VanityWallet() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vanity Wallet Generator</h1>
        <p className="text-gray-400">Create a custom Solana wallet address with your preferred prefix</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <VanityGenerator />
      </div>
      
      <VanityExplanation />
    </div>
  );
}
