import { useState } from "react";
import VerminMarketData from "./VerminMarketData";
import VerminPriceChart from "./VerminPriceChart";
import GameAssets from "./game/GameAssets";
import GameProfiles from "./game/GameProfiles";
import "@/styles/TokenHolderPage.css";

const TokenHolderPage = () => {
  const [activeSection, setActiveSection] = useState("Market Data");

  const sections = [
    "Market Data",
    "Chart and Swaps",
    "Game Assets",
    "Game Profiles",
  ];

  return (
    <div className="token-holder-page">
      {/* Navigation menu with button styling matching screenshot */}
      <div className="token-holder-nav">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={activeSection === section ? "active" : ""}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Active Section */}
      <div className="token-content-section">
        {activeSection === "Market Data" && <VerminMarketData />}
        {activeSection === "Chart and Swaps" && <VerminPriceChart />}
        {activeSection === "Game Assets" && <GameAssets />}
        {activeSection === "Game Profiles" && <GameProfiles />}
      </div>
    </div>
  );
};

export default TokenHolderPage;
