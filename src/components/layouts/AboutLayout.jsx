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
              Vermin team is made of builders; people who want to build cool
              shit and share it with others so they can enjoy it and give
              feedback to make it better. It&apos;s what we&apos;re all about.
              We don&apos;t make big promises, we don&apos;t dump, we just
              build.
            </p>
          </div>

          <div className="meme-vibe">
            <p>
              We&apos;re not your average token project. We&apos;re a dedicated
              team of builders creating real experiences while others are busy
              making elaborate roadmaps.
            </p>
            <p>
              No empty promises, no short-term plays - just solid development.
            </p>

            <p>
              While others might lose focus during market fluctuations, we stay
              committed to our code. This isn&apos;t just another token,
              it&apos;s a community-driven project. We&apos;re building utility
              that adds genuine value to the ecosystem.
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
