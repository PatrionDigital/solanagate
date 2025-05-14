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
    <button
      className="bg-transparent border border-gold/40 text-gold px-4 py-2 rounded-lg font-semibold hover:bg-gold/10 focus:bg-gold/20 focus:ring-2 focus:ring-gold/30 transition"
      onClick={handleDisconnect}
      type="button"
    >
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
