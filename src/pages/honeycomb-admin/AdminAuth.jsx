import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWalletContext } from "@/contexts/WalletContext";
import * as web3 from "@solana/web3.js";
import {
  isAdminAddress,
  generateAuthChallenge,
  verifySignature,
  storeAuthSession,
  checkAuthSession,
  clearAuthSession,
} from "./adminAuth";

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

  const signMessage = async (message) => {
    try {
      // Check if the wallet supports message signing
      if (window.solana && window.solana.signMessage) {
        console.log("Using direct signMessage method");
        // Convert the message to Uint8Array
        const messageBytes = new TextEncoder().encode(message);
        // Ask the wallet to sign the message directly
        const signature = await window.solana.signMessage(messageBytes, "utf8");
        return signature;
      } else if (window.solana && window.solana.signTransaction) {
        console.log("Using transaction-based signing");
        // Convert the message to Uint8Array
        const messageBytes = new TextEncoder().encode(message);

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

        // Request wallet to sign transaction - this is what will prompt the user
        const signedTransaction = await window.solana.signTransaction(
          transaction
        );

        // Extract the signature
        const signature = signedTransaction.signatures[0].signature;
        if (signature) {
          // Convert signature to base64 without using Buffer
          // This avoids the "Buffer is not defined" error in Vite
          const signatureArray = Array.from(signature);
          const base64Signature = btoa(
            String.fromCharCode.apply(null, signatureArray)
          );
          return base64Signature;
        } else {
          throw new Error("No signature found in signed transaction");
        }
      } else {
        throw new Error(
          "Wallet does not support signing messages or transactions"
        );
      }
    } catch (err) {
      console.error("Error signing message:", err);
      throw new Error("Failed to sign message with wallet: " + err.message);
    }
  };

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

      // In a real implementation, you would verify this signature against the message and public key
      // For demo purposes, we'll just validate the admin address
      const isValid = await verifySignature(
        challengeMessage,
        signature,
        address
      );

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

  const handleLogout = () => {
    clearAuthSession();
    setIsAuthenticated(false);

    if (onAuthChange) {
      onAuthChange(false);
    }
  };

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
