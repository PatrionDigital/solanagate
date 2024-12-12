// src/contexts/UserProfileContext.jsx
import { createContext, useContext } from "react";

export const UserProfileContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error(
      "useUserProfile must be used within a UserProfileContextProvider"
    );
  }
  return context;
};
