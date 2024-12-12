import { Link } from "react-router-dom";

// Header.jsx
import "./styles/Header.css"; // Import the CSS file

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">My App</div>
        <nav>
          <ul className="nav-list">
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
            <li className="nav-item">
              <Link
                to="/contact"
                className={
                  location.pathname === "/contact"
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
