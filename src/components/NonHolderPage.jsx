import DisconnectButton from "@/components/DisconnectButton";
import { Link } from "react-router-dom";
import raylogo from "@/assets/raydium-logo.png";
const NonHolderPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Access Denied</h1>
      <p>You don&apos;t have any Vermin tokens.</p>

      <div>
        <p>Buy Vermin on Solana:</p>
        <div>
          <Link to="https://raydium.io/swap/?inputMint=sol&outputMint=4fMRncxv5XvsdpAmDxttpjw7pTqPLqKQpyD36jtNpump">
            <img
              src={raylogo}
              alt="App Logo"
              style={{ height: "65px", width: "65px" }}
            />
          </Link>
        </div>
      </div>
      <DisconnectButton />
    </div>
  );
};

export default NonHolderPage;
