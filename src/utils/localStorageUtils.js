// Save user profile to localStorage
export const saveUserProfile = (userProfile) => {
  console.log("Saving profile:", userProfile);
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
    if (!userProfile || userProfile === "undefined") {
      return null; // Return null if the profile is missing or invalid
    }
    return JSON.parse(userProfile); // Parse and return the profile
  } catch (error) {
    console.error("Error reading user profile:", error);
    return null; // Return null if parsing fails
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
