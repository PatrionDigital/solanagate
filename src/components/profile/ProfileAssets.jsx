import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useProfile from "@/hooks/useProfile";

/**
 * Component to display user assets (NFTs, tokens, etc.)
 */
const ProfileAssets = ({ className = "", limit = 0 }) => {
  const { assets, assetsLoading, fetchUserAssets } = useProfile();
  const [filter, setFilter] = useState("all");
  const [displayedAssets, setDisplayedAssets] = useState([]);

  // Apply filtering and limiting
  useEffect(() => {
    let filtered = [...assets];

    // Filter by type if not "all"
    if (filter !== "all") {
      filtered = assets.filter((asset) => {
        switch (filter) {
          case "nft":
            return !asset.isCompressed && !asset.isProgrammableNft;
          case "pnft":
            return !!asset.isProgrammableNft;
          case "cnft":
            return !!asset.isCompressed;
          case "token":
            return asset.tokenStandard === "TOKEN_2022";
          default:
            return true;
        }
      });
    }

    // Apply limit if provided
    if (limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    setDisplayedAssets(filtered);
  }, [assets, filter, limit]);

  // Force refresh of assets
  const handleRefresh = async () => {
    await fetchUserAssets();
  };

  // Render loading state
  if (assetsLoading) {
    return (
      <div className={`profile-assets profile-assets--loading ${className}`}>
        <div className="profile-assets__loading">
          <span>Loading assets...</span>
        </div>
      </div>
    );
  }

  // No assets state
  if (!assets || assets.length === 0) {
    return (
      <div className={`profile-assets profile-assets--empty ${className}`}>
        <div className="profile-assets__empty">
          <h3 className="profile-assets__empty-title">No Assets Found</h3>
          <p className="profile-assets__empty-message">
            You don&apos;t have any assets in your wallet yet.
          </p>
          <button
            onClick={handleRefresh}
            className="profile-assets__refresh-button"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Render assets grid
  return (
    <div className={`profile-assets ${className}`}>
      <div className="profile-assets__header">
        <h3 className="profile-assets__title">Your Assets</h3>

        <div className="profile-assets__filters">
          <button
            className={`profile-assets__filter ${
              filter === "all" ? "profile-assets__filter--active" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`profile-assets__filter ${
              filter === "nft" ? "profile-assets__filter--active" : ""
            }`}
            onClick={() => setFilter("nft")}
          >
            NFTs
          </button>
          <button
            className={`profile-assets__filter ${
              filter === "pnft" ? "profile-assets__filter--active" : ""
            }`}
            onClick={() => setFilter("pnft")}
          >
            PNFTs
          </button>
          <button
            className={`profile-assets__filter ${
              filter === "cnft" ? "profile-assets__filter--active" : ""
            }`}
            onClick={() => setFilter("cnft")}
          >
            CNFTs
          </button>
          <button
            className={`profile-assets__filter ${
              filter === "token" ? "profile-assets__filter--active" : ""
            }`}
            onClick={() => setFilter("token")}
          >
            Token-2022
          </button>
        </div>

        <button
          onClick={handleRefresh}
          className="profile-assets__refresh-button"
        >
          Refresh
        </button>
      </div>

      {displayedAssets.length === 0 ? (
        <div className="profile-assets__empty">
          <p className="profile-assets__empty-message">
            No assets found with the selected filter.
          </p>
        </div>
      ) : (
        <div className="profile-assets__grid">
          {displayedAssets.map((asset, index) => (
            <div
              key={`${asset.mint.toString()}-${index}`}
              className="profile-assets__item"
            >
              <div className="profile-assets__asset">
                {asset.json?.image || asset.links?.image ? (
                  <img
                    src={asset.json?.image || asset.links?.image}
                    alt={asset.name}
                    className="profile-assets__asset-image"
                  />
                ) : (
                  <div className="profile-assets__asset-placeholder">
                    {asset.name?.charAt(0) || "A"}
                  </div>
                )}

                {asset.isCompressed && (
                  <span className="profile-assets__asset-badge profile-assets__asset-badge--compressed">
                    cNFT
                  </span>
                )}

                {asset.isProgrammableNft && (
                  <span className="profile-assets__asset-badge profile-assets__asset-badge--programmable">
                    pNFT
                  </span>
                )}
              </div>

              <div className="profile-assets__asset-info">
                <h4 className="profile-assets__asset-name">
                  {asset.name || "Unnamed Asset"}
                </h4>

                {asset.collection && (
                  <p className="profile-assets__asset-collection">
                    Collection:{" "}
                    {asset.collection.address.toString().slice(0, 4)}...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {limit > 0 && assets.length > limit && (
        <div className="profile-assets__more">
          <a href="/assets" className="profile-assets__more-link">
            View All Assets
          </a>
        </div>
      )}
    </div>
  );
};

ProfileAssets.propTypes = {
  className: PropTypes.string,
  limit: PropTypes.number,
};

export default ProfileAssets;
