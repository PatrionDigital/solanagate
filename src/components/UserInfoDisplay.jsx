import { useUserProfile } from "@/contexts/UserProfileContext";
import { useWalletContext } from "@/contexts/WalletContext";
import DisconnectButton from "@/components/DisconnectButton";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "@/styles/UserInfoDisplay.css";

const UserInfoDisplay = ({ className }) => {
  const { userProfile, clearUserProfile } = useUserProfile();
  const { disconnect } = useWalletContext();

  const formatBalance = (balance) => {
    const numericBalance = parseFloat(balance);
    if (!isNaN(numericBalance)) {
      return (numericBalance / 10 ** 6).toFixed(2);
    }
    return "0";
  };

  const truncateAddress = (address) => {
    if (address && address.length > 10) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return address;
  };

  const copyToClipboard = (address) => {
    if (address) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          alert("Address copied to clipboard");
        })
        .catch((error) => {
          console.error("Failed to copy address", error);
        });
    }
  };

  // Handle disconnect with proper cleanup
  const handleDisconnect = () => {
    // First disconnect the wallet
    disconnect();
    // Then clear the user profile
    clearUserProfile();
  };

  // Check wallet connection status before showing loading message
  const { connected } = useWalletContext();

  if (!connected) {
    return <p>Wallet not connected</p>;
  }

  if (!userProfile) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className={`user-info-container ${className || ""}`}>
      <h3 className="user-info-title">User Profile</h3>

      <div className="user-info-item">
        <span className="user-info-label">Wallet:</span>
        <span
          className="user-info-address"
          title={userProfile.walletAddress}
          onClick={() => copyToClipboard(userProfile.walletAddress)}
        >
          {truncateAddress(userProfile.walletAddress || "N/A")}
        </span>
      </div>

      <div className="user-info-item">
        <span className="user-info-label">Token Balance:</span>
        <span className="user-info-value">
          {formatBalance(userProfile.tokenBalance || 0)}
          {userProfile.isAdmin && (
            <span
              style={{
                marginLeft: "8px",
                backgroundColor: "#d4af37",
                color: "black",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              ADMIN
            </span>
          )}
        </span>
      </div>

      <div className="user-info-item">
        <span className="user-info-label">Hodl Time:</span>
        <span className="user-info-value">{userProfile.hodlTime || "N/A"}</span>
      </div>

      <hr className="user-info-divider" />

      <div className="disconnect-button-container">
        {userProfile.isAdmin && (
          <Link 
            to="/admin" 
            className="admin-panel-link"
            onClick={(e) => {
              e.stopPropagation();
              // Close the account menu
              document.dispatchEvent(new CustomEvent('close-account-menu'));
            }}
          >
            Admin Panel
          </Link>
        )}
        <DisconnectButton onDisconnect={handleDisconnect} />
      </div>
    </div>
  );
};

UserInfoDisplay.propTypes = {
  className: PropTypes.string,
};

UserInfoDisplay.defaultProps = {
  className: "",
};

export default UserInfoDisplay;
