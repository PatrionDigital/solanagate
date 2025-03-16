import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useWalletContext } from "@/contexts/WalletContext";
import { useProject } from "@/hooks/useProject";
import ProfileCreator from "./ProfileCreator";
import ProjectSelector from "../game/ProjectSelector";

/**
 * Component for managing user profiles across projects
 */
const ProfileManager = ({ className = "", initialProject = null }) => {
  const { publicKey } = useWalletContext();
  const { state, getActiveProjects } = useProject();

  // State for active projects and profiles
  const [activeProjects, setActiveProjects] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedProject, setSelectedProject] = useState(initialProject);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileCreator, setShowProfileCreator] = useState(false);

  // Get active projects
  useEffect(() => {
    const projects = getActiveProjects();
    setActiveProjects(projects);

    // If an initial project was provided, make sure it's active
    if (initialProject) {
      const projectExists = projects.some((p) => p.address === initialProject);
      if (!projectExists) {
        setSelectedProject(null);
      }
    } else if (projects.length > 0 && !selectedProject) {
      // Auto-select first project if none is selected
      setSelectedProject(projects[0]);
    }
  }, [state.projects, getActiveProjects, initialProject, selectedProject]);

  // Fetch profiles for the connected wallet
  const fetchProfiles = useCallback(async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError("");

    try {
      // In a real implementation, this would call the Honeycomb API
      // to fetch profiles for the current wallet

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo, we'll generate some sample profiles
      // In a real app, this would come from the blockchain/API
      const mockProfiles = activeProjects.map((project, index) => ({
        id: `profile-${index}`,
        projectAddress: project.address,
        wallet: publicKey.toString(),
        data: {
          name: `${project.name} Player`,
          bio: `This is my profile for ${project.name}`,
          image: "",
          attributes: [
            {
              trait_type: "experience",
              value: Math.floor(Math.random() * 1000).toString(),
            },
            {
              trait_type: "level",
              value: Math.floor(Math.random() * 10 + 1).toString(),
            },
          ],
        },
        createdAt: new Date().toISOString(),
      }));

      // Randomly remove some profiles to show creation UI
      const filteredProfiles = mockProfiles.filter(() => Math.random() > 0.3);

      setProfiles(filteredProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setError("Failed to load your profiles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, activeProjects]);

  // Fetch profiles when wallet or projects change
  useEffect(() => {
    if (activeProjects.length > 0) {
      fetchProfiles();
    } else {
      setProfiles([]);
      setIsLoading(false);
    }
  }, [activeProjects, fetchProfiles]);

  // Handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowProfileCreator(false);
  };

  // Handle profile creation
  const handleProfileCreated = (newProfile) => {
    setProfiles([...profiles, newProfile]);
    setShowProfileCreator(false);
  };

  // Get profile for selected project
  const getSelectedProjectProfile = () => {
    if (!selectedProject) return null;
    return profiles.find(
      (profile) => profile.projectAddress === selectedProject.address
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`profile-manager profile-manager--loading ${className}`}>
        <div className="profile-manager__loading">
          <span>Loading your profiles...</span>
        </div>
      </div>
    );
  }

  // No wallet connected
  if (!publicKey) {
    return (
      <div
        className={`profile-manager profile-manager--no-wallet ${className}`}
      >
        <div className="profile-manager__message">
          <p>Please connect your wallet to manage your game profiles</p>
        </div>
      </div>
    );
  }

  // No active projects
  if (activeProjects.length === 0) {
    return (
      <div
        className={`profile-manager profile-manager--no-projects ${className}`}
      >
        <div className="profile-manager__message">
          <h3>No Active Games</h3>
          <p>
            There are currently no active games available to create profiles
            for.
          </p>
        </div>
      </div>
    );
  }

  // Main profile manager UI
  return (
    <div className={`profile-manager ${className}`}>
      <div className="profile-manager__header">
        <h3 className="profile-manager__title">Game Profiles</h3>

        <ProjectSelector
          label="Select Game:"
          selectedProject={selectedProject?.address || ""}
          onSelectProject={handleProjectSelect}
          showAllOption={false}
          className="profile-manager__project-selector"
        />
      </div>

      {error && <div className="profile-manager__error">{error}</div>}

      {selectedProject && !showProfileCreator && (
        <div className="profile-manager__content">
          {getSelectedProjectProfile() ? (
            // Display existing profile
            <div className="profile-manager__profile">
              <div className="profile-manager__profile-header">
                <h4 className="profile-manager__profile-name">
                  {getSelectedProjectProfile().data.name}
                </h4>
                <div className="profile-manager__profile-date">
                  Created:{" "}
                  {new Date(
                    getSelectedProjectProfile().createdAt
                  ).toLocaleDateString()}
                </div>
              </div>

              <div className="profile-manager__profile-content">
                <div className="profile-manager__profile-avatar">
                  {getSelectedProjectProfile().data.image ? (
                    <img
                      src={getSelectedProjectProfile().data.image}
                      alt="Profile avatar"
                      className="profile-manager__avatar-img"
                    />
                  ) : (
                    <div className="profile-manager__avatar-placeholder">
                      {getSelectedProjectProfile().data.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="profile-manager__profile-details">
                  <div className="profile-manager__profile-bio">
                    {getSelectedProjectProfile().data.bio || "No bio provided"}
                  </div>

                  <div className="profile-manager__profile-attributes">
                    {getSelectedProjectProfile().data.attributes?.map(
                      (attr, index) => (
                        <div key={index} className="profile-manager__attribute">
                          <span className="profile-manager__attribute-name">
                            {attr.trait_type}:
                          </span>
                          <span className="profile-manager__attribute-value">
                            {attr.value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-manager__profile-actions">
                <button className="profile-manager__button profile-manager__button--edit">
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            // No profile exists - show creation prompt
            <div className="profile-manager__no-profile">
              <h4 className="profile-manager__no-profile-title">
                You don&apos;t have a profile for {selectedProject.name} yet
              </h4>
              <p className="profile-manager__no-profile-text">
                Create a profile to save your progress and customize your
                in-game experience.
              </p>
              <button
                className="profile-manager__button profile-manager__button--create"
                onClick={() => setShowProfileCreator(true)}
              >
                Create Profile
              </button>
            </div>
          )}
        </div>
      )}

      {showProfileCreator && selectedProject && (
        <ProfileCreator
          projectAddress={selectedProject.address}
          onProfileCreated={handleProfileCreated}
          onCancel={() => setShowProfileCreator(false)}
          className="profile-manager__creator"
        />
      )}

      {/* Display all profiles summary */}
      {profiles.length > 0 && !showProfileCreator && (
        <div className="profile-manager__profiles-summary">
          <h4 className="profile-manager__summary-title">
            All Your Game Profiles
          </h4>

          <div className="profile-manager__profiles-grid">
            {profiles.map((profile) => {
              const project = activeProjects.find(
                (p) => p.address === profile.projectAddress
              );
              return (
                <div
                  key={profile.id}
                  className={`profile-manager__profile-card ${
                    selectedProject?.address === profile.projectAddress
                      ? "profile-manager__profile-card--active"
                      : ""
                  }`}
                  onClick={() => handleProjectSelect(project)}
                >
                  <div className="profile-manager__card-avatar">
                    {profile.data.image ? (
                      <img
                        src={profile.data.image}
                        alt={profile.data.name}
                        className="profile-manager__card-avatar-img"
                      />
                    ) : (
                      <div className="profile-manager__card-avatar-placeholder">
                        {profile.data.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="profile-manager__card-info">
                    <div className="profile-manager__card-name">
                      {profile.data.name}
                    </div>
                    <div className="profile-manager__card-game">
                      {project?.name || "Unknown Game"}
                    </div>

                    {profile.data.attributes?.find(
                      (a) => a.trait_type === "level"
                    ) && (
                      <div className="profile-manager__card-level">
                        Level{" "}
                        {
                          profile.data.attributes.find(
                            (a) => a.trait_type === "level"
                          ).value
                        }
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Show missing profiles as "Create" cards */}
            {activeProjects.map((project) => {
              const hasProfile = profiles.some(
                (p) => p.projectAddress === project.address
              );
              if (!hasProfile) {
                return (
                  <div
                    key={`create-${project.address}`}
                    className="profile-manager__profile-card profile-manager__profile-card--create"
                    onClick={() => {
                      setSelectedProject(project);
                      setShowProfileCreator(true);
                    }}
                  >
                    <div className="profile-manager__card-create-icon">+</div>
                    <div className="profile-manager__card-info">
                      <div className="profile-manager__card-name">
                        Create Profile
                      </div>
                      <div className="profile-manager__card-game">
                        {project.name}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

ProfileManager.propTypes = {
  className: PropTypes.string,
  initialProject: PropTypes.object,
};

export default ProfileManager;
