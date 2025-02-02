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

const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL;

export const WalletContextProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const { publicKey, connected } = useWallet();
  const [isTokenHolder, setIsTokenHolder] = useState(null);

  

  useEffect(() => {
    setConnection(new Connection(SOLANA_RPC_URL));
    if (!connected) {
      setIsTokenHolder(null);
      return;
    }
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
      {children}
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
