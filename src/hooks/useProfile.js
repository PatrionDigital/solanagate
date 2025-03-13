import { useContext } from "react";
import { ProfileContext } from "@/contexts/ProfileContext";
import { useWallet } from "@solana/wallet-adapter-react";

/**
 * Custom hook for accessing and managing user profiles
 * @returns {Object} Profile state and management functions
 */
const useProfile = () => {
  const context = useContext(ProfileContext);
  const { connected } = useWallet();

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  const {
    profile,
    profileLoading,
    profileError,
    badges,
    badgesLoading,
    assets,
    assetsLoading,
    refreshProfile,
    createProfile,
    updateProfile,
    claimBadge,
    fetchUserAssets,
  } = context;

  // Computed properties
  const hasProfile = !!profile;
  const profileName = profile?.data?.name || "";
  const profileImage = profile?.data?.image || "";
  const profileBio = profile?.data?.bio || "";
  const profileAttributes = profile?.data?.attributes || [];

  // Helper functions
  const getAttributeValue = (key) => {
    if (!profile?.data?.attributes) return null;

    const attribute = profileAttributes.find(
      (attr) => attr.trait_type.toLowerCase() === key.toLowerCase()
    );

    return attribute ? attribute.value : null;
  };

  const formatProfileData = (data = {}) => {
    // Format profile data for display or submission
    return {
      name: data.name || profileName,
      image: data.image || profileImage,
      bio: data.bio || profileBio,
      attributes: data.attributes || profileAttributes,
    };
  };

  // Returns object with all profile-related state and functions
  return {
    // State
    profile,
    profileLoading,
    profileError,
    hasProfile,
    profileName,
    profileImage,
    profileBio,
    profileAttributes,
    badges,
    badgesLoading,
    assets,
    assetsLoading,

    // CRUD Operations
    refreshProfile,
    createProfile,
    updateProfile,
    claimBadge,
    fetchUserAssets,

    // Helper functions
    getAttributeValue,
    formatProfileData,

    // Wallet state
    isWalletConnected: connected,
  };
};

export default useProfile;
