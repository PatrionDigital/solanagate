import { useEffect, useState } from "react";
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

  if (isLoading) return <div>Loading market data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Calculate the user's holdings in USD
  const tokenBalanceAdjusted = tokenBalance / 1e6; // Remove the last 6 decimals
  const holdingsUsd =
    tokenBalanceAdjusted * parseFloat(marketData?.priceUsd || 0);

  return (
    <div style={{ padding: "20px" }}>
      {/* User Holdings Section */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Your Holdings</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
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
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Value</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
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
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Activity</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
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
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Liquidity Pool</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
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
