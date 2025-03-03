import { FaXTwitter } from "react-icons/fa6";
import { AiFillGithub } from "react-icons/ai";
import { SiSolana } from "react-icons/si";
import { FaTelegram } from "react-icons/fa";
import "@/styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p>© {currentYear} Vermin on Sol. All rights reserved.</p>
        </div>
        <div className="footer-center">
          <a
            href="https://github.com/PatrionDigital/solanagate"
            target="_blank"
            rel="noopener noreferrer"
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
            rel="noopener noreferrer"
            title="Vermin on Solana Contract Address"
          >
            <SiSolana size={20} className="footer-icon" />
          </a>
          <a
            href="https://t.me/verminverse"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
            title="Join our Telegram Group"
          >
            <FaTelegram size={20} className="footer-icon" />
          </a>
          <a
            href="https://x.com/verminsol"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on X/Twitter"
          >
            <FaXTwitter size={20} className="footer-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
