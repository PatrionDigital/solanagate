// Context Hooks
import { useWalletContext } from "@/contexts/WalletContext";

// Layouts
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import LandingPage from "@/components/LandingPage";
import TokenHolderPage from "@/components/TokenHolderPage";
import NonHolderPage from "@/components/NonHolderPage";

// Style
import "@/styles/MainLayout.css";

const MainLayout = () => {
  const { connected, isTokenHolder } = useWalletContext();

  // Determine what to render based on wallet state
  const renderContent = () => {
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
