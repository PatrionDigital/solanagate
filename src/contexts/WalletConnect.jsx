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
import { WalletContext } from "./useWalletContext";

import "@solana/wallet-adapter-react-ui/styles.css";

const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL;

export const WalletContextProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const { publicKey, connected } = useWallet();
  const [isTokenHolder, setIsTokenHolder] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isConnecting) return;
    console.log("Solana RPC:", SOLANA_RPC_URL);
    setIsConnecting(true);
    console.log("Initializing connection...");
    setConnection(new Connection(SOLANA_RPC_URL));
  }, [isConnecting]);

  useEffect(() => {
    const walletStatus = connected ? "connected" : "not connected";
    console.log(
      `Wallet ${walletStatus}:`,
      publicKey ? publicKey.toBase58() : ""
    );
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
