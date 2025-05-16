// Token configuration
// These values can be overridden using environment variables prefixed with VITE_


/**
 * Get an environment variable with a fallback value
 * @param {string} key - The full environment variable key (including VITE_ prefix)
 * @param {string|number|boolean} [defaultValue=''] - Default value if the environment variable is not set
 * @returns {string|number|boolean} The environment variable value or the default value
 */
const getEnv = (key, defaultValue = '') => {
  const value = import.meta.env[key];
  return value !== undefined ? value : defaultValue;
};

// Debug: Log environment variables
console.log('Environment Variables:', {
  VITE_SOLANA_RPC_URL: getEnv('VITE_SOLANA_RPC_URL'),
  VITE_SOLANA_TRACKER_API_KEY: getEnv('VITE_SOLANA_TRACKER_API_KEY') ? '***REDACTED***' : 'NOT SET',
  VITE_TOKEN_MINT_ADDRESS: getEnv('VITE_TOKEN_MINT_ADDRESS'),
  VITE_DEBUG: getEnv('VITE_DEBUG'),
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV
});

// Default values for the token configuration
const DEFAULT_CONFIG = {
  // Token details
  TOKEN_ADDRESS: getEnv('VITE_TOKEN_MINT_ADDRESS', 'YOUR_TOKEN_MINT_ADDRESS'),
  TOKEN_SYMBOL: 'TOKEN',
  TOKEN_NAME: 'Your Token',
  TOKEN_DECIMALS: 9,
  TOKEN_LOGO_URL: '/img/token-logo.png',
  
  // API endpoints
  DEXSCREENER_API: 'https://api.dexscreener.com/tokens/v1/solana',
  
  // Solana Tracker Configuration
  SOLANA_TRACKER_API_URL: 'https://api.solanatracker.io',
  SOLANA_TRACKER_API_KEY: getEnv('VITE_SOLANA_TRACKER_API_KEY', ''),
  
  // RPC Configuration
  SOLANA_RPC_URL: getEnv('VITE_SOLANA_RPC_URL', 'https://api.mainnet-beta.solana.com'),
  
  // Debug settings
  DEBUG: getEnv('VITE_DEBUG', 'false') === 'true',
  LOG_LEVEL: getEnv('VITE_LOG_LEVEL', 'info'),
  
  // Honeycomb Configuration
  HONEYCOMB_API_URL: getEnv('VITE_HONEYCOMB_API_URL', ''),
  HONEYCOMB_RPC_URL: getEnv('VITE_HONEYCOMB_RPC_URL', ''),
  HONEYCOMB_DAS_API_URL: getEnv('VITE_HONEYCOMB_DAS_API_URL', ''),
};

/**
 * Token configuration object that can be overridden by environment variables
 * @type {Object}
 * @property {string} TOKEN_ADDRESS - The Solana address of the token
 * @property {string} TOKEN_SYMBOL - The token symbol (e.g., "VMN")
 * @property {string} TOKEN_NAME - The full name of the token (e.g., "Vermin")
 * @property {number} TOKEN_DECIMALS - Number of decimal places for the token (usually 9 for Solana tokens)
 * @property {string} TOKEN_LOGO_URL - URL to the token's logo (should be placed in public/img/)
 * 
 * @property {string} DEXSCREENER_API - Base URL for the DexScreener API
 * 
 * @property {Object} SOLANA_TRACKER_API - Solana Tracker API configuration
 * @property {string} SOLANA_TRACKER_API.BASE_URL - Base URL for the Solana Tracker API
 * @property {string} SOLANA_TRACKER_API.API_KEY - API key for the Solana Tracker API
 * @property {Object} SOLANA_TRACKER_API.ENDPOINTS - API endpoints
 * @property {string} SOLANA_TRACKER_API.ENDPOINTS.PRICE_HISTORY - Endpoint for price history data
 * 
 * @property {Object} CHART - Chart configuration
 * @property {string} CHART.DEFAULT_RANGE - Default time range for the chart (e.g., "24h", "7d", "30d")
 * @property {number} CHART.REFRESH_INTERVAL - Refresh interval in milliseconds
 * 
 * @property {boolean} DEBUG - Whether debug mode is enabled
 * @property {string} LOG_LEVEL - Logging level (e.g., 'debug', 'info', 'warn', 'error')
 */
export const TOKEN_CONFIG = {
  // Token details
  TOKEN_ADDRESS: getEnv('TOKEN_ADDRESS', DEFAULT_CONFIG.TOKEN_ADDRESS),
  TOKEN_SYMBOL: getEnv('TOKEN_SYMBOL', DEFAULT_CONFIG.TOKEN_SYMBOL),
  TOKEN_NAME: getEnv('TOKEN_NAME', DEFAULT_CONFIG.TOKEN_NAME),
  TOKEN_DECIMALS: parseInt(getEnv('TOKEN_DECIMALS', DEFAULT_CONFIG.TOKEN_DECIMALS), 10),
  TOKEN_LOGO_URL: getEnv('TOKEN_LOGO_URL', DEFAULT_CONFIG.TOKEN_LOGO_URL),
  
  // API endpoints
  DEXSCREENER_API: getEnv('DEXSCREENER_API', DEFAULT_CONFIG.DEXSCREENER_API),
  SOLANA_TRACKER_API: {
    BASE_URL: getEnv('SOLANA_TRACKER_API_URL', DEFAULT_CONFIG.SOLANA_TRACKER_API_URL),
    API_KEY: getEnv('SOLANA_TRACKER_API_KEY', ''),
    ENDPOINTS: {
      PRICE_HISTORY: '/price/history',
    },
  },
  
  // Chart configuration
  CHART: {
    DEFAULT_RANGE: '24h',
    REFRESH_INTERVAL: 60000, // 1 minute
  },
  
  // Debug settings
  DEBUG: getEnv('DEBUG', DEFAULT_CONFIG.DEBUG) === 'true',
  LOG_LEVEL: getEnv('LOG_LEVEL', DEFAULT_CONFIG.LOG_LEVEL),
};

// Log the configuration in development for debugging
if (import.meta.env.DEV) {
  console.log('Token Configuration:', TOKEN_CONFIG);
}

export default TOKEN_CONFIG;
