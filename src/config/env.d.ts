// Type definitions for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    // Token configuration
    REACT_APP_TOKEN_ADDRESS: string;
    REACT_APP_TOKEN_SYMBOL: string;
    REACT_APP_TOKEN_NAME: string;
    REACT_APP_TOKEN_DECIMALS: string;
    REACT_APP_TOKEN_LOGO_URL: string;
    REACT_APP_DEXSCREENER_API: string;
    
    // Other environment variables
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
  }
}

// For browser environment
declare global {
  interface Window {
    env: {
      REACT_APP_TOKEN_ADDRESS?: string;
      REACT_APP_TOKEN_SYMBOL?: string;
      REACT_APP_TOKEN_NAME?: string;
      REACT_APP_TOKEN_DECIMALS?: string;
      REACT_APP_TOKEN_LOGO_URL?: string;
      REACT_APP_DEXSCREENER_API?: string;
      [key: string]: string | undefined;
    };
  }
}

export {};
