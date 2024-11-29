import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletContext } from "./contexts/useWalletContext";

import "./App.css";

function App() {
  const { connection, publicKey, connected } = useWalletContext();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Pump.fun Token Gating dApp</h1>
      <WalletMultiButton />
      {connected ? (
        <>
          <p>Wallet Connected: {publicKey?.toBase58()}</p>
          <p>Connection status: {connection ? "Active" : "Inactive"}</p>
        </>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
}

export default App;
