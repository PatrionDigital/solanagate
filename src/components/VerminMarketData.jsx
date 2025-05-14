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
  const { hodlTime, tokenBalance, walletAddress, isAdmin } = userProfile || {};
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
        <h3 className="sub-section-heading text-gold text-lg font-bold mb-2">Your Holdings</h3>
        <table className="w-full text-white mb-6">
          <tbody>
            <tr>
              <td className="py-1 pr-4 font-medium">Token Balance:</td>
              <td className="py-1">
                {formatNumber(tokenBalanceAdjusted, 2)}
                {isAdmin && (
                  <span
                    style={{
                      marginLeft: "8px",
                      backgroundColor: "#d4af37",
                      color: "black",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td className="py-1 pr-4 font-medium">Holdings (USD):</td>
              <td className="py-1">${formatNumber(holdingsUsd, 2)}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 font-medium">HODL Time:</td>
              <td className="py-1">{hodlTime || "N/A"}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 font-medium">Wallet:</td>
              <td className="py-1">{truncateAddress(walletAddress)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Value Section */}
      <div className="market-data-section">
        <h3 className="sub-section-heading text-gold text-lg font-bold mb-2">Value</h3>
        <table className="w-full text-white mb-6">
          <tbody>
            <tr>
              <td className="py-1 pr-4 font-medium">Price (USD):</td>
              <td className="py-1">${formatNumber(parseFloat(marketData?.priceUsd))}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 font-medium">Market Cap (USD):</td>
              <td className="py-1">${formatNumber(parseFloat(marketData?.marketCap), 2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Activity Section */}
      <div className="market-data-section">
        <h3 className="sub-section-heading text-gold text-lg font-bold mb-2">Activity</h3>
        <table className="w-full text-white mb-6">
          <tbody>
            <tr>
              <td className="py-1 pr-4 font-medium">24h Volume (USD):</td>
              <td className="py-1">${formatNumber(parseFloat(marketData?.volume?.h24), 2)}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 font-medium">24h Price Change:</td>
              <td className="py-1">
                <span
                  className={`data-value ${
                    parseFloat(marketData?.priceChange?.h24) >= 0
                      ? "positive-change"
                      : "negative-change"
                  }`}
                >
                  {formatNumber(parseFloat(marketData?.priceChange?.h24), 2)}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Liquidity Pool Section */}
      <div className="market-data-section">
        <h3 className="sub-section-heading text-gold text-lg font-bold mb-2">Liquidity Pool</h3>
        <div className="data-grid">
          <div className="data-item">
            <span className="data-label text-white">Liquidity (USD):</span>
            <span className="data-value text-white">${formatNumber(parseFloat(marketData?.liquidity?.usd), 2)}</span>
          </div>
        </div>
        <a
          href={`https://raydium.io/liquidity/increase/?mode=add&pool_id=${marketData?.pairAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-5 py-2 rounded-lg bg-gold text-black font-semibold shadow hover:bg-gold/80 focus:bg-gold/90 focus:outline-none transition"
        >
          Add to Raydium Liquidity Pool
        </a>
      </div>
    </div>
  );
};

export default VerminMarketData;
