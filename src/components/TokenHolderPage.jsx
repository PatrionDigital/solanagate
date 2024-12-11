import UserInfoDisplay from "./UserInfoDisplay";
import DisconnectButton from "./DisconnectButton";

const TokenHolderPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Exclusive Content</h1>
      <p>Welcome, token holder! You can access the gated content.</p>
      <UserInfoDisplay />
      <DisconnectButton />
    </div>
  );
};

export default TokenHolderPage;
