import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import CustomWalletButton from "@/components/CustomWalletButton";
import "@/styles/CustomWalletButton.css";

const LandingPage = () => {
  const { connected } = useWalletContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) {
      // If redirected from a protected route, go back there
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [connected, location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Your Token dApp</h1>
      <CustomWalletButton />
      <p>Please connect your wallet to proceed.</p>
    </div>
  );
};

export default LandingPage;
