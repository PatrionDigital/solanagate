import { useEffect, useState } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import "@/styles/TokenHolderPage.css";
import LoadingSpinner from "./LoadingSpinner";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchVerminData();
        setMarketData(data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load market data");
        console.error("Market data fetch error:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="market-data-container">
        <p>Error loading market data: {error}</p>
      </div>
    );

  if (!marketData)
    return (
      <div className="market-data-container">
        <p>No market data available</p>
      </div>
    );
  /*
  const {
    market_data: {
      current_price,
      price_change_percentage_24h,
      price_change_percentage_7d,
      price_change_percentage_30d,
      market_cap,
      total_volume,
      circulating_supply,
      total_supply,
    },
  } = marketData;*/
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    return value ? `${value.toFixed(2)}%` : "N/A";
  };

  const formatSupply = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const getColorForPercentage = (percentage) => {
    if (!percentage) return "inherit";
    return percentage >= 0 ? "#4caf50" : "#f44336";
  };

  // Calculate the user's holdings in USD
  const tokenBalanceAdjusted = tokenBalance / 1e6; // Remove the last 6 decimals
  const holdingsUsd =
    tokenBalanceAdjusted * parseFloat(marketData?.priceUsd || 0);

  return (
    <div style={{ padding: "20px" }}>
      {/* User Holdings Section */}
      <div className="market-data-section">
        <h3>Your Holdings</h3>
        <div className="data-grid">
          <div>
            <strong>Token Balance:</strong>{" "}
            {formatNumber(tokenBalanceAdjusted, 2)}
          </div>
          <div>
            <strong>Holdings (USD):</strong> ${formatNumber(holdingsUsd, 2)}
          </div>
          <div>
            <strong>HODL Time:</strong> {hodlTime || "N/A"}
          </div>
          <div>
            <strong>Wallet Address:</strong> {walletAddress || "N/A"}
          </div>
        </div>
      </div>

      {/* Value Section */}
      <div className="market-data-section">
        <h3>Value</h3>
        <div className="data-grid">
          <div>
            <strong>Price (USD):</strong> $
            {formatNumber(parseFloat(marketData?.priceUsd))}
          </div>
          <div>
            <strong>Market Cap (USD):</strong> $
            {formatNumber(parseFloat(marketData?.marketCap), 2)}
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="market-data-section">
        <h3>Activity</h3>
        <div className="data-grid">
          <div>
            <strong>24h Volume (USD):</strong> $
            {formatNumber(parseFloat(marketData?.volume?.h24), 2)}
          </div>
          <div>
            <strong>24h Price Change:</strong>{" "}
            {formatNumber(parseFloat(marketData?.priceChange?.h24), 2)}%
          </div>
        </div>
      </div>

      {/* Liquidity Pool Section */}
      <div className="market-data-section">
        <h3>Liquidity Pool</h3>
        <div className="data-grid">
          <div>
            <strong>Liquidity (USD):</strong> $
            {formatNumber(parseFloat(marketData?.liquidity?.usd), 2)}
          </div>
          <div>
            <a
              href={`https://raydium.io/liquidity/increase/?mode=add&pool_id=${marketData?.pairAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#FFD700", textDecoration: "none" }}
            >
              Add to Raydium Liquidity Pool
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerminMarketData;
