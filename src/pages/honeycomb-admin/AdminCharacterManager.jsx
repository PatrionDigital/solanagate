import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useProject } from "@/hooks/useProject";

// Admin Filter Panel Component
const AdminFilterPanel = ({ filters, setFilters, projects }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      project: "all",
      owner: "",
      status: "all",
      species: "all",
      dateRange: { start: null, end: null },
    });
  };

  return (
    <div className="admin-filter-panel">
      <h3>Filters</h3>
      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="project">Project:</label>
          <select
            id="project"
            name="project"
            value={filters.project}
            onChange={handleFilterChange}
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.address} value={project.address}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="owner">Owner Address:</label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={filters.owner}
            onChange={handleFilterChange}
            placeholder="Enter wallet address"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="sleeping">Sleeping</option>
            <option value="hungry">Hungry</option>
            <option value="happy">Happy</option>
            <option value="lowEnergy">Low Energy</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="species">Species:</label>
          <select
            id="species"
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
          >
            <option value="all">All Species</option>
            <option value="basic">Basic Vermin</option>
            <option value="fuzzy">Fuzzy Vermin</option>
            <option value="spiky">Spiky Vermin</option>
            <option value="slimy">Slimy Vermin</option>
          </select>
        </div>

        <div className="filter-group date-filter">
          <label>Created:</label>
          <div className="date-inputs">
            <input
              type="date"
              name="dateRange.start"
              value={filters.dateRange.start || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: {
                    ...prev.dateRange,
                    start: e.target.value || null,
                  },
                }))
              }
              placeholder="From"
            />
            <span>to</span>
            <input
              type="date"
              name="dateRange.end"
              value={filters.dateRange.end || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: {
                    ...prev.dateRange,
                    end: e.target.value || null,
                  },
                }))
              }
              placeholder="To"
            />
          </div>
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn-reset-filters" onClick={handleResetFilters}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

AdminFilterPanel.propTypes = {
  filters: PropTypes.shape({
    project: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    dateRange: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
    }).isRequired,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
};

// Admin Actions Toolbar Component
const AdminActionsToolbar = ({
  selectedCount,
  onBulkDelete,
  onResetStats,
  onTransferOwnership,
}) => {
  return (
    <div className="admin-actions-toolbar">
      <div className="selected-count">
        {selectedCount} character{selectedCount !== 1 ? "s" : ""} selected
      </div>
      <div className="bulk-actions">
        <button
          className="btn-bulk-action"
          onClick={onResetStats}
          disabled={selectedCount === 0}
        >
          Reset Stats
        </button>
        <button
          className="btn-bulk-action"
          onClick={onTransferOwnership}
          disabled={selectedCount === 0}
        >
          Transfer Ownership
        </button>
        <button
          className="btn-bulk-action danger"
          onClick={onBulkDelete}
          disabled={selectedCount === 0}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

AdminActionsToolbar.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onBulkDelete: PropTypes.func.isRequired,
  onResetStats: PropTypes.func.isRequired,
  onTransferOwnership: PropTypes.func.isRequired,
};

// Character Stats Component
const CharacterStats = ({ character }) => {
  // Calculate current stats based on time since last interaction
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
      hunger: Math.round(currentHunger),
      happiness: Math.round(currentHappiness),
      energy: Math.round(currentEnergy),
      health: Math.round(currentHealth),
    };
  };

  const stats = calculateCurrentStats();

  return (
    <div className="character-quick-stats">
      <div
        className="stat-pill"
        style={{ backgroundColor: stats.hunger < 30 ? "#ff5252" : "#4caf50" }}
      >
        H: {stats.hunger}%
      </div>
      <div
        className="stat-pill"
        style={{
          backgroundColor: stats.happiness < 30 ? "#ff5252" : "#2196f3",
        }}
      >
        😊: {stats.happiness}%
      </div>
      <div
        className="stat-pill"
        style={{ backgroundColor: stats.energy < 30 ? "#ff5252" : "#ff9800" }}
      >
        E: {stats.energy}%
      </div>
      <div
        className="stat-pill"
        style={{ backgroundColor: stats.health < 30 ? "#ff5252" : "#9c27b0" }}
      >
        HP: {stats.health}%
      </div>
    </div>
  );
};

CharacterStats.propTypes = {
  character: PropTypes.object.isRequired,
};

// Characters Table Component
const CharactersTable = ({
  characters,
  selectedCharacters,
  onSelectionChange,
  onViewDetails,
  onQuickAction,
  projects,
}) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(characters.map((char) => char.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      onSelectionChange([...selectedCharacters, id]);
    } else {
      onSelectionChange(selectedCharacters.filter((charId) => charId !== id));
    }
  };

  const getProjectName = (address) => {
    const project = projects.find((p) => p.address === address);
    return project ? project.name : "Unknown Project";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="characters-table-container">
      <table className="characters-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedCharacters.length === characters.length &&
                  characters.length > 0
                }
              />
            </th>
            <th>Name</th>
            <th>Project</th>
            <th>Species</th>
            <th>Owner</th>
            <th>Stats</th>
            <th>Level</th>
            <th>Created</th>
            <th>Last Interaction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.length === 0 ? (
            <tr>
              <td colSpan="10" className="no-data">
                No characters found matching the current filters
              </td>
            </tr>
          ) : (
            characters.map((character) => (
              <tr
                key={character.id}
                className={character.isSleeping ? "sleeping-character" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCharacters.includes(character.id)}
                    onChange={(e) => handleSelectOne(e, character.id)}
                  />
                </td>
                <td>{character.name}</td>
                <td>{getProjectName(character.projectAddress)}</td>
                <td>
                  <span
                    className="species-indicator"
                    style={{ backgroundColor: character.color }}
                  >
                    {character.species}
                  </span>
                </td>
                <td className="address-cell">
                  <span className="truncated-address">
                    {character.ownerAddress.substring(0, 6)}...
                    {character.ownerAddress.substring(
                      character.ownerAddress.length - 4
                    )}
                  </span>
                  <button
                    className="copy-button"
                    onClick={() =>
                      navigator.clipboard.writeText(character.ownerAddress)
                    }
                    title="Copy address"
                  >
                    📋
                  </button>
                </td>
                <td>
                  <CharacterStats character={character} />
                </td>
                <td>{character.level}</td>
                <td>{formatDate(character.createdAt)}</td>
                <td>
                  {Math.max(
                    new Date(character.lastFed),
                    new Date(character.lastPlayed)
                  ).toLocaleString()}
                </td>
                <td className="actions-cell">
                  <button
                    className="btn-action view"
                    onClick={() => onViewDetails(character.id)}
                  >
                    View
                  </button>
                  <button
                    className="btn-action feed"
                    onClick={() => onQuickAction(character.id, "feed")}
                  >
                    Feed
                  </button>
                  <button
                    className="btn-action toggle-sleep"
                    onClick={() => onQuickAction(character.id, "sleep")}
                  >
                    {character.isSleeping ? "Wake" : "Sleep"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

CharactersTable.propTypes = {
  characters: PropTypes.array.isRequired,
  selectedCharacters: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onQuickAction: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = () => {
    const pages = [];
    const maxDisplayed = 5;

    if (totalPages <= maxDisplayed) {
      // Show all pages if there are less than maxDisplayed
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate which pages to show
      if (currentPage <= 3) {
        // Beginning of pagination
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // End of pagination
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle of pagination
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="page-numbers">
        {pageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`page-number ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className="page-button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

// Character Detail Modal
const CharacterDetailModal = ({ character, onClose, onSave, projects }) => {
  const [editedCharacter, setEditedCharacter] = useState(character);
  const [isEditing, setIsEditing] = useState(false);

  const getProjectName = (address) => {
    const project = projects.find((p) => p.address === address);
    return project ? project.name : "Unknown Project";
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      // Handle nested properties
      const [category, property] = name.split(".");
      setEditedCharacter((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [property]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      // Handle top-level properties
      setEditedCharacter((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSave = () => {
    onSave(editedCharacter);
    setIsEditing(false);
  };

  return (
    <div className="modal-backdrop">
      <div className="character-detail-modal">
        <div className="modal-header">
          <h2>{isEditing ? "Edit Character" : "Character Details"}</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div
            className="character-avatar"
            style={{ backgroundColor: character.color }}
          >
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
            {character.isSleeping && (
              <div className="sleeping-indicator">💤</div>
            )}
          </div>

          <div className="detail-grid">
            <div className="detail-group">
              <label>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedCharacter.name}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{character.name}</span>
              )}
            </div>

            <div className="detail-group">
              <label>Project:</label>
              {isEditing ? (
                <select
                  name="projectAddress"
                  value={editedCharacter.projectAddress}
                  onChange={handleInputChange}
                >
                  {projects.map((project) => (
                    <option key={project.address} value={project.address}>
                      {project.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{getProjectName(character.projectAddress)}</span>
              )}
            </div>

            <div className="detail-group">
              <label>Species:</label>
              {isEditing ? (
                <select
                  name="species"
                  value={editedCharacter.species}
                  onChange={handleInputChange}
                >
                  <option value="basic">Basic Vermin</option>
                  <option value="fuzzy">Fuzzy Vermin</option>
                  <option value="spiky">Spiky Vermin</option>
                  <option value="slimy">Slimy Vermin</option>
                </select>
              ) : (
                <span>{character.species}</span>
              )}
            </div>

            <div className="detail-group">
              <label>Color:</label>
              {isEditing ? (
                <input
                  type="color"
                  name="color"
                  value={editedCharacter.color}
                  onChange={handleInputChange}
                />
              ) : (
                <span
                  style={{ backgroundColor: character.color }}
                  className="color-preview"
                ></span>
              )}
            </div>

            <div className="detail-group">
              <label>Level:</label>
              {isEditing ? (
                <input
                  type="number"
                  name="level"
                  value={editedCharacter.level}
                  onChange={handleInputChange}
                  min="1"
                />
              ) : (
                <span>{character.level}</span>
              )}
            </div>

            <div className="detail-group">
              <label>Experience:</label>
              {isEditing ? (
                <input
                  type="number"
                  name="experience"
                  value={editedCharacter.experience}
                  onChange={handleInputChange}
                  min="0"
                />
              ) : (
                <span>{character.experience} XP</span>
              )}
            </div>

            <div className="detail-group">
              <label>Owner:</label>
              <span className="owner-address">{character.ownerAddress}</span>
            </div>

            <div className="detail-group">
              <label>Created:</label>
              <span>{new Date(character.createdAt).toLocaleString()}</span>
            </div>

            <div className="detail-group">
              <label>Last Fed:</label>
              <span>{new Date(character.lastFed).toLocaleString()}</span>
            </div>

            <div className="detail-group">
              <label>Last Played:</label>
              <span>{new Date(character.lastPlayed).toLocaleString()}</span>
            </div>

            <div className="detail-group wide">
              <label>Status:</label>
              <div className="character-status">
                {character.isSleeping && (
                  <span className="status-tag sleeping">Sleeping</span>
                )}
                {!character.isSleeping && (
                  <span className="status-tag awake">Awake</span>
                )}
              </div>
            </div>
          </div>

          <div className="attributes-section">
            <h3>Attributes</h3>
            <div className="attributes-grid">
              {isEditing ? (
                <>
                  <div className="attribute-group">
                    <label>Hunger:</label>
                    <input
                      type="range"
                      name="attributes.hunger"
                      value={editedCharacter.attributes.hunger}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                    />
                    <span>{editedCharacter.attributes.hunger}%</span>
                  </div>

                  <div className="attribute-group">
                    <label>Happiness:</label>
                    <input
                      type="range"
                      name="attributes.happiness"
                      value={editedCharacter.attributes.happiness}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                    />
                    <span>{editedCharacter.attributes.happiness}%</span>
                  </div>

                  <div className="attribute-group">
                    <label>Energy:</label>
                    <input
                      type="range"
                      name="attributes.energy"
                      value={editedCharacter.attributes.energy}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                    />
                    <span>{editedCharacter.attributes.energy}%</span>
                  </div>

                  <div className="attribute-group">
                    <label>Health:</label>
                    <input
                      type="range"
                      name="attributes.health"
                      value={editedCharacter.attributes.health}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                    />
                    <span>{editedCharacter.attributes.health}%</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="attribute-bar">
                    <label>Hunger:</label>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${character.attributes.hunger}%`,
                          backgroundColor:
                            character.attributes.hunger < 30
                              ? "#ff5252"
                              : "#4caf50",
                        }}
                      ></div>
                    </div>
                    <span>{character.attributes.hunger}%</span>
                  </div>

                  <div className="attribute-bar">
                    <label>Happiness:</label>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${character.attributes.happiness}%`,
                          backgroundColor:
                            character.attributes.happiness < 30
                              ? "#ff5252"
                              : "#2196f3",
                        }}
                      ></div>
                    </div>
                    <span>{character.attributes.happiness}%</span>
                  </div>

                  <div className="attribute-bar">
                    <label>Energy:</label>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${character.attributes.energy}%`,
                          backgroundColor:
                            character.attributes.energy < 30
                              ? "#ff5252"
                              : "#ff9800",
                        }}
                      ></div>
                    </div>
                    <span>{character.attributes.energy}%</span>
                  </div>

                  <div className="attribute-bar">
                    <label>Health:</label>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${character.attributes.health}%`,
                          backgroundColor:
                            character.attributes.health < 30
                              ? "#ff5252"
                              : "#9c27b0",
                        }}
                      ></div>
                    </div>
                    <span>{character.attributes.health}%</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="customizations-section">
            <h3>Customizations</h3>
            <div className="customizations-grid">
              {isEditing ? (
                <>
                  <div className="customization-check">
                    <input
                      type="checkbox"
                      id="hasHat"
                      name="customizations.hasHat"
                      checked={editedCharacter.customizations.hasHat}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="hasHat">Hat</label>
                  </div>

                  <div className="customization-check">
                    <input
                      type="checkbox"
                      id="hasGlasses"
                      name="customizations.hasGlasses"
                      checked={editedCharacter.customizations.hasGlasses}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="hasGlasses">Glasses</label>
                  </div>

                  <div className="customization-check">
                    <input
                      type="checkbox"
                      id="hasPendant"
                      name="customizations.hasPendant"
                      checked={editedCharacter.customizations.hasPendant}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="hasPendant">Pendant</label>
                  </div>

                  <div className="customization-check">
                    <input
                      type="checkbox"
                      id="isSleeping"
                      name="isSleeping"
                      checked={editedCharacter.isSleeping}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="isSleeping">Sleeping</label>
                  </div>
                </>
              ) : (
                <>
                  <div className="customization-tag">
                    <span
                      className={
                        character.customizations.hasHat ? "active" : "inactive"
                      }
                    >
                      Hat: {character.customizations.hasHat ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="customization-tag">
                    <span
                      className={
                        character.customizations.hasGlasses
                          ? "active"
                          : "inactive"
                      }
                    >
                      Glasses:{" "}
                      {character.customizations.hasGlasses ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="customization-tag">
                    <span
                      className={
                        character.customizations.hasPendant
                          ? "active"
                          : "inactive"
                      }
                    >
                      Pendant:{" "}
                      {character.customizations.hasPendant ? "Yes" : "No"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button className="btn-close" onClick={onClose}>
                Close
              </button>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                Edit Character
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

CharacterDetailModal.propTypes = {
  character: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
};

// Transfer Ownership Modal
const TransferOwnershipModal = ({ selectedCount, onTransfer, onCancel }) => {
  const [newOwner, setNewOwner] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleAddressChange = (e) => {
    const address = e.target.value;
    setNewOwner(address);

    // Simple validation - in production would use a proper Solana address validator
    setIsValid(address.length >= 32 && address.length <= 44);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onTransfer(newOwner);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="transfer-modal">
        <div className="modal-header">
          <h2>Transfer Ownership</h2>
          <button className="btn-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <p>
            You are about to transfer <strong>{selectedCount}</strong> character
            {selectedCount !== 1 ? "s" : ""} to a new owner. This action cannot
            be undone.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newOwner">New Owner Address:</label>
              <input
                type="text"
                id="newOwner"
                value={newOwner}
                onChange={handleAddressChange}
                placeholder="Enter wallet address"
                className={newOwner && !isValid ? "invalid" : ""}
              />
              {newOwner && !isValid && (
                <div className="validation-error">
                  Please enter a valid wallet address
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={() => onTransfer(newOwner)}
            disabled={!isValid}
          >
            Transfer Ownership
          </button>
        </div>
      </div>
    </div>
  );
};

TransferOwnershipModal.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onTransfer: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// Confirmation Modal
const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="confirmation-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm danger" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

// Main AdminCharacterManager Component
const AdminCharacterManager = () => {
  const { state, updateCharacter, deleteCharacter } = useProject();
  const { projects, characters } = state;

  // State for filtering, pagination, search
  const [filters, setFilters] = useState({
    project: "all",
    owner: "",
    status: "all",
    species: "all",
    dateRange: { start: null, end: null },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State for selected characters (for bulk actions)
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  // State for modals
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    character: null,
  });

  const [transferModal, setTransferModal] = useState({
    isOpen: false,
  });

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Apply filters to characters
  const filteredCharacters = characters.filter((character) => {
    // Project filter
    if (
      filters.project !== "all" &&
      character.projectAddress !== filters.project
    ) {
      return false;
    }

    // Owner filter
    if (
      filters.owner &&
      !character.ownerAddress
        .toLowerCase()
        .includes(filters.owner.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (filters.status !== "all") {
      const now = new Date();
      const lastFed = new Date(character.lastFed);
      const lastPlayed = new Date(character.lastPlayed);

      const hoursSinceLastFed = (now - lastFed) / (1000 * 60 * 60);
      const hoursSinceLastPlayed = (now - lastPlayed) / (1000 * 60 * 60);

      const hunger = Math.max(
        0,
        character.attributes.hunger - hoursSinceLastFed * 2
      );
      const happiness = Math.max(
        0,
        character.attributes.happiness - hoursSinceLastPlayed * 2
      );
      const energy = character.isSleeping
        ? Math.min(100, character.attributes.energy + hoursSinceLastPlayed * 2)
        : Math.max(0, character.attributes.energy - hoursSinceLastPlayed * 1);

      switch (filters.status) {
        case "sleeping":
          if (!character.isSleeping) return false;
          break;
        case "hungry":
          if (hunger > 30) return false;
          break;
        case "happy":
          if (happiness < 70) return false;
          break;
        case "lowEnergy":
          if (energy > 30) return false;
          break;
        case "active":
          if (character.isSleeping) return false;
          break;
        default:
          break;
      }
    }

    // Species filter
    if (filters.species !== "all" && character.species !== filters.species) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start) {
      const createdAt = new Date(character.createdAt);
      const startDate = new Date(filters.dateRange.start);
      if (createdAt < startDate) return false;
    }

    if (filters.dateRange.end) {
      const createdAt = new Date(character.createdAt);
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of day
      if (createdAt > endDate) return false;
    }

    // Search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        character.name.toLowerCase().includes(search) ||
        character.ownerAddress.toLowerCase().includes(search) ||
        character.species.toLowerCase().includes(search) ||
        character.id.toLowerCase().includes(search)
      );
    }

    return true;
  });

  // Sort characters by creation date (newest first)
  const sortedCharacters = [...filteredCharacters].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Pagination
  const totalPages = Math.ceil(sortedCharacters.length / itemsPerPage);
  const paginatedCharacters = sortedCharacters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  // Handler functions for character actions
  const handleViewDetails = (characterId) => {
    const character = characters.find((c) => c.id === characterId);
    if (character) {
      setDetailModal({
        isOpen: true,
        character,
      });
    }
  };

  const handleSaveCharacter = (updatedCharacter) => {
    updateCharacter(updatedCharacter);
    setDetailModal({
      isOpen: false,
      character: null,
    });
  };

  const handleQuickAction = (characterId, action) => {
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    const now = new Date().toISOString();
    let updatedCharacter = { ...character };

    switch (action) {
      case "feed":
        updatedCharacter = {
          ...updatedCharacter,
          attributes: {
            ...updatedCharacter.attributes,
            hunger: 100,
          },
          lastFed: now,
        };
        break;

      case "sleep":
        updatedCharacter = {
          ...updatedCharacter,
          isSleeping: !updatedCharacter.isSleeping,
        };
        break;

      default:
        return;
    }

    updateCharacter(updatedCharacter);
  };

  // Handler functions for bulk actions
  const handleBulkDelete = () => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Characters",
      message: `Are you sure you want to delete ${selectedCharacters.length} character(s)? This action cannot be undone.`,
      onConfirm: () => {
        selectedCharacters.forEach((id) => {
          deleteCharacter(id);
        });
        setSelectedCharacters([]);
        setConfirmationModal({ isOpen: false });
      },
    });
  };

  const handleResetStats = () => {
    setConfirmationModal({
      isOpen: true,
      title: "Reset Character Stats",
      message: `Are you sure you want to reset stats for ${selectedCharacters.length} character(s)?`,
      onConfirm: () => {
        selectedCharacters.forEach((id) => {
          const character = characters.find((c) => c.id === id);
          if (character) {
            const updatedCharacter = {
              ...character,
              attributes: {
                hunger: 100,
                happiness: 100,
                energy: 100,
                health: 100,
              },
              lastFed: new Date().toISOString(),
              lastPlayed: new Date().toISOString(),
            };
            updateCharacter(updatedCharacter);
          }
        });
        setSelectedCharacters([]);
        setConfirmationModal({ isOpen: false });
      },
    });
  };

  const handleTransferOwnership = () => {
    setTransferModal({
      isOpen: true,
    });
  };

  const performTransfer = (newOwner) => {
    if (!newOwner) return;

    selectedCharacters.forEach((id) => {
      const character = characters.find((c) => c.id === id);
      if (character) {
        const updatedCharacter = {
          ...character,
          ownerAddress: newOwner,
        };
        updateCharacter(updatedCharacter);
      }
    });

    setSelectedCharacters([]);
    setTransferModal({ isOpen: false });
  };

  return (
    <div className="admin-character-manager">
      <h2 className="admin-panel-title">Character Management</h2>

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Search by name, ID, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Show:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <AdminFilterPanel
        filters={filters}
        setFilters={setFilters}
        projects={projects}
      />

      <AdminActionsToolbar
        selectedCount={selectedCharacters.length}
        onBulkDelete={handleBulkDelete}
        onResetStats={handleResetStats}
        onTransferOwnership={handleTransferOwnership}
      />

      <CharactersTable
        characters={paginatedCharacters}
        selectedCharacters={selectedCharacters}
        onSelectionChange={setSelectedCharacters}
        onViewDetails={handleViewDetails}
        onQuickAction={handleQuickAction}
        projects={projects}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      {detailModal.isOpen && detailModal.character && (
        <CharacterDetailModal
          character={detailModal.character}
          onClose={() => setDetailModal({ isOpen: false, character: null })}
          onSave={handleSaveCharacter}
          projects={projects}
        />
      )}

      {transferModal.isOpen && (
        <TransferOwnershipModal
          selectedCount={selectedCharacters.length}
          onTransfer={performTransfer}
          onCancel={() => setTransferModal({ isOpen: false })}
        />
      )}

      {confirmationModal.isOpen && (
        <ConfirmationModal
          title={confirmationModal.title}
          message={confirmationModal.message}
          onConfirm={confirmationModal.onConfirm}
          onCancel={() => setConfirmationModal({ isOpen: false })}
        />
      )}

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Characters</h3>
          <div className="stat-value">{characters.length}</div>
        </div>
        <div className="stat-card">
          <h3>Filtered Characters</h3>
          <div className="stat-value">{filteredCharacters.length}</div>
        </div>
        <div className="stat-card">
          <h3>Projects</h3>
          <div className="stat-value">{projects.length}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminCharacterManager;
