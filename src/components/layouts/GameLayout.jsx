import PropTypes from 'prop-types';
import { Outlet } from "react-router-dom";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

const GameLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        <div className="w-full">
          {children || <Outlet />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

GameLayout.propTypes = {
  children: PropTypes.node
};

export default GameLayout;
