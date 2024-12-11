import DisconnectButton from "./DisconnectButton";

const NonHolderPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Access Denied</h1>
      <p>You do not hold the required tokens to access this content.</p>
      <DisconnectButton />
    </div>
  );
};

export default NonHolderPage;
