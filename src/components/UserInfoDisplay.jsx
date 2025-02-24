import { useUserProfile } from "@/contexts/UserProfileContext";
import DisconnectButton from "@/components/DisconnectButton";

const UserInfoDisplay = () => {
  const { userProfile } = useUserProfile(); // Get the profile from context
  console.log("User profile in UserInfoDisplay:", userProfile);

  const formatBalance = (balance) => {
    const numericBalance = parseFloat(balance); // Ensure balance is a number
    if (!isNaN(numericBalance)) {
      return (numericBalance / 10 ** 6).toFixed(6); // Format balance
    }
    return "0"; // Fallback for invalid balances
  };

  const truncateAddress = (address) => {
    if (address && address.length > 10) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return address; // Return as-is if it's too short to truncate
  };

  const copyToClipboard = (address) => {
    if (address) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          alert("Address copied to clipboard");
        })
        .catch((error) => {
          console.error("Failed to copy address", error);
        });
    }
  };

  if (!userProfile) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>User Profile</h3>
      <p>
        Wallet Address:{" "}
        <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          title={userProfile.walletAddress} // Hover text showing full address
          onClick={() => copyToClipboard(userProfile.walletAddress)} // Click to copy address to clipboard
        >
          {truncateAddress(userProfile.walletAddress || "N/A")}
        </span>
      </p>
      <p>Token Balance: {formatBalance(userProfile.tokenBalance || 0)}</p>
      <p>Hodl Time: {userProfile.hodlTime || "N/A"}</p>
      <hr />
      <DisconnectButton />
    </div>
  );
};

export default UserInfoDisplay;
