import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaInfoCircle } from "react-icons/fa";
import { IoPersonCircleOutline, IoHome } from "react-icons/io5";
import logo from "@/assets/logo.avif";
import UserInfoDisplay from "@/components/UserInfoDisplay";
import { useWalletContext } from "@/contexts/WalletContext";

// Import the CSS file
import "@/styles/Header.css";

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
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="App Logo" className="header-logo" />
          </Link>
        </div>
        <nav>
          <ul className={`nav-list ${navMenuOpen ? "open" : ""}`}>
            <li
              className={
                location.pathname === "/" ? "nav-item active" : "nav-item"
              }
            >
              <Link to="/">
                <div className="nav-link-content">
                  <IoHome size={18} />
                  <span>Home</span>
                </div>
              </Link>
            </li>
            <li
              className={
                location.pathname === "/about" ? "nav-item active" : "nav-item"
              }
            >
              <Link to="/about">
                <div className="nav-link-content">
                  <FaInfoCircle size={18} />
                  <span>About</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header-right">
          <div className="hamburger-menu" onClick={toggleMenu}>
            &#9776;
          </div>
          <div className="user-menu">
            <IoPersonCircleOutline
              size={32}
              className="user-icon"
              onClick={toggleAccountMenu}
            />
            {accountMenuOpen && (
              <div className="account-dropdown">
                {isTokenHolder ? (
                  <UserInfoDisplay className="compressed-user-info" />
                ) : (
                  <>
                    <p>Connect wallet to login</p>
                    <WalletMultiButton />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
