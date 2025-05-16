import { TOKEN_CONFIG } from '@/config/token';

// Map time range to API parameters
const TIME_RANGE_MAPPING = {
  '24h': '24h',
  '7d': '7d',
  '30d': '30d',
};

// Get API configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_SOLANA_TRACKER_API_URL || 'https://api.solanatracker.io';
const API_KEY = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;

/**
 * Fetches price history for the configured token
 * @param {string} [timeRange='24h'] - The time range to fetch (e.g., '24h', '7d', '30d')
 * @returns {Promise<Object>} - Object containing price history data
 */
async function fetchPriceHistory(timeRange = '24h') {
  const { TOKEN_ADDRESS, TOKEN_SYMBOL, DEBUG } = TOKEN_CONFIG;
  
  if (DEBUG) {
    console.log('Fetching price for token:', {
      address: TOKEN_ADDRESS,
      symbol: TOKEN_SYMBOL,
      timeRange,
      apiBaseUrl: API_BASE_URL,
      hasApiKey: !!API_KEY
    });
  }
  
  // Validate time range
  if (!TIME_RANGE_MAPPING[timeRange]) {
    throw new Error(`Invalid time range. Must be one of: ${Object.keys(TIME_RANGE_MAPPING).join(', ')}`);
  }

  // Validate API key and token address
  if (!API_KEY) {
    const errorMsg = 'Solana Tracker API key is not configured. Please set VITE_SOLANA_TRACKER_API_KEY in your .env file.';
    console.warn(errorMsg);
    throw new Error(errorMsg);
  }

  if (!TOKEN_ADDRESS) {
    const errorMsg = 'Token address is not configured. Please set VITE_TOKEN_MINT_ADDRESS in your .env file.';
    console.warn(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    // Construct the API URL
    const url = new URL(`${API_BASE_URL}/price/history`);
    url.searchParams.append('token', TOKEN_ADDRESS);

    // Set up headers with API key
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    };

    if (DEBUG) {
      console.log('Sending request to:', url.toString());
      console.log('Using token address:', TOKEN_ADDRESS);
      console.log('API Key present:', !!API_KEY);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer'
    });
    
    if (DEBUG) {
      console.log('Response status:', response.status);
    }

    let data;
    try {
      data = await response.json();
      if (DEBUG) {
        console.log('Price history response:', data);
      }
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      const text = await response.text();
      console.error('Response text:', text);
      throw new Error(`Failed to parse response: ${text}`);
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || 
                         `API request failed with status ${response.status}`;
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Format the response to match the expected format
    return {
      current: data.current,
      '24h': data['24h'],
      '7d': data['7d'],
      '30d': data['30d'],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
};

/**
 * Formats price history data for charting
 * @param {Object} priceData - Raw price history data from the API
 * @param {string} timeRange - The time range to format data for (e.g., '24h', '7d', '30d')
 * @returns {Array<{time: number, price: number}>} Formatted price data
 */
function formatPriceData(priceData, timeRange = '24h') {
  if (!priceData) {
    console.warn('No price data provided');
    return [];
  }

  // Get the current price and historical price for the selected time range
  const currentPrice = parseFloat(priceData.current || 0);
  const historicalPrice = parseFloat(priceData[timeRange] || 0);
  
  if (isNaN(currentPrice) || isNaN(historicalPrice)) {
    console.warn('Invalid price data format:', priceData);
    return [];
  }

  // Create two data points: historical and current
  const now = new Date();
  const historicalDate = new Date();
  
  // Set the historical date based on the time range
  const daysAgo = parseInt(timeRange) || 1;
  historicalDate.setDate(now.getDate() - daysAgo);
  
  return [
    {
      time: Math.floor(historicalDate.getTime() / 1000),
      price: historicalPrice
    },
    {
      time: Math.floor(now.getTime() / 1000),
      price: currentPrice
    }
  ];
}

/**
 * Calculates price change percentage
 * @param {Object} priceData - Price data object with current and historical prices
 * @param {string} timeRange - The time range to calculate change for (e.g., '24h', '7d', '30d')
 * @returns {number} Price change percentage
 */
function calculatePriceChange(priceData, timeRange = '24h') {
  if (!priceData) return 0;
  
  const currentPrice = parseFloat(priceData.current || 0);
  const historicalPrice = parseFloat(priceData[timeRange] || 0);
  
  if (isNaN(currentPrice) || isNaN(historicalPrice) || historicalPrice === 0) {
    return 0;
  }
  
  return ((currentPrice - historicalPrice) / historicalPrice) * 100;
}

export {
  fetchPriceHistory,
  formatPriceData,
  calculatePriceChange
};
