import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const LandingPage = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h1>Welcome to Vermin on Solana dApp</h1>
    <WalletMultiButton />
    <p>Please connect your wallet to proceed.</p>
  </div>
);

export default LandingPage;
