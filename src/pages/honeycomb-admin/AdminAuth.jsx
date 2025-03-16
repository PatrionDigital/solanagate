import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWalletContext } from "@/contexts/WalletContext";
import * as web3 from "@solana/web3.js";
import nacl from "tweetnacl";
import base58 from "bs58";

// Admin authentication utilities
// In a real application, these addresses would be stored securely server-side
const ADMIN_ADDRESSES = [
  "72j257cEWGEaD3379m8w59bceMJDsqe3dCuaivXPF7RL",
  "2TdY2FnnpBgXYGdNbDkzTk9tLZEq1uHrvZY4fFXQ9Aut", // Backpack Testing address
  // Add more admin addresses as needed
];

/**
 * Check if an address is an authorized admin
 * @param {string} address - Wallet address to check
 * @returns {boolean} Whether the address is authorized
 */
const isAdminAddress = (address) => {
  if (!address) return false;
  return ADMIN_ADDRESSES.includes(address);
};

/**
 * Generate a challenge message for authentication
 * @param {string} address - Wallet address
 * @returns {string} Challenge message to sign
 */
const generateAuthChallenge = (address) => {
  const timestamp = Date.now();
  return `Authenticate to Honeycomb Admin Panel with address ${address}. Timestamp: ${timestamp}`;
};

/**
 * Verify a signature against a wallet address and message
 * @param {string} message - Original message that was signed
 * @param {string} signature - Signature to verify
 * @param {string} publicKey - Public key (address) that signed the message
 * @returns {boolean} Whether the signature is valid
 */
const verifySignature = (message, signature, publicKey) => {
  try {
    // Convert message to Uint8Array
    const messageBytes = new TextEncoder().encode(message);

    // Convert signature from base58 to Uint8Array
    const signatureBytes = base58.decode(signature);

    // Convert publicKey from string to PublicKey and then to Uint8Array
    const publicKeyBytes = new web3.PublicKey(publicKey).toBytes();

    // Verify the signature using tweetnacl
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};

/**
 * Store authentication session in localStorage
 * @param {string} address - Authenticated address
 * @param {string} signature - Signature from the authentication
 */
const storeAuthSession = (address, signature) => {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const session = {
    address,
    signature,
    expiresAt,
  };
  localStorage.setItem("honeycomb_admin_auth", JSON.stringify(session));
};

/**
 * Check if there is a valid auth session
 * @returns {{isValid: boolean, address: string|null}} Authentication status
 */
const checkAuthSession = () => {
  try {
    const sessionData = localStorage.getItem("honeycomb_admin_auth");
    if (!sessionData) {
      return { isValid: false, address: null };
    }

    const session = JSON.parse(sessionData);

    // Check if session has expired
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem("honeycomb_admin_auth");
      return { isValid: false, address: null };
    }

    // Check if address is still authorized
    if (!isAdminAddress(session.address)) {
      localStorage.removeItem("honeycomb_admin_auth");
      return { isValid: false, address: null };
    }

    return { isValid: true, address: session.address };
  } catch (error) {
    console.error("Error checking auth session:", error);
    return { isValid: false, address: null };
  }
};

/**
 * Clear the authentication session
 */
const clearAuthSession = () => {
  localStorage.removeItem("honeycomb_admin_auth");
};

// AdminAuth Component
const AdminAuth = ({ children, onAuthChange }) => {
  const { publicKey, connected, disconnect, connection } = useWalletContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is an admin
  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toString();
      const isWalletAdmin = isAdminAddress(address);
      setIsAdmin(isWalletAdmin);

      if (!isWalletAdmin) {
        setError(
          "This wallet address is not authorized to access the admin panel."
        );
      } else {
        setError(null);

        // Check if there's an existing valid session
        const { isValid } = checkAuthSession();
        setIsAuthenticated(isValid);

        if (onAuthChange) {
          onAuthChange(isValid);
        }
      }
    } else {
      setIsAdmin(false);
      setIsAuthenticated(false);
      setError(null);

      if (onAuthChange) {
        onAuthChange(false);
      }
    }
  }, [connected, publicKey, onAuthChange]);

  // Sign message with the wallet
  const signMessage = async (message) => {
    try {
      // Convert the message to Uint8Array
      const messageBytes = new TextEncoder().encode(message);

      // First check for Backpack wallet
      if (window.backpack) {
        console.log("Using Backpack wallet for signing");
        const { signature } = await window.backpack.signMessage(messageBytes);
        return base58.encode(signature);
      }

      // Next try standard Solana wallet adapter
      if (window.solana && window.solana.signMessage) {
        console.log("Using Solana adapter signMessage");
        const { signature } = await window.solana.signMessage(
          messageBytes,
          "utf8"
        );
        return base58.encode(signature);
      }

      // Fallback to transaction-based signing if necessary
      console.log("Using transaction-based signing");

      // Create a transaction with a single instruction that includes the message
      const instruction = new web3.TransactionInstruction({
        keys: [],
        programId: web3.SystemProgram.programId,
        data: messageBytes,
      });

      const transaction = new web3.Transaction().add(instruction);
      transaction.feePayer = publicKey;

      // Prepare the transaction for signing (this doesn't send it)
      const blockHash = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockHash.blockhash;

      // Using signTransaction from window.solana if available
      if (window.solana && window.solana.signTransaction) {
        const signedTransaction = await window.solana.signTransaction(
          transaction
        );
        const signature = signedTransaction.signatures[0].signature;
        if (signature) {
          return base58.encode(signature);
        }
      } else {
        throw new Error("No suitable signing method found for this wallet");
      }
    } catch (err) {
      console.error("Error signing message:", err);
      throw new Error("Failed to sign message with wallet: " + err.message);
    }
  };

  // Authenticate with wallet signature
  const handleAuthenticate = async () => {
    if (!connected || !publicKey || !isAdmin) {
      return;
    }

    try {
      setIsAuthenticating(true);
      setError(null);

      const address = publicKey.toString();
      const challengeMessage = generateAuthChallenge(address);

      // Request wallet to sign the challenge
      console.log("Requesting signature for message:", challengeMessage);
      const signature = await signMessage(challengeMessage);

      // Verify the signature
      const isValid = verifySignature(challengeMessage, signature, address);

      if (isValid) {
        storeAuthSession(address, signature);
        setIsAuthenticated(true);

        if (onAuthChange) {
          onAuthChange(true);
        }
      } else {
        setError("Failed to authenticate. Signature verification failed.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setError(
        "Authentication failed: " + (error.message || "Please try again.")
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    clearAuthSession();
    setIsAuthenticated(false);

    if (onAuthChange) {
      onAuthChange(false);
    }
  };

  // Render based on authentication state
  if (!connected) {
    return (
      <div className="admin-auth">
        <div className="auth-message">
          <h2>Admin Authentication</h2>
          <p>Please connect your wallet to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-auth">
        <div className="auth-message error">
          <h2>Unauthorized</h2>
          <p>{error || "You do not have permission to access this page."}</p>
          <button className="auth-button disconnect" onClick={disconnect}>
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-auth">
        <div className="auth-message">
          <h2>Admin Authentication</h2>
          <p>
            Please sign the authentication message with your wallet to continue.
          </p>
          {error && <div className="auth-error">{error}</div>}
          <button
            className="auth-button"
            onClick={handleAuthenticate}
            disabled={isAuthenticating}
          >
            {isAuthenticating
              ? "Authenticating..."
              : "Authenticate with Wallet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-authenticated">
      <div className="admin-toolbar">
        <span className="admin-status">Authenticated as Admin</span>
        <button className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {children}
    </div>
  );
};

AdminAuth.propTypes = {
  children: PropTypes.node.isRequired,
  onAuthChange: PropTypes.func,
};

AdminAuth.defaultProps = {
  onAuthChange: () => {},
};

export default AdminAuth;
