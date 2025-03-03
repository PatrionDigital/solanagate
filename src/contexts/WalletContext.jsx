import { createContext, useContext } from "react";

export const WalletContext = createContext({
  connection: null,
  publicKey: null,
  connected: false,
  isTokenHolder: null,
  setIsTokenHolder: () => {},
  disconnect: () => {},
});

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error(
      "useWalletContext must be used within a WalletContextProvider"
    );
  }
  return context;
};
