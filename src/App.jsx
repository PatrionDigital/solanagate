import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletContext } from "./contexts/useWalletContext";
import TokenAccountsFetcher from "./TokenAccountsFetcher";

import "./App.css";

function App() {
  const { connection, publicKey, connected, isTokenHolder } =
    useWalletContext();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Pump.fun Token Gating dApp</h1>
      <WalletMultiButton />
      {connected ? (
        <>
          <p>Wallet Connected: {publicKey?.toBase58()}</p>
          <p>Connection status: {connection ? "Active" : "Inactive"}</p>
          {isTokenHolder ? (
            <p>Token Holder: You can access the gated content!</p>
          ) : (
            <p>Token Not Found: You cannot access the gated content.</p>
          )}
          <TokenAccountsFetcher />
        </>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
}

export default App;
