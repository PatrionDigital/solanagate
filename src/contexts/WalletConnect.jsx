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

export const WalletContextProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    setConnection(new Connection("https://api.mainnet-beta.solana.com"));
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connection,
        publicKey,
        connected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const WalletProviderWrapper = ({ children }) => {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
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
