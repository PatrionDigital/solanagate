import { useState, useEffect } from "react";
// Context Hooks
import { useWalletContext } from "@/contexts/WalletContext";

// Layouts
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import LandingPage from "@/components/LandingPage";
import TokenHolderPage from "@/components/TokenHolderPage";
import NonHolderPage from "@/components/NonHolderPage";
import LoadingSpinner from "@/components/LoadingSpinner";

// Style
import "@/styles/MainLayout.css";

const MainLayout = () => {
  const { connected, isTokenHolder } = useWalletContext();

  const [walletLoading, setWalletLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    if (connected !== null) {
      // Stop Wallet Loading once connected is determined
      console.log("Loading: Wallet");
      setWalletLoading(false);
    }
  }, [connected]);

  useEffect(() => {
    if (isTokenHolder !== null) {
      //Stop Token Loading once isTokenHolder is determined
      console.log("Loading: Token Balance");
      setTokenLoading(false);
    }
  }, [isTokenHolder]);

  // Determine what to render based on wallet state
  const renderContent = () => {
    if (walletLoading) {
      return <LoadingSpinner message="Checking wallet connection..." />;
    }
    if (tokenLoading) {
      return <LoadingSpinner message="Checking token balance..." />;
    }
    if (!connected) {
      return <LandingPage />;
    }

    return isTokenHolder ? <TokenHolderPage /> : <NonHolderPage />;
  };
  return (
    <>
      <Header />
      <div className="main-layout-content">{renderContent()}</div>
      <Footer />
    </>
  );
};

export default MainLayout;
