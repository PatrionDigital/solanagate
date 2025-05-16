/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Token Configuration
  readonly VITE_TOKEN_MINT_ADDRESS: string;
  readonly VITE_TOKEN_SYMBOL: string;
  readonly VITE_TOKEN_NAME: string;
  readonly VITE_TOKEN_DECIMALS: string;
  readonly VITE_TOKEN_LOGO_URL: string;
  
  // API Configuration
  readonly VITE_DEXSCREENER_API: string;
  readonly VITE_SOLANA_TRACKER_API_URL: string;
  readonly VITE_SOLANA_TRACKER_API_KEY: string;
  
  // Environment Configuration
  readonly VITE_DEBUG: string;
  readonly VITE_LOG_LEVEL: string;
  
  // RPC Configuration
  readonly VITE_SOLANA_RPC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
