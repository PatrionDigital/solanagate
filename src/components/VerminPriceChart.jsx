import { useState } from "react";

const VerminPriceChart = () => {
  const [showSwaps, setShowSwaps] = useState(false);

  const toggleSwaps = () => {
    setShowSwaps((prev) => !prev);
  };

  return (
    <>
      <h3>Vermin Price Chart</h3>
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={showSwaps}
            onChange={toggleSwaps}
            style={{ marginRight: "8px" }}
          />
          Show Swaps
        </label>
      </div>
      <iframe
        style={{
          height: "600px",
          width: "100%",
          maxWidth: "800px",
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
    </>
  );
};

export default VerminPriceChart;
