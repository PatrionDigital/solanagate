// Layouts
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

// Pages
import TokenHolderPage from "@/components/TokenHolderPage";
import NonHolderPage from "@/components/NonHolderPage";

// Style
import "@/styles/MainLayout.css";

import PropTypes from 'prop-types';
import { useWalletContext } from "@/contexts/WalletContext";

const MainLayout = ({ children }) => {
  const { isTokenHolder } = useWalletContext();

  // Render the appropriate page based on token holder status
  const renderContent = () => {
    return isTokenHolder ? <TokenHolderPage /> : <NonHolderPage />;
  };

  return (
    <>
      <Header />
      <div className="main-layout-content pt-[72px] pb-[72px]">
        {children || renderContent()}
      </div>
      <Footer />
    </>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};

export default MainLayout;
