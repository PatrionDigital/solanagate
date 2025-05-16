import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWalletContext } from "@/contexts/WalletContext";
import { useProject } from "@/hooks/useProject";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * Component for creating a new profile for a specific project
 */
const ProfileCreator = ({
  projectAddress,
  onProfileCreated,
  onCancel,
  className = "",
}) => {
  const { publicKey } = useWalletContext();
  const { state } = useProject();

  // Form state
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    avatarUrl: "",
    avatarFile: null,
    attributes: [
      { trait_type: "experience", value: "0" },
      { trait_type: "level", value: "1" },
    ],
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [projectInfo, setProjectInfo] = useState(null);

  // Get project info based on address
  useEffect(() => {
    if (projectAddress) {
      const project = state.projects.find((p) => p.address === projectAddress);
      if (project) {
        setProjectInfo(project);
      } else {
        setError("Project not found");
      }
    }
  }, [projectAddress, state.projects]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar file upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a URL for preview
    const previewUrl = URL.createObjectURL(file);

    setProfileData((prev) => ({
      ...prev,
      avatarUrl: previewUrl,
      avatarFile: file,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!publicKey) {
      setError("Wallet not connected");
      return;
    }

    if (!profileData.name.trim()) {
      setError("Profile name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate profile creation API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real implementation, this would involve creating a transaction
      // and calling the Honeycomb API to create a profile

      // Create profile data to return
      const newProfile = {
        id: `profile-${Date.now()}`,
        projectAddress,
        wallet: publicKey.toString(),
        data: {
          name: profileData.name,
          bio: profileData.bio,
          image: profileData.avatarUrl,
          attributes: profileData.attributes,
        },
        createdAt: new Date().toISOString(),
      };

      // Call the success callback with the new profile
      if (onProfileCreated) {
        onProfileCreated(newProfile);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setError(error.message || "Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state until project is found
  if (!projectInfo && !error) {
    return <LoadingSpinner message="Loading project information..." />;
  }

  // Show error if project not found
  if (error && !projectInfo) {
    return (
      <div className={`profile-creator profile-creator--error ${className}`}>
        <div className="profile-creator__error">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={onCancel} className="profile-creator__button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-creator ${className}`}>
      <div className="profile-creator__header">
        <h3 className="profile-creator__title">
          Create Profile for {projectInfo?.name || "Game"}
        </h3>
      </div>

      {error && <div className="profile-creator__error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="profile-creator__form">
        <div className="profile-creator__form-group">
          <label htmlFor="name" className="profile-creator__label">
            Profile Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            className="profile-creator__input"
            placeholder="Enter a name for your profile"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="profile-creator__form-group">
          <label htmlFor="bio" className="profile-creator__label">
            Biography
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            className="profile-creator__textarea"
            placeholder="Tell us about yourself (optional)"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="profile-creator__form-group">
          <label className="profile-creator__label">Profile Avatar</label>

          <div className="profile-creator__avatar-section">
            {profileData.avatarUrl ? (
              <div className="profile-creator__avatar-preview">
                <img
                  src={profileData.avatarUrl}
                  alt="Avatar preview"
                  className="profile-creator__avatar-image"
                />
                <button
                  type="button"
                  onClick={() =>
                    setProfileData((prev) => ({
                      ...prev,
                      avatarUrl: "",
                      avatarFile: null,
                    }))
                  }
                  className="profile-creator__avatar-remove"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="profile-creator__avatar-upload">
                <label
                  htmlFor="avatar-file"
                  className="profile-creator__avatar-label"
                >
                  Upload Avatar
                </label>
                <input
                  type="file"
                  id="avatar-file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="profile-creator__avatar-input"
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>

        <div className="profile-creator__form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="profile-creator__button profile-creator__button--cancel"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="profile-creator__button profile-creator__button--submit"
            disabled={isSubmitting || !profileData.name.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="profile-creator__spinner"></span>
                Creating...
              </>
            ) : (
              "Create Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

ProfileCreator.propTypes = {
  projectAddress: PropTypes.string.isRequired,
  onProfileCreated: PropTypes.func,
  onCancel: PropTypes.func,
  className: PropTypes.string,
};

export default ProfileCreator;
