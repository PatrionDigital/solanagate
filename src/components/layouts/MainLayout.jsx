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

  const tokenLoading = isTokenHolder === null;

  // Determine what to render based on wallet state
  const renderContent = () => {
    if (!connected) {
      return <LandingPage />;
    }
    if (tokenLoading) {
      return <LoadingSpinner message="Loading..." />;
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
