import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { Link } from "react-router-dom";

import { SiSolana } from "react-icons/si";
import { IoLogoTwitter } from "react-icons/io";
import { SiTelegram } from "react-icons/si";

// Style
import "@/styles/AboutLayout.css";

const AboutLayout = () => {
  return (
    <>
      <Header />
      <div className="about-layout-content">
        <h1>About Us</h1>
        <p>
          Welcome to the About page! Here&apos;s some information about our app
          and mission.
        </p>
        <div className="about-contract">
          <Link to="https://solscan.io/token/4fMRncxv5XvsdpAmDxttpjw7pTqPLqKQpyD36jtNpump">
            <SiSolana size={65} className="about-icon" />
          </Link>
          <p>Contract Address</p>
        </div>
        <div className="about-chart">
          <Link to="https://dexscreener.com/solana/4fMRncxv5XvsdpAmDxttpjw7pTqPLqKQpyD36jtNpump"></Link>
        </div>
        <div className="about-socials">
          <div className="social-icons">
            <Link to="https://t.me/verminverse">
              <SiTelegram
                size={55}
                className="about-icon"
                style={{ paddingRight: "15px" }}
              />
            </Link>
            <Link to="https://x.com/verminsol">
              <IoLogoTwitter
                size={55}
                className="about-icon"
                style={{ paddingLeft: "15px" }}
              />
            </Link>
          </div>
          <div className="social-text" style={{ visibility: "hidden" }}>
            <div>VerminVerse Telegram Group</div>
            <div>@VerminSol on X (Twitter)</div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutLayout;
