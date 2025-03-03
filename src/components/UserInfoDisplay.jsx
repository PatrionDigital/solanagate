import { useUserProfile } from "@/contexts/UserProfileContext";
import DisconnectButton from "@/components/DisconnectButton";
import PropTypes from "prop-types";
import "@/styles/UserInfoDisplay.css";

const UserInfoDisplay = ({ className }) => {
  const { userProfile } = useUserProfile();

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
        </span>
      </div>

      <div className="user-info-item">
        <span className="user-info-label">Hodl Time:</span>
        <span className="user-info-value">{userProfile.hodlTime || "N/A"}</span>
      </div>

      <hr className="user-info-divider" />

      <div className="disconnect-button-container">
        <DisconnectButton />
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
