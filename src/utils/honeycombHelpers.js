import { PublicKey } from "@solana/web3.js";

/**
 * Utility functions for working with Honeycomb Protocol
 */

/**
 * Formats a public key for display
 * @param {string|PublicKey} pubkey - The public key to format
 * @returns {string} Formatted public key (e.g., "Gh7t...8j3M")
 */
export const formatPublicKey = (pubkey) => {
  if (!pubkey) return "";

  const keyString =
    typeof pubkey === "string"
      ? pubkey
      : pubkey instanceof PublicKey
      ? pubkey.toString()
      : "";

  if (keyString.length <= 8) return keyString;

  return `${keyString.substring(0, 4)}...${keyString.substring(
    keyString.length - 4
  )}`;
};

/**
 * Validates if a string is a valid Solana public key
 * @param {string} address - Address to validate
 * @returns {boolean} Whether the address is valid
 */
export const isValidPublicKey = (address) => {
  try {
    if (!address) return false;
    new PublicKey(address);
    return true;
  } catch (error) {
    console.error("Not a valid public key:", error);
    return false;
  }
};

/**
 * Formats profile data from Honeycomb API to a consistent structure
 * @param {Object} profileData - Raw profile data
 * @returns {Object} Normalized profile data
 */
export const normalizeProfileData = (profileData) => {
  if (!profileData) return null;

  return {
    id: profileData.address || "",
    wallet: profileData.wallet || "",
    name: profileData.data?.name || "",
    image: profileData.data?.image || "",
    bio: profileData.data?.bio || "",
    attributes: profileData.data?.attributes || [],
    createdAt: profileData.created_at || null,
    updatedAt: profileData.updated_at || null,
  };
};

/**
 * Creates a skeleton profile data object
 * @param {string} walletAddress - Wallet address for the profile
 * @returns {Object} Empty profile structure
 */
export const createEmptyProfile = (walletAddress) => {
  return {
    wallet: walletAddress || "",
    data: {
      name: "",
      image: "",
      bio: "",
      attributes: [],
    },
  };
};

/**
 * Helper to add or update a profile attribute
 * @param {Array} attributes - Current attributes
 * @param {string} trait - Trait type to add/update
 * @param {string} value - Value for the trait
 * @returns {Array} Updated attributes array
 */
export const upsertProfileAttribute = (attributes = [], trait, value) => {
  const existingIndex = attributes.findIndex(
    (attr) => attr.trait_type.toLowerCase() === trait.toLowerCase()
  );

  const newAttributes = [...attributes];

  if (existingIndex >= 0) {
    // Update existing attribute
    newAttributes[existingIndex] = {
      ...newAttributes[existingIndex],
      value,
    };
  } else {
    // Add new attribute
    newAttributes.push({
      trait_type: trait,
      value,
    });
  }

  return newAttributes;
};

/**
 * Get file as data URL for profile image uploads
 * @param {File} file - File object to convert
 * @returns {Promise<string>} Data URL of the file
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload profile image to storage
 * @param {File} file - Image file to upload
 * @param {Object} client - Honeycomb client instance
 * @returns {Promise<string>} URL of the uploaded image
 */
export const uploadProfileImage = async (file, client) => {
  if (!file || !client) {
    throw new Error("File and client are required");
  }

  try {
    // Convert file to data URL
    const dataUrl = await fileToDataUrl(file);

    // Upload to storage using Honeycomb client
    // Adjust this based on actual Honeycomb implementation
    const { url } = await client.uploadFile({
      file: dataUrl,
      contentType: file.type,
    });

    return url;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

/**
 * Format a badge object for display
 * @param {Object} badge - Badge data from API
 * @returns {Object} Formatted badge data
 */
export const formatBadgeData = (badge) => {
  if (!badge) return null;

  return {
    id: badge.address || "",
    name: badge.data?.name || "Unknown Badge",
    description: badge.data?.description || "",
    image: badge.data?.image || "",
    attributes: badge.data?.attributes || [],
    claimedAt: badge.claimed_at || null,
  };
};
