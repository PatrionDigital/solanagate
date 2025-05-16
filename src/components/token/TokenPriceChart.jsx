import { useState } from "react";

const VerminPriceChart = () => {
  const [showSwaps, setShowSwaps] = useState(false);

  const toggleSwaps = () => {
    setShowSwaps((prev) => !prev);
  };

  // Calculate appropriate height based on screen size
  const getIframeHeight = () => {
    // We'll use CSS media queries for most sizing
    // but we can still use window.innerWidth directly for precise height control
    if (window.innerWidth <= 400) {
      return "400px";
    } else if (window.innerWidth <= 768) {
      return "450px";
    }
    return "600px";
  };

  return (
    <div>
      <div className="chart-container">
        <iframe
          style={{
            height: getIframeHeight(),
            width: "100%",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "15px"
          }}
          id="geckoterminal-embed"
          title="GeckoTerminal Embed"
          src={`https://www.geckoterminal.com/solana/pools/CnGwpjbztuNLbTS957nuULNNWZq9uWZ8j4ukNma9vK7F?embed=1&info=0&swaps=${
            showSwaps ? 1 : 0
          }&grayscale=0&light_chart=0&chart_type=price&resolution=15m`}
          frameBorder="0"
          allow="clipboard-write"
          allowFullScreen
        />
      </div>
      
      <div className="flex justify-center">
        <div className="data-item">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "white",
            }}
          >
            <input
              type="checkbox"
              checked={showSwaps}
              onChange={toggleSwaps}
              style={{ marginRight: "10px", width: "18px", height: "18px" }}
            />
            <span style={{ fontSize: "18px" }}>Show Swaps</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default VerminPriceChart;
