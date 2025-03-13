import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

/**
 * Custom hook for managing Honeycomb Protocol authentication
 * @param {Object} client - Honeycomb client instance
 * @returns {Object} Auth state and functions
 */
const useHoneycombAuth = (client) => {
  const { publicKey, signMessage, connected } = useWallet();

  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Check if there's a stored token in localStorage
  const getStoredToken = useCallback(() => {
    try {
      const storedAuth = localStorage.getItem("honeycomb_auth");
      if (storedAuth) {
        const { token, expiry, wallet } = JSON.parse(storedAuth);

        // Verify token belongs to current wallet and hasn't expired
        if (wallet === publicKey?.toString() && expiry > Date.now()) {
          return token;
        }
      }
      return null;
    } catch (error) {
      console.error("Error reading stored token:", error);
      return null;
    }
  }, [publicKey]);

  // Store the token in localStorage
  const storeToken = useCallback(
    (token, expirySeconds = 3600) => {
      if (!publicKey) return;

      try {
        const authData = {
          token,
          wallet: publicKey.toString(),
          expiry: Date.now() + expirySeconds * 1000,
        };

        localStorage.setItem("honeycomb_auth", JSON.stringify(authData));
      } catch (error) {
        console.error("Error storing token:", error);
      }
    },
    [publicKey]
  );

  // Convert Uint8Array to base58 string
  const arrayToBase58 = useCallback((array) => {
    return bs58.encode(array);
  }, []);

  // Authenticate with Honeycomb using wallet signature
  const authenticate = useCallback(async () => {
    if (!publicKey || !signMessage || !client) {
      setAuthError("Wallet not connected");
      return null;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      // First check if we have a valid stored token
      const storedToken = getStoredToken();
      if (storedToken) {
        setAccessToken(storedToken);
        setIsAuthenticated(true);
        return storedToken;
      }

      // Request authentication challenge
      const { authRequest } = await client.authRequest({
        wallet: publicKey.toString(),
      });

      // Convert message to Uint8Array for signing
      const messageBytes = new TextEncoder().encode(authRequest.message);

      // Sign the message with wallet
      const signatureBytes = await signMessage(messageBytes);

      // Convert signature to base58 format
      const signature = arrayToBase58(signatureBytes);

      // Confirm authentication with signature
      const { authConfirm } = await client.authConfirm({
        wallet: publicKey.toString(),
        signature,
      });

      // Set token and authenticated state
      setAccessToken(authConfirm.accessToken);
      setIsAuthenticated(true);

      // Store token in localStorage
      storeToken(authConfirm.accessToken, authConfirm.expiresIn);

      return authConfirm.accessToken;
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError(error.message);
      setIsAuthenticated(false);
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, [
    publicKey,
    signMessage,
    client,
    getStoredToken,
    storeToken,
    arrayToBase58,
  ]);

  // Clear authentication
  const logout = useCallback(() => {
    localStorage.removeItem("honeycomb_auth");
    setAccessToken(null);
    setIsAuthenticated(false);
  }, []);

  // Automatically authenticate when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      const storedToken = getStoredToken();

      if (storedToken) {
        setAccessToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // Attempt authentication if no stored token
        authenticate();
      }
    } else {
      // Reset auth state when wallet disconnects
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  }, [connected, publicKey, getStoredToken, authenticate]);

  return {
    accessToken,
    isAuthenticated,
    authLoading,
    authError,
    authenticate,
    logout,
  };
};

export default useHoneycombAuth;
