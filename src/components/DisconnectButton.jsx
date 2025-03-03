import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletContext } from "@/contexts/WalletContext";
import PropTypes from "prop-types";
import "@/styles/DisconnectButton.css";

const DisconnectButton = ({ onDisconnect }) => {
  const { disconnect } = useWallet();
  const { setIsTokenHolder } = useWalletContext();

  const handleDisconnect = () => {
    // First disconnect the wallet using Solana adapter
    disconnect();

    // Reset token holder status in the context
    if (setIsTokenHolder) {
      setIsTokenHolder(null);
    }

    // Call the onDisconnect callback if provided
    // This should be the clearUserProfile function from UserProfileContext
    if (onDisconnect) {
      onDisconnect();
    }
  };

  return (
    <button className="disconnect-button" onClick={handleDisconnect}>
      Disconnect Wallet
    </button>
  );
};

DisconnectButton.propTypes = {
  onDisconnect: PropTypes.func,
};

DisconnectButton.defaultProps = {
  onDisconnect: undefined,
};

export default DisconnectButton;
