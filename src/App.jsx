import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// Contexts
import TokenAccountsFetcher from "./TokenAccountsFetcher";
import { useWalletContext } from "./contexts/useWalletContext";
// Components

import TokenHolderPage from "./components/TokenHolderPage";
import NonHolderPage from "./components/NonHolderPage";
import LandingPage from "./components/LandingPage";

import "./App.css";

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
      <main style={{ padding: "0 20px" }}>
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              !connected ? (
                <LandingPage />
              ) : isTokenHolder ? (
                <Navigate to="/holder" replace />
              ) : (
                <Navigate to="/non-holder" replace />
              )
            }
          />
          {/* Token Holder Route */}
          <Route path="/holder" element={<TokenHolderPage />} />
          {/* Non-Token Holder Route */}
          <Route path="/non-holder" element={<NonHolderPage />} />
          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
