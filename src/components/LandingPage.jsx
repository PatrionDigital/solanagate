import CustomWalletButton from "@/components/CustomWalletButton";
import "@/styles/CustomWalletButton.css";

const LandingPage = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Welcome to Vermin on Solana dApp</h1>
    <CustomWalletButton />
    <p>Please connect your wallet to proceed.</p>
  </div>
);

export default LandingPage;
