import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Connection } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

// Contexts
import { WalletContext } from "@/contexts/WalletContext";

import LoadingSpinner from "@/components/LoadingSpinner";

const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL;

export const WalletContextProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const { publicKey, connected } = useWallet();
  const [isTokenHolder, setIsTokenHolder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize connection and handle wallet connection changes
  useEffect(() => {
    setConnection(new Connection(SOLANA_RPC_URL));

    if (!connected) {
      setIsTokenHolder(null);
      return;
    }

    const checkTokenHolder = async () => {
      // Replace this with actual logic for token holder check
      const isHolder = true; // Example check
      setIsTokenHolder(isHolder);
      setLoading(false);
    };

    checkTokenHolder();
  }, [connected, publicKey]);

  return (
    <WalletContext.Provider
      value={{
        connection,
        publicKey,
        connected,
        isTokenHolder,
        setIsTokenHolder,
      }}
    >
      {loading ? <LoadingSpinner message="Loading..." /> : children}{" "}
      {/* Show spinner while loading */}
    </WalletContext.Provider>
  );
};

export const WalletProviderWrapper = ({ children }) => {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

WalletContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
WalletProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
