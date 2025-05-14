import { useState } from "react";
import { Card } from "@windmill/react-ui";
import VerminMarketData from "./VerminMarketData";
import VerminPriceChart from "./VerminPriceChart";
// Game Assets and Game Profiles are temporarily disabled
// import GameAssets from "./game/GameAssets";
// import GameProfiles from "./game/GameProfiles";

const TokenHolderPage = () => {
  const [activeSection, setActiveSection] = useState("Market Data");

  const sections = [
    "Market Data",
    "Chart and Swaps"
    // "Game Assets",  // Temporarily disabled
    // "Game Profiles"  // Temporarily disabled
  ];

  return (
    <div className="w-full min-w-full px-0">
      {/* Page Navigation */}
      <div className="w-full max-w-full mx-auto py-6 px-4">
        {/* Mobile selector: dropdown menu */}
        <div className="block md:hidden w-full mb-6 mt-4">
          <select
            className="w-full px-4 py-2 rounded-lg bg-[rgba(60,60,60,0.7)] text-gold border border-gold/40 focus:ring-2 focus:ring-gold/30 focus:outline-none font-semibold"
            value={activeSection}
            onChange={e => setActiveSection(e.target.value)}
          >
            {sections.map(section => (
              <option key={section} value={section} className="text-black">
                {section}
              </option>
            ))}
          </select>
        </div>
        {/* Desktop navigation */}
        <div className="hidden md:flex flex-wrap gap-2 justify-center mt-4 mb-6">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              className={`min-w-[140px] px-4 py-2 rounded-lg font-semibold border transition-all duration-150 outline-none focus:ring-2 focus:ring-gray-400/30 focus:z-10
                ${activeSection === section
                  ? "bg-gold/80 text-black font-bold border-gold cursor-default pointer-events-none"
                  : "bg-[rgba(60,60,60,0.7)] text-white border-gold/30 hover:bg-[rgba(60,60,60,0.9)] hover:border-gold/50 hover:text-gold focus:bg-[rgba(60,60,60,0.9)] focus:border-gold/50 focus:text-gold active:bg-[rgba(60,60,60,0.9)] active:border-gold/50 active:text-gold cursor-pointer"}
              `}
              onClick={() => setActiveSection(section)}
              tabIndex={0}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area - Full width container */}
      <div className="w-full">
        <Card className="p-4 sm:p-6 !bg-[rgba(50,50,50,0.8)] !ring-0 border border-gold rounded-lg shadow-lg backdrop-blur w-full overflow-x-auto">
          {activeSection === "Market Data" && <VerminMarketData />}
          {activeSection === "Chart and Swaps" && <VerminPriceChart />}
          {/* Temporarily disabled
          {activeSection === "Game Assets" && <GameAssets />}
          {activeSection === "Game Profiles" && <GameProfiles />}
          */}
        </Card>
      </div>
    </div>
  );
};

export default TokenHolderPage;
