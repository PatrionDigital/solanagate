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
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  const updateUserProfile = (profile) => {
    saveUserProfile(profile);
    setUserProfile(profile);
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
