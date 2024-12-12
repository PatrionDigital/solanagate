// UserInfoDisplay.jsx
import { useEffect, useState } from "react";
import { getUserProfile } from "../utils/localStorageUtils";

const UserInfoDisplay = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const profile = getUserProfile();
    console.log("Fetched profile:", profile);
    setUserProfile(profile);
  }, []);

  const formatBalance = (balance) => {
    const numericBalance = parseFloat(balance); // Ensure balance is a number
    if (!isNaN(numericBalance)) {
      return (numericBalance / 10 ** 6).toFixed(6);
    }
    return "0"; // Fallback for invalid balances
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {userProfile ? (
        <>
          <h3>User Profile</h3>
          <p>Wallet Address: {userProfile.walletAddress}</p>
          <p>Token Balance: {formatBalance(userProfile.tokenBalance)}</p>
        </>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default UserInfoDisplay;
