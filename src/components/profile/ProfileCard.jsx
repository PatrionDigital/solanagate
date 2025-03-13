import PropTypes from "prop-types";
import { useWallet } from "@solana/wallet-adapter-react";
import useProfile from "@/hooks/useProfile";
import { formatPublicKey } from "@/utils/honeycombHelpers";

/**
 * Component to display user profile information
 */
const ProfileCard = ({ showEditButton = true, className = "" }) => {
  const { publicKey } = useWallet();
  const {
    profileLoading,
    profileName,
    profileImage,
    profileBio,
    profileAttributes,
    hasProfile,
  } = useProfile();

  // Format wallet address for display
  const formattedWallet = formatPublicKey(publicKey?.toString());

  // Handle case where profile is loading
  if (profileLoading) {
    return (
      <div className={`profile-card profile-card--loading ${className}`}>
        <div className="profile-card__loading-indicator">
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Handle case where no profile exists
  if (!hasProfile && !profileLoading) {
    return (
      <div className={`profile-card profile-card--empty ${className}`}>
        <div className="profile-card__header">
          <h3 className="profile-card__title">No Profile</h3>
        </div>
        <div className="profile-card__body">
          <p className="profile-card__wallet">{formattedWallet}</p>
          <p className="profile-card__message">
            You haven&apos;t created a profile yet.
          </p>
          {showEditButton && (
            <a href="/profile/create" className="profile-card__create-button">
              Create Profile
            </a>
          )}
        </div>
      </div>
    );
  }

  // Render profile information
  return (
    <div className={`profile-card ${className}`}>
      <div className="profile-card__header">
        <div className="profile-card__avatar">
          {profileImage ? (
            <img
              src={profileImage}
              alt={profileName || "Profile"}
              className="profile-card__avatar-image"
            />
          ) : (
            <div className="profile-card__avatar-placeholder">
              {profileName?.charAt(0) || formattedWallet?.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div className="profile-card__info">
          <h3 className="profile-card__name">
            {profileName || "Unnamed User"}
          </h3>
          <p className="profile-card__wallet">{formattedWallet}</p>
        </div>
        {showEditButton && hasProfile && (
          <div className="profile-card__actions">
            <a href="/profile/edit" className="profile-card__edit-button">
              Edit Profile
            </a>
          </div>
        )}
      </div>

      {profileBio && (
        <div className="profile-card__bio">
          <p>{profileBio}</p>
        </div>
      )}

      {profileAttributes && profileAttributes.length > 0 && (
        <div className="profile-card__attributes">
          <h4 className="profile-card__attributes-title">Attributes</h4>
          <div className="profile-card__attributes-list">
            {profileAttributes.map((attr, index) => (
              <div key={index} className="profile-card__attribute">
                <span className="profile-card__attribute-name">
                  {attr.trait_type}:
                </span>
                <span className="profile-card__attribute-value">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ProfileCard.propTypes = {
  showEditButton: PropTypes.bool,
  className: PropTypes.string,
};

export default ProfileCard;
