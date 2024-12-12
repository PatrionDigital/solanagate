import "./styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">© 2024 My dApp. All rights reserved.</p>
        <div>
          <a href="https://twitter.com" className="footer-link">
            Twitter
          </a>
          |
          <a href="https://github.com" className="footer-link">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
