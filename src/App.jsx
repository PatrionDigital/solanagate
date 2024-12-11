import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletContext } from "./contexts/useWalletContext";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "./utils/localStorageUtils";
import TokenAccountsFetcher from "./TokenAccountsFetcher";

import "./App.css";

const LandingPage = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Welcome to Token Gating dApp</h1>
    <WalletMultiButton />
    <p>Please connect your wallet to proceed.</p>
  </div>
);

const TokenHolderPage = () => {
  const { disconnect } = useWallet();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile from localStorage when the component mounts
  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };

  const formatBalance = (balance) => {
    if (balance) {
      const formattedBalance = (balance / 10 ** 6).toFixed(6);
      return parseFloat(formattedBalance).toString();
    }
    return "0";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Exclusive Content</h1>
      <p>Welcome, token holder! You can access the gated content.</p>
      {userProfile ? (
        <div>
          <h3>Your Profile Info</h3>
          <p>
            <strong>Wallet Address:</strong> {userProfile.walletAddress}
          </p>
          <p>
            <strong>Vermin Balance:</strong>
            {formatBalance(userProfile.tokenBalance)}
          </p>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
      <button onClick={handleDisconnect}>Disconnect Wallet</button>
    </div>
  );
};

const NonHolderPage = () => {
  const { disconnect } = useWallet();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Access Denied</h1>
      <p>You do not hold the required tokens to access this content.</p>
      <button onClick={handleDisconnect}>Disconnect Wallet</button>
    </div>
  );
};

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
