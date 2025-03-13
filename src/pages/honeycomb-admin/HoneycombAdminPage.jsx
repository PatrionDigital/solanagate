import { useState } from "react";
import { useWalletContext } from "@/contexts/WalletContext";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AdminAuth from "./AdminAuth.jsx";
import HoneycombDashboard from "./HoneycombDashboard";
import LoadingSpinner from "@/components/LoadingSpinner";

// Wallet Connect component
const WalletConnect = () => {
  const { publicKey, connected, disconnect } = useWalletContext();

  const handleDisconnect = () => {
    disconnect();

    // Use a more direct approach to ensure disconnection
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
    }
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    const addressStr = address.toString();
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {!connected ? (
        <div className="connect-prompt">
          <p>Connect wallet to access admin features</p>
          <WalletMultiButton />
        </div>
      ) : (
        <div className="wallet-info">
          <div className="address">
            <span className="label">Connected:</span>
            <span className="value">{truncateAddress(publicKey)}</span>
          </div>
          <button className="disconnect-button" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

// Main Honeycomb Admin Page Component
export const HoneycombAdminPage = () => {
  const { connected } = useWalletContext();
  const [isLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthChange = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  return (
    <div className="honeycomb-admin-page">
      <div className="admin-header">
        <div className="header-title">
          <h1>Vermin Game Admin Panel</h1>
          <p className="description">
            Manage on-chain game parameters and assets for the Vermin project.
          </p>
        </div>
        <div className="header-wallet">
          <WalletConnect />
        </div>
      </div>

      {!connected ? (
        <div className="connect-wallet-prompt">
          <div className="prompt-content">
            <h2>Connect Your Wallet</h2>
            <p>
              Please connect your Solana wallet to access the Honeycomb Protocol
              admin features.
            </p>
          </div>
        </div>
      ) : (
        <AdminAuth onAuthChange={handleAuthChange}>
          {isLoading ? (
            <LoadingSpinner message="Loading Honeycomb data..." />
          ) : (
            isAuthenticated && <HoneycombDashboard />
          )}
        </AdminAuth>
      )}
    </div>
  );
};
