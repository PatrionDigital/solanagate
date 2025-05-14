import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaInfoCircle } from "react-icons/fa";
import { IoPersonCircleOutline, IoHome, IoGameController } from "react-icons/io5";
import { Button } from "@windmill/react-ui";
import logo from "@/assets/logo.avif";
import UserInfoDisplay from "@/components/UserInfoDisplay";
import { useWalletContext } from "@/contexts/WalletContext";
// Tailwind handles styling, so no need for custom CSS


const Header = () => {
  const { connected, isTokenHolder, setIsTokenHolder } = useWalletContext();
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      setIsTokenHolder(false);
    }
  }, [connected, setIsTokenHolder]);

  const toggleMenu = (e, forceClose = false) => {
    if (e) e.stopPropagation();
    setNavMenuOpen(prev => forceClose ? false : !prev);
  };

  // Close menus when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setNavMenuOpen(false);
      setAccountMenuOpen(false);
    };

    // Listen for route changes
    const unlisten = () => {
      window.addEventListener('popstate', handleRouteChange);
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
      };
    };

    const unsub = unlisten();
    return () => unsub && unsub();
  }, []);

  // Temporary: Disabled click outside handler for debugging
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       navMenuOpen &&
  //       !event.target.closest(".nav-list") &&
  //       !event.target.closest(".hamburger-menu")
  //     ) {
  //       console.log('Closing menu from outside click');
  //       setNavMenuOpen(false);
  //     }
  //     if (
  //       accountMenuOpen &&
  //       !event.target.closest(".account-dropdown") &&
  //       !event.target.closest(".user-icon")
  //     ) {
  //       console.log('Closing account menu from outside click');
  //       setAccountMenuOpen(false);
  //     }
  //   };

  //   const handleCloseAccountMenu = () => {
  //     console.log('Closing account menu from custom event');
  //     setAccountMenuOpen(false);
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   document.addEventListener('close-account-menu', handleCloseAccountMenu);
    
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //     document.removeEventListener('close-account-menu', handleCloseAccountMenu);
  //   };
  // }, [navMenuOpen, accountMenuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full bg-headerBg/80 backdrop-blur shadow-md border-b border-gold z-50">
      <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="App Logo" className="h-10" />
        </Link>
        <nav className="hidden md:block">
          <ul className="flex gap-2 text-footerText font-medium">
            <li>
              <div 
                onClick={() => {
                  console.log('Home clicked - Desktop Nav');
                  navigate('/');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  location.pathname === '/' 
                    ? 'text-gold font-bold' 
                    : 'hover:text-gold'
                }`}
              >
                <IoHome size={18} />
                <span>Home</span>
              </div>
            </li>
            <li>
              <div 
                onClick={() => {
                  console.log('Games clicked - Desktop Nav');
                  navigate('/games');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  location.pathname.startsWith('/games')
                    ? 'text-gold font-bold' 
                    : 'hover:text-gold'
                }`}
              >
                <IoGameController size={18} />
                <span>Games</span>
              </div>
            </li>
            <li>
              <div 
                onClick={() => {
                  console.log('About clicked - Desktop Nav');
                  navigate('/about');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  location.pathname === '/about'
                    ? 'text-gold font-bold' 
                    : 'hover:text-gold'
                }`}
              >
                <FaInfoCircle size={18} />
                <span>About</span>
              </div>
            </li>
          </ul>
        </nav>
        {/* Hamburger menu for mobile */}
        <div className="md:hidden flex items-center">
          <Button 
            layout="link" 
            aria-label="Open Menu" 
            onClick={(e) => toggleMenu(e, false)} 
            className="hamburger-menu hover:text-gold focus:text-gold active:text-gold transition"
          >
            <span className="text-2xl">&#9776;</span>
          </Button>
        </div>
        {/* User menu */}
        <div className="relative ml-4">
          <Button 
            layout="link" 
            aria-label="User Menu" 
            onClick={(e) => {
              e.stopPropagation();
              setAccountMenuOpen(!accountMenuOpen);
            }} 
            className="p-0 user-icon hover:text-gold focus:text-gold active:text-gold transition"
          >
            <IoPersonCircleOutline size={32} className="text-gold hover:text-accent transition" />
          </Button>
          {accountMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-60 bg-menuBg/95 shadow-lg rounded-lg z-50 p-4"
              onClick={e => e.stopPropagation()}
            >
              {isTokenHolder ? (
                <UserInfoDisplay 
                  className="compressed-user-info" 
                  onLinkClick={() => setAccountMenuOpen(false)}
                />
              ) : (
                <div className="flex flex-col gap-2 items-center">
                  <p className="text-sm text-headerText">Connect wallet to login</p>
                  <WalletMultiButton className="w-full hover:text-gold focus:text-gold active:text-gold transition" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Mobile nav menu - Hybrid Approach */}
      {navMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setNavMenuOpen(false)}
        >
          <nav 
            className="md:hidden bg-headerBg/90 backdrop-blur border-t border-goldBorder absolute top-0 left-0 right-0 z-50"
            onClick={e => e.stopPropagation()}
          >
            <ul className="flex flex-col gap-3 py-3 px-4">
              <li>
                <div 
                  onClick={() => {
                    console.log('Home clicked - Programmatic Nav');
                    setNavMenuOpen(false);
                    navigate('/');
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-gold/20 text-gold' 
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <IoHome size={20} />
                  <span>Home</span>
                </div>
              </li>
              <li>
                <div 
                  onClick={() => {
                    console.log('Games clicked - Programmatic Nav');
                    setNavMenuOpen(false);
                    navigate('/games');
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    location.pathname.startsWith('/games')
                      ? 'bg-gold/20 text-gold' 
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <IoGameController size={20} />
                  <span>Games</span>
                </div>
              </li>
              <li>
                <div 
                  onClick={() => {
                    console.log('About clicked - Programmatic Nav');
                    setNavMenuOpen(false);
                    navigate('/about');
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    location.pathname === '/about'
                      ? 'bg-gold/20 text-gold' 
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <FaInfoCircle size={20} />
                  <span>About</span>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
