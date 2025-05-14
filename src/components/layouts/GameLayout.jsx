import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { Outlet } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import LandingPage from "@/components/LandingPage";
import LoadingSpinner from "@/components/LoadingSpinner";

const GameLayout = () => {
  const { connected, isTokenHolder } = useWalletContext();
  const tokenLoading = isTokenHolder === null;

  // For MVP, allow all connected users to access games
  const renderContent = () => {
    if (!connected) {
      return <LandingPage />;
    }
    if (tokenLoading) {
      return <LoadingSpinner message="Loading..." />;
    }
    return <Outlet />;
  };

  return (
    <>
      <Header />
      <div className="game-layout-content pt-[72px] pb-[72px]">{renderContent()}</div>
      <Footer />
    </>
  );
};

export default GameLayout;
