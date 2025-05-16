import { TOKEN_CONFIG } from '@/config/token';

// Map time range to API parameters
const TIME_RANGE_MAPPING = {
  '24h': '24h',
  '7d': '7d',
  '30d': '30d',
};

/**
 * Fetches price history for the specified token
 * @param {string} tokenAddress - The token address to fetch price history for
 * @param {string} timeRange - The time range to fetch (e.g., '24h', '7d', '30d')
 * @returns {Promise<Object>} - Object containing price history data
 */
/**
 * Fetches price history for the configured token
 * @param {string} [timeRange='24h'] - The time range to fetch (e.g., '24h', '7d', '30d')
 * @returns {Promise<Object>} - Object containing price history data
 */
export async function fetchPriceHistory(timeRange = '24h') {
  const { TOKEN_ADDRESS, TOKEN_SYMBOL, DEBUG } = TOKEN_CONFIG;
  const apiKey = import.meta.env.VITE_SOLANA_TRACKER_API_KEY;
  
  // Use the configured token address
  const tokenAddress = TOKEN_ADDRESS;
  
  if (DEBUG) {
    console.log('Fetching price for token:', {
      address: tokenAddress,
      symbol: TOKEN_SYMBOL,
      timeRange: timeRange,
      hasApiKey: !!apiKey
    });
  }
  
  // Validate time range
  if (!TIME_RANGE_MAPPING[timeRange]) {
    throw new Error(`Invalid time range. Must be one of: ${Object.keys(TIME_RANGE_MAPPING).join(', ')}`);
  }

  // Validate API key and token address
  if (!apiKey) {
    const errorMsg = 'Solana Tracker API key is not configured. Please set VITE_SOLANA_TRACKER_API_KEY in your .env file.';
    console.warn(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    if (DEBUG) {
      console.log(`Fetching price history for token: ${tokenAddress}, range: ${timeRange}`);
      console.log('Using API Key:', '***REDACTED***');
    }
    
    // Use the Data API endpoint for price history
    const url = new URL('https://data.solanatracker.io/price/history');
    
    // Add required query parameter
    url.searchParams.append('token', tokenAddress);
    
    // The API returns multiple timeframes by default
    
    // Set up headers with API key
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    // Add API key header if available
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    } else if (DEBUG) {
      console.warn('No API key found. Requests may be rate limited.');
    }

    if (DEBUG) {
      console.log('Request URL:', url.toString());
      console.log('Request headers:', headers);
    }

    // Log request details in debug mode
    if (DEBUG) {
      console.log('Sending request to:', url.toString());
      console.log('Using token address:', tokenAddress);
      console.log('API Key present:', !!apiKey);
      console.log('Request headers:', {
        ...headers,
        'x-api-key': headers['x-api-key'] ? '***REDACTED***' : 'MISSING'
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });
    
    if (DEBUG) {
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
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
      const errorMessage = data?.message || data?.error || `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }
    
    // The API returns data in the format: { current: 0.0015, 7d: 0.0012, ... }
    return data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
};

/**
 * Formats price history data for charting
 * @param {Array<Object>} priceData - Raw price history data from the API
 * @returns {Array<{time: number, price: number}>} Formatted price data
 */
export const formatPriceData = (priceData) => {
  if (!priceData || !Array.isArray(priceData)) {
    return [];
  }

  // Sort by timestamp in ascending order and format for charting
  return priceData
    .map(entry => {
      // The API returns timestamps in seconds, convert to milliseconds
      const timestamp = entry.timestamp ? entry.timestamp * 1000 : Date.now();
      return {
        time: new Date(timestamp).getTime(),
        price: parseFloat(entry.price || 0)
      };
    })
    .sort((a, b) => a.time - b.time);
};

/**
 * Calculates price change percentage
 * @param {Array<{price: number}>} priceData - Formatted price data
 * @returns {number} Price change percentage
 */
export const calculatePriceChange = (priceData) => {
  if (!priceData || priceData.length < 2) {
    return 0;
  }

  const firstPrice = priceData[0].price;
  const lastPrice = priceData[priceData.length - 1].price;
  return ((lastPrice - firstPrice) / firstPrice) * 100;
};
