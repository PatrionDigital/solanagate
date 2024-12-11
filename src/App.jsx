import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletContext } from "./contexts/useWalletContext";
import TokenAccountsFetcher from "./TokenAccountsFetcher";

import "./App.css";

const LandingPage = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Welcome to Token Gating dApp</h1>
    <WalletMultiButton />
    <p>Please connect your wallet to proceed.</p>
  </div>
);

const TokenHolderPage = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Exclusive Content</h1>
    <p>Welcome, token holder! You can access the gated content.</p>
  </div>
);

const NonHolderPage = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Access Denied</h1>
    <p>You do not hold the required tokens to access this content.</p>
  </div>
);

function App() {
  const { connection, publicKey, connected, isTokenHolder } =
    useWalletContext();

  // Check if the connection is initialized
  if (connection === null) {
    console.log("Connection initializing...");
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Loading...</h1>
        <p>Connecting to the Solana network...</p>
      </div>
    );
  }

  console.log("Connection:", connection);
  console.log("Public Key:", publicKey?.toBase58());
  console.log("Connection Status:", connected);
  console.log("Holder:", isTokenHolder);
  console.log("Routing decision:", { connected, isTokenHolder });
  return (
    <Router>
      <TokenAccountsFetcher />
      <Routes>
        <Route
          path="/"
          element={
            !connected ? (
              <LandingPage />
            ) : isTokenHolder ? (
              <Navigate to="/holder" />
            ) : (
              <Navigate to="/non-holder" />
            )
          }
        />
        <Route path="/holder" element={<TokenHolderPage />} />
        <Route path="/non-holder" element={<NonHolderPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
