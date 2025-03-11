// Admin authentication utilities

// Allowed admin addresses - can be updated to include more addresses
const ADMIN_ADDRESSES = ["72j257cEWGEaD3379m8w59bceMJDsqe3dCuaivXPF7RL"];

/**
 * Check if an address is an authorized admin
 * @param {string} address - Wallet address to check
 * @returns {boolean} Whether the address is authorized
 */
export const isAdminAddress = (address) => {
  if (!address) return false;
  return ADMIN_ADDRESSES.includes(address);
};

/**
 * Generate a challenge message for authentication
 * @param {string} address - Wallet address
 * @returns {string} Challenge message to sign
 */
export const generateAuthChallenge = (address) => {
  const timestamp = Date.now();
  return `Authenticate to Honeycomb Admin Panel with address ${address}. Timestamp: ${timestamp}`;
};

/**
 * Verify a signed message against a wallet address
 * @param {string} message - Original message that was signed
 * @param {string} signature - Signature to verify
 * @param {string} publicKey - Public key (address) that signed the message
 * @returns {Promise<boolean>} Whether the signature is valid
 */
export const verifySignature = async (message, signature, publicKey) => {
  try {
    // In a real implementation, you would use the Solana web3.js library
    // to verify the signature. For now, we'll just validate the admin address.
    return isAdminAddress(publicKey);
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
export const storeAuthSession = (address, signature) => {
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
export const checkAuthSession = () => {
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
export const clearAuthSession = () => {
  localStorage.removeItem("honeycomb_admin_auth");
};
