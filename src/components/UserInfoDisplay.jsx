// UserInfoDisplay.jsx
import { useEffect, useState } from "react";
import { getUserProfile } from "../utils/localStorageUtils";

const UserInfoDisplay = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
  }, []);

  const formatBalance = (balance) => {
    if (balance) {
      const formattedBalance = (balance / 10 ** 6).toFixed(6);
      return parseFloat(formattedBalance).toString();
    }
    return "0";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {userProfile ? (
        <>
          <h3>User Profile</h3>
          <p>Wallet Address: {userProfile.walletAddress}</p>
          <p>Token Balance: {formatBalance(userProfile.balance)}</p>
        </>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default UserInfoDisplay;
