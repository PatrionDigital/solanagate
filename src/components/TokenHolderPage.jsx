import { useState } from "react";
import VerminMarketData from "./VerminMarketData";
import VerminPriceChart from "./VerminPriceChart";
import Collectibles from "./Collectibles";
import "@/styles/TokenHolderPage.css";

const TokenHolderPage = () => {
  const [activeSection, setActiveSection] = useState("Market Data");

  const sections = ["Market Data", "Chart and Swaps", "Collectibles"];

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      {/* NavMenu */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
          width: "100%",
          minWidth: "80%",
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
              color: activeSection === section ? "#000" : "#FFD700",
              cursor: "pointer",
              fontWeight: activeSection === section ? "bold" : "normal",
            }}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Active Section */}
      <div style={{ width: "100%" }}>
        {activeSection === "Market Data" && <VerminMarketData />}
        {activeSection === "Chart and Swaps" && <VerminPriceChart />}
        {activeSection === "Collectibles" && <Collectibles />}
      </div>
    </div>
  );
};

export default TokenHolderPage;
