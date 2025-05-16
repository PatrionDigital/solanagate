import { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from 'prop-types';
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@windmill/react-ui";

import TOKEN_CONFIG from "@/config/token";
import { fetchPriceHistory, formatPriceData, calculatePriceChange } from "@/utils/priceHistory";

const fetchTokenData = async () => {
  try {
    const response = await fetch(
      `${TOKEN_CONFIG.DEXSCREENER_API}/${TOKEN_CONFIG.TOKEN_ADDRESS}`
    );
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error(`Error fetching ${TOKEN_CONFIG.TOKEN_SYMBOL} data:`, error);
    throw error;
  }
};

const formatNumber = (value, decimals = 8) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return value.toFixed(decimals);
};


const TokenMarketData = () => {
  const [marketData, setMarketData] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [priceChange, setPriceChange] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile } = useUserProfile();
  const { hodlTime, tokenBalance, walletAddress, isAdmin } = userProfile || {};
  const isMounted = useRef(true);

  // Fetch price history data
  const fetchPriceData = useCallback(async (timeRange) => {
    try {
      const data = await fetchPriceHistory(timeRange);
      if (data && isMounted.current) {
        const formattedData = formatPriceData(data);
        setPriceHistory(formattedData);
        
        // Only calculate price change if we have enough data points
        if (formattedData.length >= 2) {
          setPriceChange(calculatePriceChange(formattedData));
        } else if (formattedData.length === 1) {
          // If we only have one data point, use it as both start and end
          setPriceChange(0);
        } else {
          setPriceChange(0);
        }
      }
    } catch (error) {
      console.error('Error fetching price history:', error);
      // Don't fail the whole component if price history fails
      if (isMounted.current) {
        setPriceHistory([]);
        setPriceChange(0);
      }
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [marketDataResponse] = await Promise.all([
        fetchTokenData(),
        fetchPriceData(selectedTimeRange)
      ]);

      if (isMounted.current) {
        setMarketData(marketDataResponse);
        setIsLoading(false);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Error fetching data:", error);
        setError("Failed to load market data");
        setIsLoading(false);
      }
    }
  }, [fetchPriceData, selectedTimeRange]);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    fetchPriceData(range);
  };

  // Format price change with sign and color
  const formatPriceChange = (change) => {
    if (change === 0) return '0.00%';
    const sign = change > 0 ? '+' : '';
    const color = change >= 0 ? 'text-green-500' : 'text-red-500';
    return <span className={color}>{sign}{change.toFixed(2)}%</span>;
  };

  useEffect(() => {
    // Set up isMounted ref to track component mount status
    isMounted.current = true;
    
    fetchAllData();

    // Cleanup function to run when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, [fetchAllData]);

  if (isLoading) return <div>Loading market data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Calculate the user's holdings in USD
  const tokenBalanceAdjusted = tokenBalance / 1e6; // Remove the last 6 decimals
  const holdingsUsd =
    tokenBalanceAdjusted * parseFloat(marketData?.priceUsd || 0);

  // Format addresses for display
  const truncateAddress = (address, start = 6, end = 7) => {
    if (!address) return "N/A";
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };

  // Create a Card component for consistent styling
  const MarketCard = ({ title, children, className = '' }) => (
    <div className={`bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg h-full ${className}`}>
      {title && <h3 className="text-gold text-sm sm:text-base font-bold mb-3">{title}</h3>}
      <div className="h-full">
        {children}
      </div>
    </div>
  );
  
  // Add prop types for the MarketCard component
  MarketCard.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (!marketData) {
    return <div className="text-center text-gray-400 py-4">No market data available</div>;
  }

  // Time range options for price history
  const timeRanges = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
  ];

  return (
    <div className="p-2 sm:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Price History Card */}
        <MarketCard title="Price History" className="md:col-span-2">
          <div className="mb-4 flex justify-end space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleTimeRangeChange(range.value)}
                className={`px-3 py-1 text-xs sm:text-sm rounded-md ${
                  selectedTimeRange === range.value
                    ? 'bg-gold text-black font-bold'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <div className="h-64 flex flex-col bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-2xl font-bold">
                  ${formatNumber(parseFloat(marketData?.priceUsd || 0), 6)}
                </div>
                <div className="text-sm text-gray-400">
                  {TOKEN_CONFIG.TOKEN_SYMBOL} / USD
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg">
                  {formatPriceChange(priceChange)}
                </div>
                <div className="text-xs text-gray-400">
                  {selectedTimeRange.toUpperCase()} Change
                </div>
              </div>
            </div>
            
            <div className="flex-1 mt-4">
              {priceHistory && priceHistory.length > 0 ? (
                <div className="h-full">
                  {/* Chart will be rendered here */}
                  <div className="h-40 bg-gray-800 rounded flex flex-col items-center justify-center text-gray-500">
                    <div className="text-sm mb-2">Price Chart ({selectedTimeRange})</div>
                    <div className="text-xs text-gray-600">
                      {priceHistory.length} data points loaded
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(priceHistory[0]?.time).toLocaleString()} - {new Date(priceHistory[priceHistory.length - 1]?.time).toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No price data available
                </div>
              )}
            </div>
            
            {priceHistory && priceHistory.length > 0 && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                Data provided by Solana Tracker
              </div>
            )}
          </div>
        </MarketCard>

        {/* User Holdings Card */}
        <MarketCard title="Your Holdings">
          <div className="overflow-x-auto">
            <TableContainer className="border border-gray-700 rounded-lg min-w-full">
              <Table className="min-w-full">
                <TableBody>
                  <TableRow className="border-t border-gray-700">
                    <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-2 sm:py-2">Token Balance</TableCell>
                    <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-2 sm:py-2">
                      <div className="flex items-center justify-center">
                        {formatNumber(tokenBalanceAdjusted, 2)}
                        {isAdmin && (
                          <span className="ml-1 sm:ml-2 bg-gold text-black text-[9px] sm:text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded">
                            ADMIN
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t border-gray-700">
                    <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-2 sm:py-2">Holdings (USD)</TableCell>
                    <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-2 sm:py-2">${formatNumber(holdingsUsd, 2)}</TableCell>
                  </TableRow>
                  <TableRow className="border-t border-gray-700">
                    <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-2 sm:py-2">HODL Time</TableCell>
                    <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-2 sm:py-2">{hodlTime || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow className="border-t border-gray-700">
                    <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-2 sm:py-2">Wallet</TableCell>
                    <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-2 sm:py-2">
                      <span className="font-mono">{truncateAddress(walletAddress)}</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </MarketCard>

          {/* Value Card */}
          <MarketCard title="Value">
            <div className="overflow-x-auto">
              <TableContainer className="border border-gray-700 rounded-lg min-w-full">
                <Table className="min-w-full">
                  <TableBody>
                    <TableRow className="border-t border-gray-700">
                      <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-2 sm:py-2">Price (USD)</TableCell>
                      <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-2 sm:py-2">${formatNumber(parseFloat(marketData?.priceUsd))}</TableCell>
                    </TableRow>
                    <TableRow className="border-t border-gray-700">
                      <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-2 sm:py-2">Market Cap (USD)</TableCell>
                      <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-2 sm:py-2">${formatNumber(parseFloat(marketData?.marketCap), 2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </MarketCard>

          {/* Activity Card */}
          <MarketCard title="Activity">
            <div className="overflow-x-auto">
              <TableContainer className="border border-gray-700 rounded-lg min-w-full">
                <Table className="min-w-full">
                  <TableBody>
                    <TableRow className="border-t border-gray-700">
                      <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-3 sm:py-2">Change (24h)</TableCell>
                      <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-3 sm:py-2">
                        <span
                          className={`font-medium ${
                            parseFloat(marketData?.priceChange?.h24) >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {formatNumber(parseFloat(marketData?.priceChange?.h24), 2)}%
                        </span>
                      </TableCell>
                    </TableRow>
                    {marketData?.txns?.h24 && (
                      <TableRow className="border-t border-gray-700">
                        <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-3 sm:py-2">
                          Trades (24h)
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-3 sm:py-2">
                          <div className="flex flex-col items-center">
                            <div className="flex justify-center space-x-3 sm:space-x-4 mb-1">
                              <span className="text-green-400">B</span>
                              <span className="text-red-400">S</span>
                              <span className="text-blue-400">T</span>
                            </div>
                            <div className="flex justify-center space-x-3 sm:space-x-4 font-mono">
                              <span>{marketData.txns.h24.buys || 0}</span>
                              <span>{marketData.txns.h24.sells || 0}</span>
                              <span>{(marketData.txns.h24.buys || 0) + (marketData.txns.h24.sells || 0)}</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {marketData?.volume?.h24 && (
                      <TableRow className="border-t border-gray-700">
                        <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-3 sm:py-2">Volume (24h)</TableCell>
                        <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-3 sm:py-2">${formatNumber(marketData.volume.h24, 2)}</TableCell>
                      </TableRow>
                    )}
                    <TableRow className="border-t border-gray-700">
                      <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-2 sm:py-2">Volume (7d)</TableCell>
                      <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-2 sm:py-2">
                        ${marketData?.volume?.h7d ? formatNumber(parseFloat(marketData.volume.h7d), 2) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </MarketCard>

          {/* Liquidity Pool Card */}
          <MarketCard title="Liquidity Pool">
            <div className="overflow-x-auto">
              <TableContainer className="border border-gray-700 rounded-lg min-w-full">
                <Table className="min-w-full">
                  <TableBody>
                    <TableRow className="border-t border-gray-700">
                      <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-3 sm:py-2">Total Liquidity</TableCell>
                      <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-3 sm:py-2">${formatNumber(marketData?.liquidity?.usd, 2)}</TableCell>
                    </TableRow>
                    {marketData?.liquidity?.base && marketData?.baseToken?.symbol && (
                      <TableRow className="border-t border-gray-700">
                        <TableCell className="text-xs sm:text-sm text-left font-medium text-gray-300 px-1.5 py-1.5 sm:px-3 sm:py-2">
                          <div>Base Token</div>
                          <div className="text-gray-400 text-xs">({marketData.baseToken.symbol})</div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-right font-mono px-1.5 py-1.5 sm:px-3 sm:py-2">
                          {formatNumber(parseFloat(marketData.liquidity.base), 2)}
                        </TableCell>
                      </TableRow>
                    )}
                    {marketData?.liquidity?.quote && marketData?.quoteToken?.symbol && (
                      <TableRow className="border-t border-gray-700">
                        <TableCell className="text-xs sm:text-sm text-left font-medium text-gray-300 px-1.5 py-1.5 sm:px-3 sm:py-2">
                          <div>Quote Token</div>
                          <div className="text-gray-400 text-xs">({marketData.quoteToken.symbol})</div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-right font-mono px-1.5 py-1.5 sm:px-3 sm:py-2">
                          {formatNumber(parseFloat(marketData.liquidity.quote), 2)}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <a
              href={`https://raydium.io/liquidity/increase/?mode=add&pool_id=${marketData?.pairAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 sm:mt-3 flex justify-center px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-gold text-black font-semibold shadow hover:bg-gold/80 focus:bg-gold/90 focus:outline-none transition"
            >
              Add to Raydium LP
            </a>
          </MarketCard>

          {/* Contract Addresses Card */}
          <MarketCard title="Contract Addresses">
            <div className="overflow-x-auto">
              <TableContainer className="border border-gray-700 rounded-lg min-w-full">
                <Table className="min-w-full">
                  <TableBody>
                    <TableRow className="border-t border-gray-700">
                      <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-3 sm:py-2">Token Address</TableCell>
                      <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-3 sm:py-2">
                        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                          <span className="truncate max-w-[120px] sm:max-w-none text-xs sm:text-sm font-mono" title={import.meta.env.VITE_TOKEN_MINT_ADDRESS}>
                            {truncateAddress(import.meta.env.VITE_TOKEN_MINT_ADDRESS, 6, 4)}
                          </span>
                          <a 
                            href={`https://solscan.io/token/${import.meta.env.VITE_TOKEN_MINT_ADDRESS}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-gold hover:text-yellow-400 transition-colors"
                            title="View on Solscan"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-t border-gray-700">
                      <TableCell className="text-xs sm:text-sm text-center font-medium text-gray-300 px-1.5 py-1.5 sm:px-3 sm:py-2">Liquidity Pool</TableCell>
                      <TableCell className="text-xs sm:text-sm text-center px-1.5 py-1.5 sm:px-3 sm:py-2">
                        {marketData?.pairAddress ? (
                          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                            <span className="truncate max-w-[120px] sm:max-w-none text-[10px] sm:text-xs font-mono" title={marketData.pairAddress}>
                              {truncateAddress(marketData.pairAddress, 6, 4)}
                            </span>
                            <a 
                              href={`https://solscan.io/account/${marketData.pairAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 text-gold hover:text-yellow-400 transition-colors"
                              title="View on Solscan"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                            </a>
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </MarketCard>
      </div>
    </div>
  );
};

export default TokenMarketData;
