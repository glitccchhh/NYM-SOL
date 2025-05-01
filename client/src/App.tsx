import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Search from "@/pages/search";
import Dashboard from "@/pages/dashboard";
import VanityWallet from "@/pages/vanity-wallet";
import Marketplace from "@/pages/marketplace";
import { ThemeProvider } from "@/components/ui/theme-provider";

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-darkBg text-white">
      <Header />
      <main className="container mx-auto px-4 md:px-6 pt-28 pb-16 flex-grow">
        <Switch>
          <Route path="/" component={Search} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/vanity-wallet" component={VanityWallet} />
          <Route path="/marketplace" component={Marketplace} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nymsol-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
