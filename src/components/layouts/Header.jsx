import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/react.svg";

// Header.jsx
import "@/styles/Header.css"; // Import the CSS file

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="App Logo" className="header-logo" />
          </Link>
          <div className="header-title">My App</div>
        </div>
        <div className="hamburger-menu" onClick={toggleMenu}>
          &#9776;
        </div>
        <nav>
          <ul className={`nav-list ${isMenuOpen ? "open" : ""}`}>
            <li className="nav-item">
              <Link
                to="/"
                className={
                  location.pathname === "/" ? "nav-item active" : "nav-item"
                }
              >
                Home
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
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
