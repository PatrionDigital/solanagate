import PropTypes from 'prop-types';
import { Outlet } from "react-router-dom";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

const GameLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="game-layout-content pt-[72px] pb-[72px]">
        {children || <Outlet />}
      </div>
      <Footer />
    </>
  );
};

GameLayout.propTypes = {
  children: PropTypes.node
};

export default GameLayout;
