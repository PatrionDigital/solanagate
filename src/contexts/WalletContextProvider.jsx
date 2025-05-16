import { useMemo, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Connection } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  // Only including the most reliable and widely supported wallets
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

// Contexts
import { WalletContext } from "@/contexts/WalletContext";

const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL;

export const WalletContextProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const { publicKey, connected, disconnect } = useWallet();
  const [isTokenHolder, setIsTokenHolder] = useState(null);

  // Initialize connection when component mounts
  useEffect(() => {
    const newConnection = new Connection(SOLANA_RPC_URL);
    setConnection(newConnection);
  }, []);

  // Reset token holder status when disconnected
  useEffect(() => {
    if (!connected) {
      setIsTokenHolder(null);
    }
  }, [connected]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setIsTokenHolder(null);
    // Note: The user profile is cleared in the UserInfoDisplay component
    // through the clearUserProfile function from UserProfileContext
  }, [disconnect]);

  return (
    <WalletContext.Provider
      value={{
        connection,
        publicKey,
        connected,
        isTokenHolder,
        setIsTokenHolder,
        disconnect: handleDisconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const WalletProviderWrapper = ({ children }) => {
  // Log wallet detection for debugging
  useEffect(() => {
    console.log("Wallet detection:");
    console.log("- window.phantom:", !!window.phantom);
    console.log("- window.solflare:", !!window.solflare);
    console.log("- window.backpack:", !!window.backpack);
  }, []);

  // Define wallets using the standard wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
    ].filter(Boolean), // Filter out any null/undefined wallets
    [] // Empty dependency array since we don't have any dependencies
  );

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider
          logo="/logo.png"
          modalProps={{
            className: 'wallet-modal',
            rootClassName: 'wallet-modal-root',
          }}
        >
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
