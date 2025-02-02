import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaInfoCircle } from "react-icons/fa";
import { IoPersonCircleOutline, IoHome } from "react-icons/io5";
import logo from "@/assets/logo.avif";
import UserInfoDisplay from "@/components/UserInfoDisplay";
import { useWalletContext } from "@/contexts/WalletContext";

// Header.jsx
import "@/styles/Header.css"; // Import the CSS file

const Header = () => {
  const { connected, isTokenHolder, setIsTokenHolder } = useWalletContext();
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    if (!connected) {
      setIsTokenHolder(false);
    }
  });
  const toggleMenu = () => {
    setNavMenuOpen(!navMenuOpen);
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen((prev) => !prev);
  };
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="App Logo" className="header-logo" />
          </Link>
          <div className="header-title"></div>
        </div>
        <nav>
          <ul className={`nav-list ${navMenuOpen ? "open" : ""}`}>
            <li className="nav-item">
              <Link
                to="/"
                className={
                  location.pathname === "/" ? "nav-item active" : "nav-item"
                }
              >
                <div className="nav-link-content">
                  <IoHome size={20} style={{ marginRight: "5px" }} />
                  <span>Home</span>
                </div>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about"
                className={
                  location.pathname === "/about"
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <div className="nav-link-content">
                  <FaInfoCircle size={20} style={{ marginRight: "5px" }} />
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
