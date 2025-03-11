import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useWalletContext } from "@/contexts/WalletContext";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AdminAuth from "./AdminAuth.jsx";

// ================== Project Form ==================
export const ProjectForm = ({ onSubmit, onCancel, isLoading }) => {
  const { publicKey } = useWalletContext();
  const walletAddress = publicKey?.toString() || "";

  // Pre-filled mock data as defaults
  const [formData, setFormData] = useState({
    name: "Vermin Game Project",
    description: "A Honeycomb Protocol project for the Vermin game",
    profileTreesEnabled: true,
    badgeCriteriaEnabled: true,
    subsidizeFees: true,
    mockData: {
      profileTrees: {
        active: 0,
        merkle_trees: ["merkleTree" + Math.floor(Math.random() * 1000)],
      },
      badgeCriteria: [
        {
          badgeIndex: 0,
          startTime: Math.floor(Date.now() / 1000),
          endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week from now
        },
      ],
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create the project data object with mock data
    const projectData = {
      address: `project-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      authority: walletAddress,
      createdAt: new Date().toISOString(),
      subsidizeFees: formData.subsidizeFees,
    };

    // Add profile trees if enabled
    if (formData.profileTreesEnabled) {
      projectData.profileTrees = formData.mockData.profileTrees;
    }

    // Add badge criteria if enabled
    if (formData.badgeCriteriaEnabled) {
      projectData.badgeCriteria = formData.mockData.badgeCriteria;
    }

    onSubmit(projectData);
  };

  return (
    <div className="project-form">
      <h3>Create New Project</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Project Name*</label>
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="form-options">
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="profileTreesEnabled"
              name="profileTreesEnabled"
              checked={formData.profileTreesEnabled}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <label htmlFor="profileTreesEnabled">Include Profile Trees</label>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="badgeCriteriaEnabled"
              name="badgeCriteriaEnabled"
              checked={formData.badgeCriteriaEnabled}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <label htmlFor="badgeCriteriaEnabled">Include Badge Criteria</label>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="subsidizeFees"
              name="subsidizeFees"
              checked={formData.subsidizeFees}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <label htmlFor="subsidizeFees">Subsidize Fees</label>
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
            {isLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

ProjectForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

ProjectForm.defaultProps = {
  isLoading: false,
};

// ================== Project Manager ==================
export const ProjectManager = ({ projects, onProjectCreated }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mockProjects, setMockProjects] = useState([]);

  // Initialize with any existing projects
  useEffect(() => {
    if (projects && projects.length > 0) {
      setMockProjects(projects);
    }
  }, [projects]);

  const handleCreateProject = async (projectData) => {
    setError(null);
    setIsLoading(true);

    try {
      // In a real implementation, we would call an API to create the project
      // For now, we'll just simulate a network delay and add the mock project
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Add the new mock project
      const updatedProjects = [...mockProjects, projectData];
      setMockProjects(updatedProjects);

      // Create a sample transaction for this project
      const transaction = {
        signature: `tx-${projectData.address.substring(0, 8)}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "project_create",
        status: "Success",
        description: `Created project: ${projectData.name}`,
        projectAddress: projectData.address,
      };

      setIsLoading(false);
      setShowCreateForm(false);

      if (onProjectCreated) {
        // Notify parent component with updated project list and a new transaction
        onProjectCreated(updatedProjects, transaction);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setError(error.message || "Failed to create project. Please try again.");
      setIsLoading(false);
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project === selectedProject ? null : project);
  };

  const handleDeleteProject = (projectAddress) => {
    if (window.confirm("Delete this project? This is just for the mock UI.")) {
      const updatedProjects = mockProjects.filter(
        (p) => p.address !== projectAddress
      );
      setMockProjects(updatedProjects);

      if (selectedProject && selectedProject.address === projectAddress) {
        setSelectedProject(null);
      }

      if (onProjectCreated) {
        // Notify parent component with updated project list
        onProjectCreated(updatedProjects);
      }
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="project-manager">
      <div className="project-actions">
        <h2>Honeycomb Projects</h2>
        <div className="action-buttons">
          <button
            className="btn-create"
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={isLoading}
          >
            {showCreateForm ? "Cancel" : "Create New Project"}
          </button>
          {mockProjects.length > 0 && (
            <button
              className="btn-clear-all"
              onClick={() => {
                if (
                  window.confirm(
                    "Clear all projects? This is only for the mock UI."
                  )
                ) {
                  setMockProjects([]);
                  if (onProjectCreated) {
                    onProjectCreated([]);
                  }
                }
              }}
            >
              Clear All Projects
            </button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isLoading}
        />
      )}

      {error && <div className="error-message">{error}</div>}

      {mockProjects.length === 0 ? (
        <div className="no-projects">
          <p>
            No projects found. Create your first Honeycomb project to get
            started.
          </p>
        </div>
      ) : (
        <div className="projects-list">
          {mockProjects.map((project) => (
            <div
              key={project.address}
              className={`project-card ${
                selectedProject === project ? "expanded" : ""
              }`}
            >
              <div
                className="project-header"
                onClick={() => handleViewProject(project)}
              >
                <h3>{project.name}</h3>
                <div className="project-address">
                  <span className="address-label">Address:</span>
                  <span className="address-value">{project.address}</span>
                </div>
                <div className="expand-icon">
                  {selectedProject === project ? "▼" : "▶"}
                </div>
              </div>

              {selectedProject === project && (
                <div className="project-details">
                  {project.description && (
                    <div className="project-description">
                      <p>{project.description}</p>
                    </div>
                  )}

                  <div className="detail-section">
                    <h4>General Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">
                          {formatDate(project.createdAt)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Authority:</span>
                        <span className="detail-value">
                          {project.authority}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Subsidize Fees:</span>
                        <span className="detail-value">
                          {project.subsidizeFees ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {project.profileTrees && (
                    <div className="detail-section">
                      <h4>Profile Trees</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Active Tree:</span>
                          <span className="detail-value">
                            {project.profileTrees.active !== undefined
                              ? project.profileTrees.merkle_trees[
                                  project.profileTrees.active
                                ]
                              : "None"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Total Trees:</span>
                          <span className="detail-value">
                            {project.profileTrees.merkle_trees?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {project.badgeCriteria &&
                    project.badgeCriteria.length > 0 && (
                      <div className="detail-section">
                        <h4>Badge Criteria</h4>
                        <div className="badges-list">
                          {project.badgeCriteria.map((criteria, index) => (
                            <div key={index} className="badge-item">
                              <span className="badge-index">
                                Badge #{criteria.badgeIndex}
                              </span>
                              <div className="badge-times">
                                <div>
                                  Start: {formatDate(criteria.startTime * 1000)}
                                </div>
                                <div>
                                  End: {formatDate(criteria.endTime * 1000)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="project-actions">
                    <button
                      className="btn-manage"
                      onClick={() =>
                        alert(
                          "This would manage character models in a real implementation"
                        )
                      }
                    >
                      Manage Character Models
                    </button>
                    <button
                      className="btn-badge"
                      onClick={() =>
                        alert(
                          "This would configure badges in a real implementation"
                        )
                      }
                    >
                      Configure Badges
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteProject(project.address)}
                    >
                      Delete Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ProjectManager.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      authority: PropTypes.string,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      profileTrees: PropTypes.object,
      badgeCriteria: PropTypes.array,
    })
  ),
  onProjectCreated: PropTypes.func,
};

ProjectManager.defaultProps = {
  projects: [],
  onProjectCreated: () => {},
};

// ================== Transaction History ==================
export const TransactionHistory = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case "config_update":
        return "Configuration Update";
      case "asset_deploy":
        return "Asset Deployment";
      case "character_model_create":
        return "Character Model Creation";
      case "project_create":
        return "Project Creation";
      case "mint":
        return "Token Mint";
      case "badge_criteria":
        return "Badge Criteria Update";
      default:
        return type
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((tx) => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          tx.signature.toLowerCase().includes(searchLower) ||
          tx.type.toLowerCase().includes(searchLower) ||
          (tx.description && tx.description.toLowerCase().includes(searchLower))
        );
      }

      // Apply type filter
      if (filterType !== "all") {
        return tx.type === filterType;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by timestamp
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Get unique transaction types for filter dropdown
  const transactionTypes = [
    "all",
    ...new Set(transactions.map((tx) => tx.type)),
  ];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const truncateHash = (hash) => {
    return hash.length > 12 ? `${hash.slice(0, 6)}...${hash.slice(-6)}` : hash;
  };

  return (
    <div className="transaction-history">
      <div className="transaction-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset page when search changes
            }}
            className="search-input"
          />

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1); // Reset page when filter changes
            }}
            className="filter-select"
          >
            {transactionTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : getTransactionTypeLabel(type)}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="sort-button"
          >
            {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </button>
        </div>
      </div>

      {paginatedTransactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="transactions-table">
            <div className="transactions-header">
              <div className="header-timestamp">Timestamp</div>
              <div className="header-type">Type</div>
              <div className="header-signature">Signature</div>
              <div className="header-status">Status</div>
              <div className="header-details">Details</div>
            </div>

            <div className="transactions-body">
              {paginatedTransactions.map((tx) => (
                <div key={tx.signature} className="transaction-row">
                  <div className="cell-timestamp">
                    {formatTimestamp(tx.timestamp)}
                  </div>
                  <div className="cell-type">
                    {getTransactionTypeLabel(tx.type)}
                  </div>
                  <div className="cell-signature">
                    <a
                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={tx.signature}
                    >
                      {truncateHash(tx.signature)}
                    </a>
                  </div>
                  <div
                    className={`cell-status status-${tx.status.toLowerCase()}`}
                  >
                    {tx.status}
                  </div>
                  <div className="cell-details">
                    {tx.description && (
                      <span className="tx-description">{tx.description}</span>
                    )}
                    {tx.projectAddress && (
                      <div className="project-info">
                        Project: {truncateHash(tx.projectAddress)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="page-button"
              >
                Previous
              </button>

              <span className="page-info">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="page-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

TransactionHistory.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      signature: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      description: PropTypes.string,
      projectAddress: PropTypes.string,
    })
  ).isRequired,
};

// ================== Config Editor ==================
export const ConfigEditor = ({ config, onSave, isSaving }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialize form with current config data
    setFormData({ ...config });
  }, [config]);

  const validateField = (name, value) => {
    let error = null;

    // Basic validation rules
    if (value === "" || value === undefined) {
      error = "This field is required";
    } else if (
      name.includes("Rate") &&
      (isNaN(value) || parseFloat(value) < 0 || parseFloat(value) > 100)
    ) {
      error = "Rate must be a number between 0 and 100";
    } else if (
      name.includes("Amount") &&
      (isNaN(value) || parseInt(value) < 0)
    ) {
      error = "Amount must be a positive number";
    } else if (
      name.includes("Duration") &&
      (isNaN(value) || parseInt(value) <= 0)
    ) {
      error = "Duration must be a positive number";
    } else if (
      name.includes("Address") &&
      !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)
    ) {
      error = "Invalid Solana address format";
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    // Validate the field
    const error = validateField(name, inputValue);

    // Update errors state
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {};
    let hasErrors = false;

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      onSave(formData);
    }
  };

  const renderFormSection = (sectionTitle, fields) => (
    <div className="config-section" key={sectionTitle}>
      <h3>{sectionTitle}</h3>
      {fields.map((field) => {
        const fieldName = field.id;
        const value =
          formData[fieldName] !== undefined ? formData[fieldName] : "";

        return (
          <div className="form-group" key={fieldName}>
            <label htmlFor={fieldName}>{field.label}</label>

            {field.type === "checkbox" ? (
              <input
                type="checkbox"
                id={fieldName}
                name={fieldName}
                checked={!!value}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            ) : field.type === "select" ? (
              <select
                id={fieldName}
                name={fieldName}
                value={value}
                onChange={handleInputChange}
                disabled={isSaving}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                id={fieldName}
                name={fieldName}
                value={value}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                disabled={isSaving}
              />
            )}

            {errors[fieldName] && (
              <div className="error-message">{errors[fieldName]}</div>
            )}

            {field.description && (
              <div className="field-description">{field.description}</div>
            )}
          </div>
        );
      })}
    </div>
  );

  // Define sections and fields
  const configSections = [
    {
      title: "General Settings",
      fields: [
        {
          id: "gameEnabled",
          label: "Game Enabled",
          type: "checkbox",
          description: "Enable or disable the entire game",
        },
        {
          id: "maintenanceMode",
          label: "Maintenance Mode",
          type: "checkbox",
          description: "Put the game in maintenance mode",
        },
        {
          id: "contractAddress",
          label: "Contract Address",
          description: "Main Honeycomb contract address",
          placeholder: "Enter contract address",
        },
      ],
    },
    {
      title: "Game Economics",
      fields: [
        {
          id: "baseRewardRate",
          label: "Base Reward Rate",
          type: "number",
          description: "Base rate for rewards (in %)",
          placeholder: "5.0",
        },
        {
          id: "stakingMultiplier",
          label: "Staking Multiplier",
          type: "number",
          description: "Multiplier for staked assets",
          placeholder: "1.5",
        },
        {
          id: "penaltyRate",
          label: "Early Withdrawal Penalty",
          type: "number",
          description: "Penalty for early withdrawals (in %)",
          placeholder: "10",
        },
      ],
    },
    {
      title: "Vermin Game Parameters",
      fields: [
        {
          id: "breedingCooldown",
          label: "Breeding Cooldown",
          type: "number",
          description: "Cooldown period for breeding (in hours)",
          placeholder: "24",
        },
        {
          id: "maxVerminPerWallet",
          label: "Max Vermin Per Wallet",
          type: "number",
          description: "Maximum number of Vermin a wallet can own",
          placeholder: "10",
        },
        {
          id: "verminLifespan",
          label: "Vermin Lifespan",
          type: "number",
          description: "Vermin lifespan (in days)",
          placeholder: "30",
        },
      ],
    },
  ];

  return (
    <div className="config-editor">
      <form onSubmit={handleSubmit}>
        {configSections.map((section) =>
          renderFormSection(section.title, section.fields)
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => setFormData({ ...config })}
            disabled={isSaving}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn-save"
            disabled={isSaving || Object.values(errors).some((e) => e !== null)}
          >
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
};

ConfigEditor.propTypes = {
  config: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

ConfigEditor.defaultProps = {
  isSaving: false,
};

// ================== Asset Manager ==================
export const AssetManager = ({ assets }) => {
  return (
    <div className="asset-manager">
      <h2>Asset Management</h2>
      <p>This section will allow managing game assets (coming soon)</p>
      <div className="assets-list">
        {assets.map((asset) => (
          <div key={asset.id} className="asset-card">
            <h3>{asset.name}</h3>
            <p>Type: {asset.type}</p>
            <p>Rarity: {asset.rarity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

AssetManager.propTypes = {
  assets: PropTypes.array.isRequired,
};

// ================== Wallet Connect ==================
const WalletConnect = ({ onConnect }) => {
  const { publicKey, connected, disconnect } = useWalletContext();
  const [error] = useState(null);

  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (connected && publicKey && !hasConnectedRef.current) {
      hasConnectedRef.current = true;
      onConnect();
    } else if (!connected) {
      hasConnectedRef.current = false;
    }
  }, [connected, publicKey, onConnect]);

  const handleDisconnect = () => {
    // Call the wallet's disconnect function
    disconnect();

    // Use a more direct approach to ensure disconnection
    if (window.solana && window.solana.disconnect) {
      window.solana.disconnect();
    }

    // Force page reload to reset all states after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    const addressStr = address.toString();
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {error && <div className="error-message">{error}</div>}

      {!connected ? (
        <div className="connect-prompt">
          <p>Connect wallet to access admin features</p>
          <WalletMultiButton />
        </div>
      ) : (
        <div className="wallet-info">
          <div className="address">
            <span className="label">Connected:</span>
            <span className="value">{truncateAddress(publicKey)}</span>
          </div>
          <button className="disconnect-button" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

WalletConnect.propTypes = {
  onConnect: PropTypes.func,
};

WalletConnect.defaultProps = {
  onConnect: () => {},
};

// ================== Honeycomb Admin Panel ==================
export const HoneycombAdminPanel = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleConfigUpdate = async (updatedConfig) => {
    try {
      setIsSaving(true);
      setStatusMessage("Saving configuration to blockchain...");

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the parent component with new data
      onUpdate({
        ...data,
        config: updatedConfig,
        lastUpdate: new Date().toISOString(),
        transactions: [
          {
            signature: `tx-config-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "config_update",
            status: "Success",
            description: "Updated game configuration",
          },
          ...data.transactions,
        ],
      });

      setStatusMessage("Configuration updated successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update configuration:", error);
      setStatusMessage(
        "Error: Failed to update configuration. See console for details."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssetDeploy = async (assetData) => {
    try {
      setIsSaving(true);
      setStatusMessage("Deploying new asset to blockchain...");

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newAsset = {
        ...assetData,
        id: `asset-${Date.now()}`,
        deployedAt: new Date().toISOString(),
      };

      // Update the parent component with new data
      onUpdate({
        ...data,
        assets: [...data.assets, newAsset],
        lastUpdate: new Date().toISOString(),
        transactions: [
          {
            signature: `tx-asset-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "asset_deploy",
            status: "Success",
            description: `Deployed asset: ${assetData.name}`,
          },
          ...data.transactions,
        ],
      });

      setStatusMessage("Asset deployed successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      console.error("Failed to deploy asset:", error);
      setStatusMessage(
        "Error: Failed to deploy asset. See console for details."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="honeycomb-admin-panel">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
        <button
          className={`tab-button ${activeTab === "config" ? "active" : ""}`}
          onClick={() => setActiveTab("config")}
        >
          Game Configuration
        </button>
        <button
          className={`tab-button ${activeTab === "assets" ? "active" : ""}`}
          onClick={() => setActiveTab("assets")}
        >
          Asset Management
        </button>
        <button
          className={`tab-button ${
            activeTab === "transactions" ? "active" : ""
          }`}
          onClick={() => setActiveTab("transactions")}
        >
          Transaction History
        </button>
      </div>

      {statusMessage && (
        <div
          className={`status-message ${
            statusMessage.startsWith("Error") ? "error" : "success"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="tab-content">
        {activeTab === "projects" && (
          <ProjectManager
            projects={data.projects || []}
            onProjectCreated={(updatedProjects, newTransaction) => {
              const updatedData = {
                ...data,
                projects: updatedProjects,
                lastUpdate: new Date().toISOString(),
              };

              if (newTransaction) {
                updatedData.transactions = [
                  newTransaction,
                  ...updatedData.transactions,
                ];
              }

              onUpdate(updatedData);
            }}
          />
        )}

        {activeTab === "config" && (
          <ConfigEditor
            config={data.config}
            onSave={handleConfigUpdate}
            isSaving={isSaving}
          />
        )}

        {activeTab === "assets" && (
          <AssetManager
            assets={data.assets}
            onDeploy={handleAssetDeploy}
            isSaving={isSaving}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionHistory transactions={data.transactions} />
        )}
      </div>
    </div>
  );
};

HoneycombAdminPanel.propTypes = {
  data: PropTypes.shape({
    projects: PropTypes.array,
    characterModels: PropTypes.array,
    config: PropTypes.object.isRequired,
    assets: PropTypes.array.isRequired,
    transactions: PropTypes.array.isRequired,
    lastUpdate: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

// ================== Honeycomb Admin Page ==================
export const HoneycombAdminPage = () => {
  const { connected, publicKey } = useWalletContext();
  const [honeycombData, setHoneycombData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadHoneycombData = async () => {
    try {
      setIsLoading(true);

      // For MVP, we'll create mock data
      const mockData = {
        projects: [],
        characterModels: [],
        assets: [
          {
            id: "asset-sample-1",
            name: "Vermin Character",
            type: "vermin",
            rarity: "rare",
            description: "A basic vermin character asset",
            attributes: {
              strength: 10,
              agility: 8,
              vitality: 12,
              intelligence: 6,
              breedingPotential: 4,
            },
            group: "collection123",
            metadataURI: "ipfs://sample/vermin1.json",
            deployedAt: new Date().toISOString(),
          },
          {
            id: "asset-sample-2",
            name: "Terrain Block",
            type: "terrain",
            rarity: "common",
            description: "Basic terrain block for vermin habitat",
            attributes: {
              size: "medium",
              resourceYield: 5,
              biome: "forest",
            },
            group: "collection456",
            metadataURI: "ipfs://sample/terrain1.json",
            deployedAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        transactions: [],
        config: {
          gameEnabled: true,
          maintenanceMode: false,
          contractAddress: "J1S9H7XSB4iUDr3x1V2aqdeVrt9fJeZ6VMuLyQu82wW", // Example address
          baseRewardRate: 5.0,
          stakingMultiplier: 1.5,
          penaltyRate: 10,
          breedingCooldown: 24,
          maxVerminPerWallet: 10,
          verminLifespan: 30,
        },
      };

      setHoneycombData(mockData);
      setError(null);
    } catch (err) {
      setError("Failed to load Honeycomb Protocol data. Please try again.");
      console.error("Error loading Honeycomb data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasLoadedRef = useRef(false);

  // Load data when wallet connects
  useEffect(() => {
    if (connected !== isWalletConnected) {
      setIsWalletConnected(connected && publicKey !== null);
    }

    if (connected && publicKey && isAuthenticated && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadHoneycombData();
    } else if (!connected || !isAuthenticated) {
      hasLoadedRef.current = false;
      if (honeycombData !== null) {
        setHoneycombData(null);
      }
    }
  }, [connected, publicKey, isAuthenticated, isWalletConnected, honeycombData]);

  const handleAuthChange = (authenticated) => {
    if (authenticated !== isAuthenticated) {
      setIsAuthenticated(authenticated);
    }
    /*
    setIsAuthenticated(authenticated);

    if (authenticated && connected && publicKey) {
      loadHoneycombData();
    }
    */
  };

  return (
    <div className="honeycomb-admin-page">
      <div className="admin-header">
        <div className="header-title">
          <h1>Vermin Game Admin Panel</h1>
          <p className="description">
            Manage on-chain game parameters and assets for the Vermin project.
          </p>
        </div>
        <div className="header-wallet">
          <WalletConnect onConnect={() => setIsWalletConnected(true)} />
        </div>
      </div>

      {!isWalletConnected ? (
        <div className="connect-wallet-prompt">
          <div className="prompt-content">
            <h2>Connect Your Wallet</h2>
            <p>
              Please connect your Solana wallet to access the Honeycomb Protocol
              admin features.
            </p>
          </div>
        </div>
      ) : (
        <AdminAuth onAuthChange={handleAuthChange}>
          {isLoading && (
            <div className="loading-spinner">Loading Honeycomb data...</div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadHoneycombData}>Retry</button>
            </div>
          )}

          {!isLoading && !error && honeycombData && (
            <HoneycombAdminPanel
              data={honeycombData}
              onUpdate={(updatedData) => setHoneycombData(updatedData)}
            />
          )}
        </AdminAuth>
      )}
    </div>
  );
};
