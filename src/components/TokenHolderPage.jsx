import { useState } from "react";
import VerminMarketData from "./VerminMarketData";
import RaydiumSwapChart from "./RaydiumSwapChart";
import Collectibles from "./Collectibles";

const TokenHolderPage = () => {
  const [activeSection, setActiveSection] = useState("Market Data");

  const sections = ["Market Data", "Chart and Swaps", "Collectibles"];

  return (
    <div style={{ padding: "20px" }}>
      {/* NavMenu */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor:
                activeSection === section ? "#FFD700" : "#f0f0f0",
              cursor: "pointer",
              fontWeight: activeSection === section ? "bold" : "normal",
            }}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Active Section */}
      <div>
        {activeSection === "Market Data" && <VerminMarketData />}
        {activeSection === "Chart and Swaps" && <RaydiumSwapChart />}
        {activeSection === "Collectibles" && <Collectibles />}
      </div>
    </div>
  );
};

export default TokenHolderPage;
