import { Card, CardContent } from "@/components/ui/card";

export default function RegisterSteps() {
  const steps = [
    {
      number: 1,
      title: "Search",
      description: "Find your perfect .sol domain name that represents you in the Solana ecosystem."
    },
    {
      number: 2,
      title: "Connect",
      description: "Connect your Solana wallet to register domains securely with a single click."
    },
    {
      number: 3,
      title: "Customize",
      description: "Personalize your domain with profile info, social links, and wallet addresses."
    }
  ];

  return (
    <div id="registration-process" className="max-w-4xl mx-auto pt-10 border-t border-white/10">
      <h2 className="text-2xl font-bold mb-6">How to register your .sol domain</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <Card key={step.number} className="bg-darkBg/60 border-solana-purple shadow-lg shadow-[hsl(var(--solana-purple))/10]">
            <CardContent className="p-6">
              <div className="rounded-full bg-[hsl(var(--solana-purple))/20] w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-[hsl(var(--solana-purple))] font-bold text-xl">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
