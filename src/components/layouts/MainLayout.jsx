// Contexts
import { useWalletContext } from "@/contexts/WalletContext";
import { UserProfileContextProvider } from "@/contexts/UserProfileContextProvider";

// Layouts
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import LandingPage from "@/components/LandingPage";
import TokenHolderPage from "@/components/TokenHolderPage";
import NonHolderPage from "@/components/NonHolderPage";

// Style
import "@/components/layouts/styles/MainLayout.css";

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
    <UserProfileContextProvider>
      <Header />
      <div className="main-layout-content">{renderContent()}</div>
      <Footer />
    </UserProfileContextProvider>
  );
};

export default MainLayout;
