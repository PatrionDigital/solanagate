// src/utils/adminUtils.js

// Admin addresses from AdminAuth
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
export const isAdminAddress = (address) => {
  if (!address) return false;
  return ADMIN_ADDRESSES.includes(address);
};

/**
 * Export admin addresses for consistency across components
 */
export const getAdminAddresses = () => {
  return [...ADMIN_ADDRESSES];
};
