import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWalletContext } from "@/contexts/WalletContext";

// Character Creation Form Component
const CharacterCreationForm = ({ onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    species: "basic",
    color: "#8bc34a",
    attributes: {
      hunger: 100,
      happiness: 100,
      energy: 100,
      health: 100,
    },
    customizations: {
      hasHat: false,
      hasGlasses: false,
      hasPendant: false,
    },
  });

  const speciesOptions = [
    { value: "basic", label: "Basic Vermin" },
    { value: "fuzzy", label: "Fuzzy Vermin" },
    { value: "spiky", label: "Spiky Vermin" },
    { value: "slimy", label: "Slimy Vermin" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [category, property] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [property]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a timestamp to use as part of the character ID
    const timestamp = Date.now();

    // Create the character data
    const characterData = {
      id: `char-${timestamp}`,
      ...formData,
      createdAt: new Date().toISOString(),
      lastFed: new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
      isSleeping: false,
      experience: 0,
      level: 1,
    };

    onSubmit(characterData);
  };

  return (
    <div className="character-form">
      <h3>Create New Vermi-gotchi Character</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Character Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="species">Species</label>
          <select
            id="species"
            name="species"
            value={formData.species}
            onChange={handleInputChange}
            disabled={isLoading}
          >
            {speciesOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="color">Color</label>
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-section">
          <h4>Customizations</h4>
          <div className="form-options">
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="customizations.hasHat"
                name="customizations.hasHat"
                checked={formData.customizations.hasHat}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <label htmlFor="customizations.hasHat">Hat</label>
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                id="customizations.hasGlasses"
                name="customizations.hasGlasses"
                checked={formData.customizations.hasGlasses}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <label htmlFor="customizations.hasGlasses">Glasses</label>
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                id="customizations.hasPendant"
                name="customizations.hasPendant"
                checked={formData.customizations.hasPendant}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <label htmlFor="customizations.hasPendant">Pendant</label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isLoading || !formData.name}
          >
            {isLoading ? "Creating..." : "Create Character"}
          </button>
        </div>
      </form>
    </div>
  );
};

CharacterCreationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

CharacterCreationForm.defaultProps = {
  isLoading: false,
};

// Character Card Component
const CharacterCard = ({
  character,
  onInteract,
  selectedProject,
  projectName,
}) => {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? "1 day ago" : `${interval} days ago`;
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    }

    return "just now";
  };

  // Calculate stat depletion based on time since last interaction
  const calculateCurrentStats = () => {
    const now = new Date();
    const lastFed = new Date(character.lastFed);
    const lastPlayed = new Date(character.lastPlayed);

    // Calculate hours since last interaction
    const hoursSinceLastFed = (now - lastFed) / (1000 * 60 * 60);
    const hoursSinceLastPlayed = (now - lastPlayed) / (1000 * 60 * 60);

    // Decrease stats based on elapsed time (2 points per hour)
    const decreaseRatePerHour = 2;

    // Calculate current stats
    const currentHunger = Math.max(
      0,
      character.attributes.hunger - hoursSinceLastFed * decreaseRatePerHour
    );
    const currentHappiness = Math.max(
      0,
      character.attributes.happiness -
        hoursSinceLastPlayed * decreaseRatePerHour
    );

    // Energy decreases when character is not sleeping
    const currentEnergy = character.isSleeping
      ? Math.min(
          100,
          character.attributes.energy +
            hoursSinceLastPlayed * decreaseRatePerHour
        )
      : Math.max(
          0,
          character.attributes.energy -
            hoursSinceLastPlayed * decreaseRatePerHour * 0.5
        );

    // Health decreases if hunger or happiness are low
    const healthDecrease =
      (100 - currentHunger) * 0.2 + (100 - currentHappiness) * 0.2;
    const currentHealth = Math.max(
      0,
      character.attributes.health - healthDecrease * 0.1
    );

    return {
      hunger: currentHunger,
      happiness: currentHappiness,
      energy: currentEnergy,
      health: currentHealth,
    };
  };

  const currentStats = calculateCurrentStats();

  // Species display names
  const speciesNames = {
    basic: "Basic Vermin",
    fuzzy: "Fuzzy Vermin",
    spiky: "Spiky Vermin",
    slimy: "Slimy Vermin",
  };

  return (
    <div className="character-card">
      <div className="character-header">
        <h3>{character.name}</h3>
        <div className="character-project">{projectName || "Unknown Game"}</div>
        <div className="character-level">Level {character.level}</div>
      </div>

      <div className="character-body">
        <div
          className="character-avatar"
          style={{ backgroundColor: character.color }}
        >
          {/* This would be a visual representation of the character */}
          <div className="character-species">{character.species}</div>

          {character.customizations.hasHat && (
            <div className="character-hat">🎩</div>
          )}
          {character.customizations.hasGlasses && (
            <div className="character-glasses">👓</div>
          )}
          {character.customizations.hasPendant && (
            <div className="character-pendant">📿</div>
          )}

          {character.isSleeping && <div className="sleeping-indicator">💤</div>}
        </div>

        <div className="character-stats">
          <div className="stat-item">
            <span className="stat-label">Hunger:</span>
            <div className="stat-bar">
              <div
                className="stat-fill"
                style={{
                  width: `${currentStats.hunger}%`,
                  backgroundColor:
                    currentStats.hunger < 30 ? "#f44336" : "#8bc34a",
                }}
              ></div>
            </div>
          </div>

          <div className="stat-item">
            <span className="stat-label">Happiness:</span>
            <div className="stat-bar">
              <div
                className="stat-fill"
                style={{
                  width: `${currentStats.happiness}%`,
                  backgroundColor:
                    currentStats.happiness < 30 ? "#f44336" : "#ffeb3b",
                }}
              ></div>
            </div>
          </div>

          <div className="stat-item">
            <span className="stat-label">Energy:</span>
            <div className="stat-bar">
              <div
                className="stat-fill"
                style={{
                  width: `${currentStats.energy}%`,
                  backgroundColor:
                    currentStats.energy < 30 ? "#f44336" : "#2196f3",
                }}
              ></div>
            </div>
          </div>

          <div className="stat-item">
            <span className="stat-label">Health:</span>
            <div className="stat-bar">
              <div
                className="stat-fill"
                style={{
                  width: `${currentStats.health}%`,
                  backgroundColor:
                    currentStats.health < 30 ? "#f44336" : "#ff9800",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="character-info">
        <div className="info-row">
          <span className="info-label">Species:</span>
          <span className="info-value">{speciesNames[character.species]}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Created:</span>
          <span className="info-value">
            {new Date(character.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Last Fed:</span>
          <span className="info-value">{timeAgo(character.lastFed)}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Last Played:</span>
          <span className="info-value">{timeAgo(character.lastPlayed)}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Experience:</span>
          <span className="info-value">{character.experience} XP</span>
        </div>
      </div>

      <div className="character-actions">
        <button
          className="btn-feed"
          onClick={() => onInteract(character.id, "feed", selectedProject)}
          disabled={currentStats.hunger >= 100}
        >
          Feed
        </button>

        <button
          className="btn-play"
          onClick={() => onInteract(character.id, "play", selectedProject)}
          disabled={currentStats.energy <= 10}
        >
          Play
        </button>

        <button
          className="btn-sleep"
          onClick={() => onInteract(character.id, "sleep", selectedProject)}
        >
          {character.isSleeping ? "Wake Up" : "Sleep"}
        </button>

        <button
          className="btn-delete danger"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete this character?")
            ) {
              onInteract(character.id, "delete", selectedProject);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

CharacterCard.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    attributes: PropTypes.shape({
      hunger: PropTypes.number.isRequired,
      happiness: PropTypes.number.isRequired,
      energy: PropTypes.number.isRequired,
      health: PropTypes.number.isRequired,
    }).isRequired,
    customizations: PropTypes.shape({
      hasHat: PropTypes.bool.isRequired,
      hasGlasses: PropTypes.bool.isRequired,
      hasPendant: PropTypes.bool.isRequired,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    lastFed: PropTypes.string.isRequired,
    lastPlayed: PropTypes.string.isRequired,
    isSleeping: PropTypes.bool.isRequired,
    experience: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    projectAddress: PropTypes.string.isRequired,
  }).isRequired,
  onInteract: PropTypes.func.isRequired,
  selectedProject: PropTypes.string.isRequired,
  projectName: PropTypes.string,
};

CharacterCard.defaultProps = {
  projectName: "Unknown Game",
};

// Main Character Manager Component
const CharacterManager = ({
  characters = [],
  projects = [],
  onCharacterUpdate,
}) => {
  const { publicKey } = useWalletContext();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [managedCharacters, setManagedCharacters] = useState(characters);
  const [selectedProject, setSelectedProject] = useState(
    projects.length > 0 ? projects[0].address : ""
  );
  const [projectFilter, setProjectFilter] = useState("all"); // 'all' or a specific project address

  useEffect(() => {
    setManagedCharacters(characters);
  }, [characters]);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].address);
    }
  }, [projects, selectedProject]);

  const handleCreateCharacter = async (characterData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Add project association
      const enrichedCharacter = {
        ...characterData,
        projectAddress: selectedProject,
        ownerAddress: publicKey?.toString() || "unknown",
      };

      // Simulate network delay for NFT minting
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local state
      const updatedCharacters = [...managedCharacters, enrichedCharacter];
      setManagedCharacters(updatedCharacters);

      // Create a transaction record for this character creation
      const transaction = {
        signature: `tx-char-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "character_model_create",
        status: "Success",
        description: `Created character: ${characterData.name}`,
        projectAddress: selectedProject,
      };

      setIsLoading(false);
      setShowCreateForm(false);

      // Notify parent component
      if (onCharacterUpdate) {
        onCharacterUpdate(updatedCharacters, transaction);
      }
    } catch (error) {
      console.error("Error creating character:", error);
      setError(
        error.message || "Failed to create character. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleCharacterInteraction = async (
    characterId,
    action,
    projectAddress
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      // Get the character to update
      const characterIndex = managedCharacters.findIndex(
        (c) => c.id === characterId
      );
      if (characterIndex === -1) {
        throw new Error("Character not found");
      }

      const character = { ...managedCharacters[characterIndex] };
      const now = new Date().toISOString();
      let actionDescription = "";

      // Process the interaction based on action type
      switch (action) {
        case "feed":
          character.attributes.hunger = 100;
          character.lastFed = now;
          character.experience += 5;
          actionDescription = `Fed character: ${character.name}`;
          break;

        case "play":
          character.attributes.happiness = 100;
          character.lastPlayed = now;
          character.attributes.energy = Math.max(
            0,
            character.attributes.energy - 20
          );
          character.experience += 10;
          actionDescription = `Played with character: ${character.name}`;
          break;

        case "sleep":
          character.isSleeping = !character.isSleeping;
          actionDescription = character.isSleeping
            ? `Character ${character.name} went to sleep`
            : `Character ${character.name} woke up`;
          break;

        case "delete": {
          // Remove character
          const updatedCharacters = managedCharacters.filter(
            (c) => c.id !== characterId
          );
          setManagedCharacters(updatedCharacters);
          actionDescription = `Deleted character: ${character.name}`;

          // Create transaction record
          const deleteTransaction = {
            signature: `tx-char-${Date.now()}`,
            timestamp: now,
            type: "character_model_delete",
            status: "Success",
            description: actionDescription,
            projectAddress: projectAddress,
          };

          setIsLoading(false);

          // Notify parent component
          if (onCharacterUpdate) {
            onCharacterUpdate(updatedCharacters, deleteTransaction);
          }

          return;
        }

        default:
          throw new Error(`Unknown action type: ${action}`);
      }

      // Check if character gained a level (every 50 XP)
      const oldLevel = character.level;
      character.level = Math.floor(character.experience / 50) + 1;

      if (character.level > oldLevel) {
        // Level up bonus
        character.attributes.health = 100;
        actionDescription += ` (Leveled up to ${character.level}!)`;
      }

      // Update character in the list
      const updatedCharacters = [...managedCharacters];
      updatedCharacters[characterIndex] = character;
      setManagedCharacters(updatedCharacters);

      // Create transaction record
      const transaction = {
        signature: `tx-char-${Date.now()}`,
        timestamp: now,
        type: "character_interaction",
        status: "Success",
        description: actionDescription,
        projectAddress: projectAddress,
      };

      setIsLoading(false);

      // Notify parent component
      if (onCharacterUpdate) {
        onCharacterUpdate(updatedCharacters, transaction);
      }
    } catch (error) {
      console.error(`Error during character ${action}:`, error);
      setError(
        error.message || `Failed to ${action} character. Please try again.`
      );
      setIsLoading(false);
    }
  };

  // Filter characters by selected project filter
  const filteredCharacters =
    projectFilter === "all"
      ? managedCharacters
      : managedCharacters.filter(
          (char) => char.projectAddress === projectFilter
        );

  // Get project name from address
  const getProjectName = (address) => {
    const project = projects.find((p) => p.address === address);
    return project ? project.name : "Unknown Project";
  };

  return (
    <div className="character-manager">
      <div className="character-manager-header">
        <h2>Game Characters</h2>

        <div className="manager-controls">
          {projects.length > 0 && (
            <>
              <div className="project-selector">
                <label htmlFor="project-create-select">
                  Create for Project:
                </label>
                <select
                  id="project-create-select"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  disabled={isLoading}
                >
                  {projects.map((project) => (
                    <option key={project.address} value={project.address}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="project-filter">
                <label htmlFor="project-filter-select">View Project:</label>
                <select
                  id="project-filter-select"
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="all">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.address} value={project.address}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            className="btn-create"
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={isLoading || !selectedProject}
          >
            {showCreateForm ? "Cancel" : "Create New Character"}
          </button>
        </div>
      </div>

      {!selectedProject && (
        <div className="no-project-warning">
          <p>
            Please create a project first or select an existing project to
            manage characters.
          </p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && selectedProject && (
        <CharacterCreationForm
          onSubmit={handleCreateCharacter}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isLoading}
        />
      )}

      {filteredCharacters.length === 0 ? (
        <div className="no-characters">
          <p>
            No characters found. Create your first character to get started!
          </p>
        </div>
      ) : (
        <>
          <div className="characters-count">
            Showing {filteredCharacters.length} character
            {filteredCharacters.length !== 1 ? "s" : ""}
            {projectFilter !== "all"
              ? ` for ${getProjectName(projectFilter)}`
              : ""}
          </div>
          <div className="characters-grid">
            {filteredCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onInteract={handleCharacterInteraction}
                selectedProject={character.projectAddress}
                projectName={getProjectName(character.projectAddress)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

CharacterManager.propTypes = {
  characters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      projectAddress: PropTypes.string.isRequired,
      // Other character properties
    })
  ),
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onCharacterUpdate: PropTypes.func,
};

CharacterManager.defaultProps = {
  characters: [],
  projects: [],
  onCharacterUpdate: () => {},
};

export default CharacterManager;
