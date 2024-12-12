import { useWalletContext } from "@/contexts/useWalletContext";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import LandingPage from "@/components/LandingPage";
import TokenHolderPage from "@/components/TokenHolderPage";
import NonHolderPage from "@/components/NonHolderPage";

const MainLayout = () => {
  const { connected, isTokenHolder } = useWalletContext();

  // Determine what to render based on wallet state
  const renderContent = () => {
    if (!connected) {
      return <LandingPage />;
    } else if (isTokenHolder) {
      return <TokenHolderPage />;
    } else {
      <NonHolderPage />;
    }
  };
  return (
    <>
      <Header />
      <div style={{ minHeight: "80vh" }}>{renderContent()}</div>
      <Footer />
    </>
  );
};

export default MainLayout;
