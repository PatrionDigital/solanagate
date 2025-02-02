// src/contexts/UserProfileProvider.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { UserProfileContext } from "./UserProfileContext";
import {
  getUserProfile,
  saveUserProfile,
  removeUserProfile,
} from "@/utils/localStorageUtils";

export const UserProfileContextProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const profile = getUserProfile();
    console.log("Profile loaded from storage:", profile);
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  const updateUserProfile = (profile) => {
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
  };

  const clearUserProfile = () => {
    removeUserProfile();
    setUserProfile(null);
  };

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
