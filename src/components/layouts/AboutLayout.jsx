import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { Link } from "react-router-dom";

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
        <p>We provide an amazing platform for users to engage and explore!</p>
        <div className="about-contract">
          https://solscan.io/token/4fMRncxv5XvsdpAmDxttpjw7pTqPLqKQpyD36jtNpump
        </div>
        <div className="about-chart">
          https://dexscreener.com/solana/4fMRncxv5XvsdpAmDxttpjw7pTqPLqKQpyD36jtNpump
        </div>
        <div className="about-socials">
          <Link to="https://t.me/verminverse"></Link>
          <Link to="https://x.com/verminsol"></Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutLayout;
