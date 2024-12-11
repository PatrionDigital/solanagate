// Save user profile to localStorage
export const saveUserProfile = (userProfile) => {
  try {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    console.log("User profile saved");
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
};

// Get user profile from localStorage
export const getUserProfile = () => {
  try {
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      return JSON.parse(userProfile);
    }
    return null;
  } catch (error) {
    console.error("Error reading user profile:", error);
    return null;
  }
};

// Remove user profile from localStorage
export const removeUserProfile = () => {
  try {
    localStorage.removeItem("userProfile");
    console.log("User profile removed");
  } catch (error) {
    console.error("Error removing user profile", error);
  }
};
