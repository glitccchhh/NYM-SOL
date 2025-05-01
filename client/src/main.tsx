import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";

const Root = () => {
  // Can be set to 'mainnet-beta', 'testnet', 'devnet' or a custom RPC endpoint
  const network = "mainnet-beta"; 
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Empty wallets array - in a production app we would add supported wallets
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
