import UserInfoDisplay from "./UserInfoDisplay";

const TokenHolderPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Exclusive Content</h1>
      <p>Welcome, token holder! You can access the gated content.</p>
      <UserInfoDisplay />
    </div>
  );
};

export default TokenHolderPage;
