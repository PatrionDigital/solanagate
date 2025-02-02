import { IoLogoTwitter } from "react-icons/io";
import { AiFillGithub } from "react-icons/ai";
import { SiSolana } from "react-icons/si";
import "@/styles/Footer.css";

const currentYear = new Date().getFullYear();
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p>
            © <span>{currentYear}</span> Vermin on Sol. All rights reserved.
          </p>
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
            href={`https://dexscreener.com/solana/${
              import.meta.env.VITE_TOKEN_MINT_ADDRESS
            }`}
            className="footer-link"
            target="_blank"
            rel="noopener noref"
          >
            <SiSolana size={20} className="footer-icon" />
          </a>
          <a
            href="https://x.com/verminsol"
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
