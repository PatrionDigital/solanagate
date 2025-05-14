import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaInfoCircle } from "react-icons/fa";
import { IoPersonCircleOutline, IoHome } from "react-icons/io5";
import { Button } from "@windmill/react-ui";
import logo from "@/assets/logo.avif";
import UserInfoDisplay from "@/components/UserInfoDisplay";
import { useWalletContext } from "@/contexts/WalletContext";
// Tailwind handles styling, so no need for custom CSS


const Header = () => {
  const { connected, isTokenHolder, setIsTokenHolder } = useWalletContext();
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!connected) {
      setIsTokenHolder(false);
    }
  }, [connected, setIsTokenHolder]);

  const toggleMenu = () => {
    setNavMenuOpen(!navMenuOpen);
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen((prev) => !prev);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navMenuOpen &&
        !event.target.closest(".nav-list") &&
        !event.target.closest(".hamburger-menu")
      ) {
        setNavMenuOpen(false);
      }
      if (
        accountMenuOpen &&
        !event.target.closest(".account-dropdown") &&
        !event.target.closest(".user-icon")
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navMenuOpen, accountMenuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full bg-headerBg/80 backdrop-blur shadow-md border-b border-gold z-50">
      <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="App Logo" className="h-10" />
        </Link>
        <nav className="hidden md:block">
          <ul className="flex gap-6 text-footerText font-medium">
            <li>
              <Link to="/" className={`flex items-center gap-1 px-2 py-1 rounded hover:text-gold focus:text-gold active:text-gold transition ${location.pathname === "/" ? "text-gold font-bold" : ""}`}>
                <IoHome size={18} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className={`flex items-center gap-1 px-2 py-1 rounded hover:text-gold focus:text-gold active:text-gold transition ${location.pathname === "/about" ? "text-gold font-bold" : ""}`}>
                <FaInfoCircle size={18} />
                <span>About</span>
              </Link>
            </li>
          </ul>
        </nav>
        {/* Hamburger menu for mobile */}
        <div className="md:hidden flex items-center">
          <Button layout="link" aria-label="Open Menu" onClick={toggleMenu} className="hover:text-gold focus:text-gold active:text-gold transition">
            <span className="text-2xl">&#9776;</span>
          </Button>
        </div>
        {/* User menu */}
        <div className="relative ml-4">
          <Button layout="link" aria-label="User Menu" onClick={toggleAccountMenu} className="p-0 hover:text-gold focus:text-gold active:text-gold transition">
            <IoPersonCircleOutline size={32} className="text-gold hover:text-accent transition" />
          </Button>
          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-menuBg/95 shadow-lg rounded-lg z-50 p-4">
              {isTokenHolder ? (
                <UserInfoDisplay className="compressed-user-info" />
              ) : (
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-sm text-headerText">Connect wallet to login</p>
                  <WalletMultiButton className="w-full hover:text-gold focus:text-gold active:text-gold transition" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Mobile nav menu */}
      {navMenuOpen && (
        <nav className="md:hidden bg-headerBg/90 backdrop-blur border-t border-goldBorder">
          <ul className="flex flex-col gap-2 py-2 px-4">
            <li>
              <Link to="/" onClick={toggleMenu} className={`flex items-center gap-1 px-2 py-2 rounded hover:text-gold focus:text-gold active:text-gold transition ${location.pathname === "/" ? "text-gold font-bold" : ""}`}>
                <IoHome size={18} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={toggleMenu} className={`flex items-center gap-1 px-2 py-2 rounded hover:text-gold focus:text-gold active:text-gold transition ${location.pathname === "/about" ? "text-gold font-bold" : ""}`}>
                <FaInfoCircle size={18} />
                <span>About</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
