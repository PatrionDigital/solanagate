import { useEffect, useState, useRef } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";

const fetchVerminData = async () => {
  try {
    const response = await fetch(
      "https://api.dexscreener.com/tokens/v1/solana/4fMRncxv5XvsdpAmDxttpjw7pTqPLqKQpyD36jtNpump"
    );
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching Vermin data:", error);
    throw error;
  }
};

const formatNumber = (value, decimals = 8) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return value.toFixed(decimals);
};

const VerminMarketData = () => {
  const [marketData, setMarketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile } = useUserProfile();
  const { hodlTime, tokenBalance, walletAddress } = userProfile || {};
  const isMounted = useRef(true);

  useEffect(() => {
    // Set up isMounted ref to track component mount status
    isMounted.current = true;

    const fetchData = async () => {
      try {
        const data = await fetchVerminData();
        // Only update state if component is still mounted
        if (isMounted.current) {
          setMarketData(data);
          setIsLoading(false);
        }
      } catch (error) {
        // Only update state if component is still mounted
        if (isMounted.current) {
          setError("Failed to load market data");
          console.error("Market data fetch error:", error);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to run when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (isLoading) return <div>Loading market data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Calculate the user's holdings in USD
  const tokenBalanceAdjusted = tokenBalance / 1e6; // Remove the last 6 decimals
  const holdingsUsd =
    tokenBalanceAdjusted * parseFloat(marketData?.priceUsd || 0);

  // Format wallet address for display
  const truncateAddress = (address) => {
    if (!address) return "N/A";
    // For display similar to the screenshot
    return `${address.slice(0, 6)}...${address.slice(-7)}`;
  };

  return (
    <div>
      {/* User Holdings Section */}
      <div className="market-data-section">
        <h3 className="sub-section-heading">Your Holdings</h3>
        <div className="data-grid">
          <div className="data-item">
            <span className="data-label">Token Balance:</span>
            <span className="data-value">
              {formatNumber(tokenBalanceAdjusted, 2)}
            </span>
          </div>
          <div className="data-item">
            <span className="data-label">Holdings (USD):</span>
            <span className="data-value">${formatNumber(holdingsUsd, 2)}</span>
          </div>
          <div className="data-item">
            <span className="data-label">HODL Time:</span>
            <span className="data-value">{hodlTime || "N/A"}</span>
          </div>
          <div className="data-item">
            <span className="data-label">Wallet:</span>
            <span className="data-value">{truncateAddress(walletAddress)}</span>
          </div>
        </div>
      </div>

      {/* Value Section */}
      <div className="market-data-section">
        <h3 className="sub-section-heading">Value</h3>
        <div className="data-grid">
          <div className="data-item">
            <span className="data-label">Price (USD):</span>
            <span className="data-value">
              ${formatNumber(parseFloat(marketData?.priceUsd))}
            </span>
          </div>
          <div className="data-item">
            <span className="data-label">Market Cap (USD):</span>
            <span className="data-value">
              ${formatNumber(parseFloat(marketData?.marketCap), 2)}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="market-data-section">
        <h3 className="sub-section-heading">Activity</h3>
        <div className="data-grid">
          <div className="data-item">
            <span className="data-label">24h Volume (USD):</span>
            <span className="data-value">
              ${formatNumber(parseFloat(marketData?.volume?.h24), 2)}
            </span>
          </div>
          <div className="data-item">
            <span className="data-label">24h Price Change:</span>
            <span
              className={`data-value ${
                parseFloat(marketData?.priceChange?.h24) >= 0
                  ? "positive-change"
                  : "negative-change"
              }`}
            >
              {formatNumber(parseFloat(marketData?.priceChange?.h24), 2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Liquidity Pool Section */}
      <div className="market-data-section">
        <h3 className="sub-section-heading">Liquidity Pool</h3>
        <div className="data-grid">
          <div className="data-item">
            <span className="data-label">Liquidity (USD):</span>
            <span className="data-value">
              ${formatNumber(parseFloat(marketData?.liquidity?.usd), 2)}
            </span>
          </div>
        </div>
        <a
          href={`https://raydium.io/liquidity/increase/?mode=add&pool_id=${marketData?.pairAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="token-action-button"
        >
          Add to Raydium Liquidity Pool
        </a>
      </div>
    </div>
  );
};

export default VerminMarketData;
