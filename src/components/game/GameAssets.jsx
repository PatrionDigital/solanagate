import { useState, useEffect } from "react";
import ProjectSelector from "./ProjectSelector";
import { useProject } from "@/hooks/useProject";
import { useWalletContext } from "@/contexts/WalletContext";
import "@/styles/GameAssets.css";

/**
 * GameAssets component displays game assets (NFTs, characters, etc.) for selected projects
 */
const GameAssets = () => {
  const { state } = useProject();
  const { publicKey } = useWalletContext();
  const [selectedProject, setSelectedProject] = useState("all");
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get characters for the selected project
  useEffect(() => {
    setIsLoading(true);

    // Delay to simulate API call
    const timer = setTimeout(() => {
      let filteredAssets = [];

      if (selectedProject === "all") {
        // Get assets for all active projects
        filteredAssets = state.characters;
      } else if (selectedProject && selectedProject !== "all") {
        // Get assets for specific project
        filteredAssets = state.characters.filter(
          (asset) => asset.projectAddress === selectedProject.address
        );
      }

      setAssets(filteredAssets);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedProject, state.characters]);

  // Handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="game-assets game-assets--loading">
        <ProjectSelector
          onSelectProject={handleProjectSelect}
          selectedProject={
            selectedProject === "all" ? "all" : selectedProject?.address
          }
        />
        <div className="game-assets__loading">
          <span>Loading assets...</span>
        </div>
      </div>
    );
  }

  // If no wallet connected
  if (!publicKey) {
    return (
      <div className="game-assets game-assets--no-wallet">
        <div className="game-assets__connect-prompt">
          <p>Connect your wallet to view your game assets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-assets">
      <h3 className="game-assets__title">Game Assets</h3>

      <ProjectSelector
        onSelectProject={handleProjectSelect}
        selectedProject={
          selectedProject === "all" ? "all" : selectedProject?.address
        }
      />

      {assets.length === 0 ? (
        <div className="game-assets__empty">
          <p>No assets found for the selected project</p>
          <p className="game-assets__empty-info">
            Complete in-game activities to earn assets or purchase them from the
            marketplace
          </p>
        </div>
      ) : (
        <>
          <div className="game-assets__count">
            Showing {assets.length} asset{assets.length !== 1 ? "s" : ""}
          </div>

          <div className="game-assets-grid">
            {assets.map((asset) => (
              <div key={asset.id} className="game-asset-item">
                <div className="game-asset-item__image-container">
                  {asset.imageUrl ? (
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="game-asset-item__image"
                    />
                  ) : (
                    <div className="game-asset-item__placeholder">
                      {asset.name?.charAt(0) || "?"}
                    </div>
                  )}

                  {asset.isSleeping && (
                    <div className="game-asset-item__status game-asset-item__status--sleeping">
                      💤
                    </div>
                  )}

                  {asset.level && (
                    <div className="game-asset-item__level">
                      LVL {asset.level}
                    </div>
                  )}
                </div>

                <div className="game-asset-item__info">
                  <h4 className="game-asset-item__name">
                    {asset.name || "Unnamed Asset"}
                  </h4>

                  {asset.type && (
                    <div className="game-asset-item__type">{asset.type}</div>
                  )}

                  {asset.attributes && asset.attributes.length > 0 && (
                    <div className="game-asset-item__attributes">
                      {asset.attributes.map((attr, idx) => (
                        <div key={idx} className="game-asset-item__attribute">
                          <span className="game-asset-item__attribute-name">
                            {attr.trait_type}:
                          </span>
                          <span className="game-asset-item__attribute-value">
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="game-asset-item__actions">
                  <button className="game-asset-item__action-btn game-asset-item__action-btn--view">
                    View Details
                  </button>
                  <button className="game-asset-item__action-btn game-asset-item__action-btn--use">
                    Use in Game
                  </button>
                </div>
              </div>
            ))}
          </div>

          {assets.length > 8 && (
            <div className="game-assets__pagination">
              <button className="game-assets__pagination-btn" disabled>
                Previous
              </button>
              <span className="game-assets__pagination-info">Page 1 of 1</span>
              <button className="game-assets__pagination-btn" disabled>
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Fallback for no active projects */}
      {state.projects.length === 0 && (
        <div className="game-assets__no-projects">
          <p>No game projects are currently available.</p>
          <p>Check back later for updates!</p>
        </div>
      )}
    </div>
  );
};

export default GameAssets;
