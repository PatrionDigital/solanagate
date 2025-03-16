import { useState } from "react";
import { useWalletContext } from "@/contexts/WalletContext";
import ProfileManager from "../profile/ProfileManager";
import "@/styles/GameProfiles.css";

/**
 * GameProfiles component serves as the entry point for user profile management across games
 */
const GameProfiles = () => {
  const { publicKey } = useWalletContext();
  const [activeTab, setActiveTab] = useState("profiles"); // 'profiles', 'badges', 'stats'

  // If no wallet is connected, show connection prompt
  if (!publicKey) {
    return (
      <div className="game-profiles game-profiles--no-wallet">
        <h3 className="game-profiles__title">Game Profiles</h3>
        <div className="game-profiles__connect-prompt">
          <p>Connect your wallet to manage your game profiles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-profiles">
      <h3 className="game-profiles__title">Game Profiles</h3>

      <div className="game-profiles__tabs">
        <button
          className={`game-profiles__tab ${
            activeTab === "profiles" ? "game-profiles__tab--active" : ""
          }`}
          onClick={() => setActiveTab("profiles")}
        >
          Your Profiles
        </button>

        <button
          className={`game-profiles__tab ${
            activeTab === "badges" ? "game-profiles__tab--active" : ""
          }`}
          onClick={() => setActiveTab("badges")}
        >
          Badges & Achievements
        </button>

        <button
          className={`game-profiles__tab ${
            activeTab === "stats" ? "game-profiles__tab--active" : ""
          }`}
          onClick={() => setActiveTab("stats")}
        >
          Game Stats
        </button>
      </div>

      <div className="game-profiles__content">
        {activeTab === "profiles" && (
          <ProfileManager className="game-profiles__manager" />
        )}

        {activeTab === "badges" && (
          <div className="game-profiles__badges">
            <div className="game-profiles__coming-soon">
              <h4>Badges & Achievements</h4>
              <p>This feature is coming soon!</p>
              <p>
                Complete in-game activities to earn badges and showcase your
                achievements.
              </p>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="game-profiles__stats">
            <div className="game-profiles__coming-soon">
              <h4>Game Statistics</h4>
              <p>This feature is coming soon!</p>
              <p>
                Track your progress and compare stats across different games.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameProfiles;
