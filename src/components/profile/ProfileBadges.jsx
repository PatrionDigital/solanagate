import { useState } from "react";
import PropTypes from "prop-types";
import useProfile from "@/hooks/useProfile";
import { formatBadgeData } from "@/utils/honeycombHelpers";

/**
 * Component to display user badges
 */
const ProfileBadges = ({ className = "" }) => {
  const { badges, badgesLoading, claimBadge } = useProfile();
  const [claimingIndex, setClaimingIndex] = useState(null);
  const [error, setError] = useState("");

  // Handle badge claim click
  const handleClaimBadge = async (badgeIndex) => {
    try {
      setClaimingIndex(badgeIndex);
      setError("");

      await claimBadge(badgeIndex);
    } catch (error) {
      console.error("Error claiming badge:", error);
      setError(error.message || "Failed to claim badge");
    } finally {
      setClaimingIndex(null);
    }
  };

  // Loading state
  if (badgesLoading) {
    return (
      <div className={`profile-badges profile-badges--loading ${className}`}>
        <div className="profile-badges__loading">
          <span>Loading badges...</span>
        </div>
      </div>
    );
  }

  // No badges state
  if (!badges || badges.length === 0) {
    return (
      <div className={`profile-badges profile-badges--empty ${className}`}>
        <div className="profile-badges__empty">
          <h3 className="profile-badges__empty-title">No Badges Yet</h3>
          <p className="profile-badges__empty-message">
            Complete actions within the application to earn badges.
          </p>
        </div>
      </div>
    );
  }

  // Render badges
  return (
    <div className={`profile-badges ${className}`}>
      <div className="profile-badges__header">
        <h3 className="profile-badges__title">Your Badges</h3>
      </div>

      {error && <div className="profile-badges__error">{error}</div>}

      <div className="profile-badges__grid">
        {badges.map((badge, index) => {
          const formattedBadge = formatBadgeData(badge);
          const isClaimed = !!formattedBadge.claimedAt;
          const isClaiming = claimingIndex === index;

          return (
            <div
              key={index}
              className={`profile-badges__item ${
                isClaimed ? "profile-badges__item--claimed" : ""
              }`}
            >
              <div className="profile-badges__badge">
                {formattedBadge.image ? (
                  <img
                    src={formattedBadge.image}
                    alt={formattedBadge.name}
                    className="profile-badges__badge-image"
                  />
                ) : (
                  <div className="profile-badges__badge-placeholder">
                    {formattedBadge.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>

              <div className="profile-badges__badge-info">
                <h4 className="profile-badges__badge-name">
                  {formattedBadge.name}
                </h4>

                {formattedBadge.description && (
                  <p className="profile-badges__badge-description">
                    {formattedBadge.description}
                  </p>
                )}

                {formattedBadge.claimedAt && (
                  <p className="profile-badges__badge-claimed-at">
                    Claimed:{" "}
                    {new Date(formattedBadge.claimedAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {!isClaimed && (
                <div className="profile-badges__badge-actions">
                  <button
                    onClick={() => handleClaimBadge(index)}
                    disabled={isClaiming}
                    className="profile-badges__claim-button"
                  >
                    {isClaiming ? "Claiming..." : "Claim Badge"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

ProfileBadges.propTypes = {
  className: PropTypes.string,
};

export default ProfileBadges;
