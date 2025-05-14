import { FaXTwitter } from "react-icons/fa6";
import { AiFillGithub } from "react-icons/ai";
import { SiSolana } from "react-icons/si";
import { FaTelegram } from "react-icons/fa";
// Tailwind handles styling, remove custom CSS

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[rgba(50,50,50,0.8)] border-t border-gold z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-6">
        <div className="text-footerText text-sm mb-2 md:mb-0">
          © {currentYear} <span className="font-bold text-gold">Vermin on Sol</span>. All rights reserved.
        </div>
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <a
            href="https://github.com/PatrionDigital/solanagate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-footerText hover:text-gold focus:text-gold active:text-gold transition"
          >
            <AiFillGithub size={18} />
            <span className="hidden sm:inline">Built with SolanaGate</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`https://dexscreener.com/solana/${import.meta.env.VITE_TOKEN_MINT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Vermin on Solana Contract Address"
            className="hover:text-gold focus:text-gold active:text-gold transition"
          >
            <SiSolana size={20} />
          </a>
          <a
            href="https://t.me/verminverse"
            target="_blank"
            rel="noopener noreferrer"
            title="Join our Telegram Group"
            className="hover:text-gold focus:text-gold active:text-gold transition"
          >
            <FaTelegram size={20} />
          </a>
          <a
            href="https://x.com/verminsol"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on X/Twitter"
            className="hover:text-gold focus:text-gold active:text-gold transition"
          >
            <FaXTwitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
