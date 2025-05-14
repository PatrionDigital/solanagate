import { FaXTwitter } from "react-icons/fa6";
import { AiFillGithub } from "react-icons/ai";
import { SiSolana } from "react-icons/si";
import { FaTelegram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[rgba(50,50,50,0.8)] border-t border-gold z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="text-footerText text-sm">
            © {currentYear} <span className="font-bold text-gold">Vermin on Sol</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/PatrionDigital/solanagate"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
              className="text-footerText hover:text-gold transition-colors"
            >
              <AiFillGithub size={22} />
            </a>
            <a
              href={`https://dexscreener.com/solana/${import.meta.env.VITE_TOKEN_MINT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Vermin on Solana Contract Address"
              className="text-footerText hover:text-gold transition-colors"
            >
              <SiSolana size={20} />
            </a>
            <a
              href="https://t.me/verminverse"
              target="_blank"
              rel="noopener noreferrer"
              title="Join our Telegram Group"
              className="text-footerText hover:text-gold transition-colors"
            >
              <FaTelegram size={20} />
            </a>
            <a
              href="https://x.com/verminsol"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on X/Twitter"
              className="text-footerText hover:text-gold transition-colors"
            >
              <FaXTwitter size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center gap-3">
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/PatrionDigital/solanagate"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
              className="text-footerText hover:text-gold transition-colors"
            >
              <AiFillGithub size={22} />
            </a>
            <a
              href={`https://dexscreener.com/solana/${import.meta.env.VITE_TOKEN_MINT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Vermin on Solana Contract Address"
              className="text-footerText hover:text-gold transition-colors"
            >
              <SiSolana size={20} />
            </a>
            <a
              href="https://t.me/verminverse"
              target="_blank"
              rel="noopener noreferrer"
              title="Join our Telegram Group"
              className="text-footerText hover:text-gold transition-colors"
            >
              <FaTelegram size={20} />
            </a>
            <a
              href="https://x.com/verminsol"
              target="_blank"
              rel="noopener noreferrer"
              title="Follow us on X/Twitter"
              className="text-footerText hover:text-gold transition-colors"
            >
              <FaXTwitter size={20} />
            </a>
          </div>
          <div className="text-footerText text-xs text-center">
            © {currentYear} <span className="text-gold">Vermin on Sol</span>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
