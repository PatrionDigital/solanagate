import PropTypes from 'prop-types';
import { Outlet } from "react-router-dom";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

import { Link, useLocation } from "react-router-dom";

const GameLayout = ({ children }) => {
  const location = useLocation();
  const navLinks = [
    { name: "Game Dashboard", to: "/games" },
    { name: "Vermigotchi", to: "/games/vermigotchi" },
    { name: "Spinner Game", to: "/games/spinner" },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        <nav className="flex gap-4 mb-8 justify-center">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded font-semibold transition-colors duration-150 
                ${location.pathname === link.to ? 'bg-gold text-black shadow' : 'bg-gray-800 text-gold hover:bg-gold hover:text-black'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
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
