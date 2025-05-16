import { useState, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import PropTypes from "prop-types";

function CustomWalletButton() {
  const { setVisible, visible } = useWalletModal();
  const { connected, publicKey, disconnect } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const formattedAddress = useMemo(() => {
    if (!connected || !publicKey) return "Connect Wallet";
    const address = publicKey.toBase58();
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, [connected, publicKey]);

  const handleClick = () => {
    if (connected) {
      setShowDropdown(!showDropdown);
    } else {
      setVisible(!visible);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={handleClick}
        style={{
          padding: "10px 20px",
          borderRadius: connected
            ? showDropdown
              ? "5px 5px 0 0"
              : "5px"
            : "5px",
          backgroundColor: connected ? "#2ecc71" : "#512da8",
          color: "white",
          border: "none",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
          width: "100%",
          outline: "none",
        }}
      >
        {formattedAddress}
        {connected && (
          <span
            style={{
              marginLeft: "8px",
              display: "inline-block",
              transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            ▼
          </span>
        )}
      </button>

      {connected && showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#2ecc71",
            borderRadius: "0 0 5px 5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
            style={{
              padding: "8px 16px",
              width: "100%",
              textAlign: "left",
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.3s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#ff4444";
              e.target.style.color = "black";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "white";
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

CustomWalletButton.propTypes = {
  className: PropTypes.string,
};

CustomWalletButton.defaultProps = {
  className: "",
};

export default CustomWalletButton;
