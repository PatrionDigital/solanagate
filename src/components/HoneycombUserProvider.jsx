import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useWallet } from "@solana/wallet-adapter-react";
import { ProfileProvider } from "../context/ProfileContext";
import HoneycombService from "../services/honeycombService";
import useHoneycombAuth from "../hooks/useHoneycombAuth";

/**
 * Provider component that integrates Honeycomb user and profile management
 * into the application
 */
const HoneycombUserProvider = ({
  children,
  apiUrl,
  useSSE = false,
  onAuthChange = () => {},
}) => {
  useWallet();
  const [honeycombClient, setHoneycombClient] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState("");

  // Initialize Honeycomb client
  useEffect(() => {
    if (!apiUrl) {
      setError("Honeycomb API URL is required");
      return;
    }

    try {
      const service = new HoneycombService(apiUrl, useSSE);
      setHoneycombClient(service.client);
      setIsInitialized(true);
      setError("");
    } catch (error) {
      console.error("Error initializing Honeycomb client:", error);
      setError(`Failed to initialize Honeycomb client: ${error.message}`);
    }
  }, [apiUrl, useSSE]);

  // Use auth hook to handle authentication
  const { accessToken, isAuthenticated, authLoading, authError } =
    useHoneycombAuth(honeycombClient);

  // Set auth token on client when available
  useEffect(() => {
    if (honeycombClient && accessToken) {
      if (honeycombClient.setAuthToken) {
        honeycombClient.setAuthToken(accessToken);
      }
    }
  }, [honeycombClient, accessToken]);

  // Notify parent component of auth changes
  useEffect(() => {
    onAuthChange({
      isAuthenticated,
      isLoading: authLoading,
      error: authError,
    });
  }, [isAuthenticated, authLoading, authError, onAuthChange]);

  // Error state
  if (error) {
    return (
      <div className="honeycomb-provider honeycomb-provider--error">
        <div className="honeycomb-provider__error">
          <h3>Configuration Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Loading state while client initializes
  if (!isInitialized) {
    return (
      <div className="honeycomb-provider honeycomb-provider--loading">
        <div className="honeycomb-provider__loading">
          <span>Initializing Honeycomb...</span>
        </div>
      </div>
    );
  }

  // Wrap children with ProfileProvider when client is ready
  return <ProfileProvider client={honeycombClient}>{children}</ProfileProvider>;
};

HoneycombUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  apiUrl: PropTypes.string.isRequired,
  useSSE: PropTypes.bool,
  onAuthChange: PropTypes.func,
};

export default HoneycombUserProvider;
