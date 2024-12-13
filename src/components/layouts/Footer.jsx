import { IoLogoTwitter } from "react-icons/io";
import { AiFillGithub } from "react-icons/ai";
import "@/styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p>© 2024 My dApp. All rights reserved.</p>
        </div>
        <div className="footer-center">
          <a
            href="https://github.com/PatrionDigital/solanagate"
            target="_blank"
            rel="noopener noreferror"
            className="footer-solanagate"
          >
            Built with SolanaGate
            <AiFillGithub className="footer-icon" />
          </a>
        </div>
        <div className="footer-right">
          <a
            href="https://twitter.com"
            className="footer-link"
            target="_blank"
            rel="noopener noref"
          >
            <IoLogoTwitter size={20} className="footer-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
