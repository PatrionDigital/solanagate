import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { Link } from "react-router-dom";

import { SiSolana } from "react-icons/si";
import { SiTelegram } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";

// Style
import "@/styles/AboutLayout.css";

const AboutLayout = () => {
  return (
    <>
      <Header />
      <div className="about-layout-content">
        <div className="about-mission">
          <div className="token-panel mission-panel">
            <p className="italic-text">
              Our team is made of builders; people who want to create innovative
              solutions and share them with the community. We believe in building
              quality products and continuously improving based on user feedback.
              We focus on delivering real value through thoughtful development and
              community engagement.
            </p>
          </div>

          <div className="meme-vibe">
            <p>
              We&apos;re a dedicated team of blockchain developers and designers
              committed to creating meaningful experiences in the Solana ecosystem.
              Our focus is on building practical solutions rather than making
              unrealistic promises.
            </p>
            <p>
              No empty promises, no short-term plays - just solid development.
            </p>

            <p>
              Our commitment remains strong regardless of market conditions.
              This is more than just a token; it&apos;s a platform designed to provide
              real utility and value to our community. We&apos;re focused on sustainable
              development and long-term growth.
            </p>

            <div className="community-claim">
              <p>
                <strong>Community Claim</strong>
              </p>
              <p>A community claimed ownership for this token on Dec 06 2024</p>

              <p className="italic-text">
                Those that CTO&apos;d the CTO bailed. A new CTO has CTO&apos;d
                the CTO of the CTO.
              </p>
            </div>
          </div>
        </div>

        <div className="icon-container">
          <div className="icon-item">
            <Link to="https://solscan.io/token/4fMRncxv5XvsdpAmDxttpjw7pTqPLqKQpyD36jtNpump">
              <SiSolana size={65} className="about-icon" />
            </Link>
            <p>Contract Address</p>
          </div>

          <div className="icon-item">
            <Link to="https://t.me/verminverse">
              <SiTelegram size={65} className="about-icon" />
            </Link>
            <p>Telegram Group</p>
          </div>

          <div className="icon-item">
            <Link to="https://x.com/verminsol">
              <FaXTwitter size={65} className="about-icon" />
            </Link>
            <p>X (Twitter)</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutLayout;
