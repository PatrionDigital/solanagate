import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";

const DisconnectButton = () => {
  const { disconnect } = useWallet();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };

  return (
    <button onClick={handleDisconnect} style={{ marginTop: "20px" }}>
      Disconnect Wallet
    </button>
  );
};

export default DisconnectButton;
