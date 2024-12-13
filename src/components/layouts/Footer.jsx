import { IoLogoTwitter } from "react-icons/io";
import "@/styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">© 2024 My dApp. All rights reserved.</p>
        <div>
          <a
            href="https://twitter.com"
            className="footer-link"
            target="_blank"
            rel="noopener noref"
          >
            <IoLogoTwitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
