import { useWallet } from "@solana/wallet-adapter-react";
import "@/styles/DisconnectButton.css";

const DisconnectButton = () => {
  const { disconnect } = useWallet();

  return (
    <button className="disconnect-button" onClick={disconnect}>
      Disconnect Wallet
    </button>
  );
};

export default DisconnectButton;
