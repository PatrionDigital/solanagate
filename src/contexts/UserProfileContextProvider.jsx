// src/contexts/UserProfileProvider.jsx
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { UserProfileContext } from "./UserProfileContext";
import { useWalletContext } from "./WalletContext";
import {
  getUserProfile,
  saveUserProfile,
  removeUserProfile,
} from "@/utils/localStorageUtils";

export const UserProfileContextProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const { connected, publicKey } = useWalletContext();

  // Define callback functions first, before they're used in useEffect
  const updateUserProfile = useCallback((profile) => {
    console.log("Updating User Profile:", profile);
    if (!profile) {
      console.error("Cannot save undefined or null profile.");
      return;
    }

    const updatedProfile =
      typeof profile === "function" ? profile(userProfile) : profile;
    console.log("Updated profile:", updatedProfile);
    saveUserProfile(updatedProfile);
    setUserProfile(updatedProfile);
  }, [userProfile]);

  const clearUserProfile = useCallback(() => {
    console.log("Clearing user profile");
    removeUserProfile();
    setUserProfile(null);
  }, []);

  // Load profile from localStorage on initial mount
  useEffect(() => {
    const loadProfileFromStorage = () => {
      const profile = getUserProfile();
      console.log("Profile loaded from storage:", profile);
      if (profile) {
        setUserProfile(profile);
      }
    };

    loadProfileFromStorage();
  }, []);

  // Handle wallet connection/disconnection
  useEffect(() => {
    if (connected && publicKey) {
      // When wallet connects, we should only update the wallet address and preserve
      // any existing token balance and hodl time data that might come from elsewhere
      const existingProfile = getUserProfile();
      
      if (!userProfile || userProfile.walletAddress !== publicKey.toString()) {
        const newProfile = {
          ...(existingProfile || {}),
          walletAddress: publicKey.toString(),
        };
        
        // Only set tokenBalance and hodlTime if they don't exist
        if (!newProfile.tokenBalance) newProfile.tokenBalance = 0;
        if (!newProfile.hodlTime) newProfile.hodlTime = "N/A";
        
        updateUserProfile(newProfile);
      }
    } else if (!connected) {
      // If we disconnect, clear the profile
      clearUserProfile();
    }
  }, [connected, publicKey, userProfile, updateUserProfile, clearUserProfile]);

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        clearUserProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

UserProfileContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};