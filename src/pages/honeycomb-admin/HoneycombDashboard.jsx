import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWalletContext } from "@/contexts/WalletContext";
import * as web3 from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import LoadingSpinner from "@/components/LoadingSpinner";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import AdminUserDashboard from "@/components/user/AdminUserDashboard";
import { useProject } from "@/hooks/useProject";

// Constants
const API_URL =
  import.meta.env.VITE_HONEYCOMB_API_URL || "https://edge.eboy.dev/";
const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL;

// Honeycomb Dashboard Component
const HoneycombDashboard = () => {
  const { publicKey, connected } = useWalletContext();
  const { setProjectActive } = useProject();
  const [client, setClient] = useState(null);
  const [connection, setConnection] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // State to track expanded project cards
  const [expandedProjects, setExpandedProjects] = useState({});

  // Toggle expanded state for a project
  const toggleProjectExpanded = (projectAddress) => {
    console.log("Toggling project expansion:", projectAddress);
    setExpandedProjects((prev) => {
      const newState = {
        ...prev,
        [projectAddress]: !prev[projectAddress],
      };
      console.log("New expanded state:", newState);
      return newState;
    });
  };

  // Initialize connection and client
  useEffect(() => {
    if (connected && publicKey) {
      try {
        const newConnection = new Connection(RPC_URL, {
          commitment: "processed",
        });
        setConnection(newConnection);

        // Initialize Edge Client - set second param to true to enable SSE
        const newClient = createEdgeClient(API_URL, false);
        setClient(newClient);
      } catch (err) {
        console.error("Error initializing Honeycomb connection:", err);
        setError("Failed to initialize connection to Honeycomb Protocol");
      }
    }
  }, [connected, publicKey]);

  // Fetch projects
  useEffect(() => {
    if (client && connected && publicKey) {
      const fetchProjects = async () => {
        try {
          setLoading(true);

          // Fetch projects where the current wallet is the authority
          const response = await client.findProjects({
            authority: publicKey.toString(),
          });

          if (response && response.project) {
            // Filter projects to only include ones where this wallet is the authority
            const myProjects = response.project.filter(
              (project) => project.authority === publicKey.toString()
            );
            console.log("My projects:", myProjects);
            setProjects(myProjects);

            // Set the first project as selected by default if none is selected
            if (myProjects.length > 0 && !selectedProject) {
              setSelectedProject(myProjects[0].address);
            }
          }

          setError(null);
        } catch (err) {
          console.error("Error fetching Honeycomb projects:", err);
          setError("Failed to load projects from Honeycomb Protocol");
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }
  }, [client, connected, publicKey]);

  // Create project function - real implementation
  const handleCreateProject = async (projectData) => {
    if (!client || !connection || !publicKey) {
      setError("Wallet not connected or client not initialized");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Create project transaction
      const {
        createCreateProjectTransaction: {
          project: projectAddress,
          tx: txResponse,
        },
      } = await client.createCreateProjectTransaction({
        name: projectData.name,
        authority: publicKey.toString(),
        payer: publicKey.toString(),
        subsidizeFees: projectData.subsidizeFees,
      });

      console.log("Project creation transaction prepared:", txResponse);

      try {
        // 2. Get the transaction details from the response
        const transaction = new web3.Transaction();

        // Add instructions from txResponse
        if (txResponse.transaction && txResponse.transaction.instructions) {
          for (const instruction of txResponse.transaction.instructions) {
            transaction.add(
              new web3.TransactionInstruction({
                keys: instruction.keys,
                programId: new web3.PublicKey(instruction.programId),
                data: Uint8Array.from(atob(instruction.data), (c) =>
                  c.charCodeAt(0)
                ),
              })
            );
          }
        }

        // 3. Set transaction properties
        transaction.feePayer = publicKey;
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        // 4. Request wallet to sign transaction
        try {
          // For wallets that support the signTransaction method
          const signedTransaction = await window.solana.signTransaction(
            transaction
          );

          console.log("Transaction signed, sending to network...");

          // 5. Send the signed transaction
          const signature = await connection.sendRawTransaction(
            signedTransaction.serialize()
          );

          // 6. Wait for confirmation
          const confirmation = await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
          });

          if (confirmation.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err}`);
          }

          console.log("Project created successfully:", signature);

          // If subsidizing fees, fund the project
          if (projectData.subsidizeFees) {
            try {
              // Create a funding transaction
              const fundingTx = new web3.Transaction().add(
                web3.SystemProgram.transfer({
                  fromPubkey: publicKey,
                  toPubkey: new web3.PublicKey(projectAddress),
                  lamports: 100_000_000, // 0.1 SOL
                })
              );

              fundingTx.recentBlockhash = blockhash;
              fundingTx.feePayer = publicKey;

              const signedFundingTx = await window.solana.signTransaction(
                fundingTx
              );

              const fundingTxid = await connection.sendRawTransaction(
                signedFundingTx.serialize()
              );

              await connection.confirmTransaction({
                signature: fundingTxid,
                blockhash,
                lastValidBlockHeight,
              });

              console.log("Project funded successfully:", fundingTxid);
            } catch (fundingError) {
              console.error("Error funding project:", fundingError);
              // Continue even if funding fails
            }
          }

          // 7. Refresh projects list
          const response = await client.findProjects({
            addresses: [projectAddress],
          });

          if (response && response.project && response.project[0]) {
            setProjects((prevProjects) => [
              response.project[0],
              ...prevProjects,
            ]);
            setSelectedProject(projectAddress);
            setShowCreateForm(false);
          }
        } catch (signError) {
          console.error("Error signing transaction:", signError);
          setError("Failed to sign transaction. Please try again.");
        }
      } catch (txError) {
        console.error("Transaction error:", txError);
        setError("Failed to process transaction: " + txError.message);
      }
    } catch (err) {
      console.error("Error creating Honeycomb project:", err);
      setError("Failed to create project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handl toggling a project's Active status in the dApp
  const handleProjectActiveToggle = async (
    projectAddress,
    currentActiveState
  ) => {
    try {
      // Update the project's active state in context
      await setProjectActive(projectAddress, !currentActiveState);

      // Update the projects array with the new state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.address === projectAddress
            ? { ...project, isActive: !currentActiveState }
            : project
        )
      );

      setError("");
    } catch (err) {
      console.error("Error toggling project active state:", err);
      setError("Failed to update project status");
    }
  };

  // Handle profile tree creation - real implementation
  const handleCreateProfileTree = async (projectAddress) => {
    if (!client || !connection || !publicKey) {
      setError("Wallet not connected or client not initialized");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Create profile tree transaction
      const {
        createCreateProfilesTreeTransaction: { tx: txResponse },
      } = await client.createCreateProfilesTreeTransaction({
        treeConfig: {
          advanced: {
            maxDepth: 3,
            maxBufferSize: 8,
            canopyDepth: 3,
          },
        },
        project: projectAddress,
        payer: publicKey.toString(),
      });

      console.log("Profile tree transaction prepared:", txResponse);

      try {
        // 2. Get the transaction details from the response
        const transaction = new web3.Transaction();

        // Add instructions from txResponse
        if (txResponse.transaction && txResponse.transaction.instructions) {
          for (const instruction of txResponse.transaction.instructions) {
            transaction.add(
              new web3.TransactionInstruction({
                keys: instruction.keys,
                programId: new web3.PublicKey(instruction.programId),
                data: Uint8Array.from(atob(instruction.data), (c) =>
                  c.charCodeAt(0)
                ),
              })
            );
          }
        }

        // 3. Set transaction properties
        transaction.feePayer = publicKey;
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        // 4. Request wallet to sign transaction
        try {
          // For wallets that support the signTransaction method
          const signedTransaction = await window.solana.signTransaction(
            transaction
          );

          console.log("Transaction signed, sending to network...");

          // 5. Send the signed transaction
          const signature = await connection.sendRawTransaction(
            signedTransaction.serialize()
          );

          // 6. Wait for confirmation
          const confirmation = await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
          });

          if (confirmation.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err}`);
          }

          console.log("Profile tree created successfully:", signature);

          // 7. Refresh the specific project
          const response = await client.findProjects({
            addresses: [projectAddress],
          });

          if (response && response.project && response.project[0]) {
            setProjects((prevProjects) =>
              prevProjects.map((p) =>
                p.address === projectAddress ? response.project[0] : p
              )
            );
          }
        } catch (signError) {
          console.error("Error signing transaction:", signError);
          setError("Failed to sign transaction. Please try again.");
        }
      } catch (txError) {
        console.error("Transaction error:", txError);
        setError("Failed to process transaction: " + txError.message);
      }
    } catch (err) {
      console.error("Error creating profile tree:", err);
      setError("Failed to create profile tree: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle badge criteria creation - real implementation
  const handleCreateBadgeCriteria = async (projectAddress) => {
    if (!client || !connection || !publicKey) {
      setError("Wallet not connected or client not initialized");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Create badge criteria transaction
      const { createInitializeBadgeCriteriaTransaction: txResponse } =
        await client.createInitializeBadgeCriteriaTransaction({
          args: {
            authority: publicKey.toString(),
            projectAddress,
            endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // One week from now
            startTime: Math.floor(Date.now() / 1000),
            badgeIndex: 0,
            payer: publicKey.toString(),
            condition: "Public", // Using "Public" condition
          },
        });

      console.log("Badge criteria transaction prepared:", txResponse);

      try {
        // 2. Get the transaction details from the response
        const transaction = new web3.Transaction();

        // Add instructions from txResponse
        if (txResponse.transaction && txResponse.transaction.instructions) {
          for (const instruction of txResponse.transaction.instructions) {
            transaction.add(
              new web3.TransactionInstruction({
                keys: instruction.keys,
                programId: new web3.PublicKey(instruction.programId),
                data: Uint8Array.from(atob(instruction.data), (c) =>
                  c.charCodeAt(0)
                ),
              })
            );
          }
        }

        // 3. Set transaction properties
        transaction.feePayer = publicKey;
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        // 4. Request wallet to sign transaction
        try {
          // For wallets that support the signTransaction method
          const signedTransaction = await window.solana.signTransaction(
            transaction
          );

          console.log("Transaction signed, sending to network...");

          // 5. Send the signed transaction
          const signature = await connection.sendRawTransaction(
            signedTransaction.serialize()
          );

          // 6. Wait for confirmation
          const confirmation = await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
          });

          if (confirmation.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err}`);
          }

          console.log("Badge criteria created successfully:", signature);

          // 7. Refresh the specific project
          const response = await client.findProjects({
            addresses: [projectAddress],
          });

          if (response && response.project && response.project[0]) {
            setProjects((prevProjects) =>
              prevProjects.map((p) =>
                p.address === projectAddress ? response.project[0] : p
              )
            );
          }
        } catch (signError) {
          console.error("Error signing transaction:", signError);
          setError("Failed to sign transaction. Please try again.");
        }
      } catch (txError) {
        console.error("Transaction error:", txError);
        setError("Failed to process transaction: " + txError.message);
      }
    } catch (err) {
      console.error("Error creating badge criteria:", err);
      setError("Failed to create badge criteria: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for rendering
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      // Try to create a valid date object
      const date = new Date(timestamp);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "N/A";
      }

      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // Format address to make it more readable
  const formatAddress = (address) => {
    if (!address) return "N/A";

    // Truncate address for display
    if (address.length > 12) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }

    return address;
  };

  const renderProjects = () => {
    if (projects.length === 0) {
      return (
        <div className="no-projects">
          <p>
            No projects found. Create your first Honeycomb project to get
            started.
          </p>
        </div>
      );
    }

    return (
      <div className="projects-list">
        {projects.map((project) => (
          <div key={project.address} className="project-card">
            <div
              className="project-header"
              onClick={() => toggleProjectExpanded(project.address)}
            >
              <h3>
                {project.name}
                <span
                  className={`project-status-badge ${
                    project.isActive
                      ? "project-status-badge--active"
                      : "project-status-badge--inactive"
                  }`}
                >
                  <span
                    className={`status-indicator ${
                      project.isActive
                        ? "status-indicator--active"
                        : "status-indicator--inactive"
                    }`}
                  ></span>
                  {project.isActive ? "Active" : "Inactive"}
                </span>
              </h3>
              <div className="project-address">
                <span className="address-label">Address:</span>
                <span className="address-value" title={project.address}>
                  {formatAddress(project.address)}
                </span>
              </div>
              <div className="expand-icon">
                {expandedProjects[project.address] ? "▼" : "▶"}
              </div>
            </div>

            {expandedProjects[project.address] && (
              <div className="project-details">
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
                      <span className="detail-value" title={project.authority}>
                        {formatAddress(project.authority)}
                      </span>
                    </div>
                  </div>
                </div>

                {project.profileTrees && (
                  <div className="detail-section">
                    <h4>Project Visibility</h4>
                    <div className="status-toggle">
                      <label className="status-toggle__label">
                        <span className="status-toggle__text">
                          {project.isActive ? "Active" : "Inactive"}
                        </span>
                        <div className="status-toggle__switch">
                          <input
                            type="checkbox"
                            checked={project.isActive || false}
                            onChange={() =>
                              handleProjectActiveToggle(
                                project.address,
                                project.isActive || false
                              )
                            }
                            className="status-toggle__input"
                          />
                          <span className="status-toggle__slider"></span>
                        </div>
                      </label>
                      <div className="status-toggle__description">
                        {project.isActive
                          ? "This project is visible to users and available in the app"
                          : "This project is hidden from users and not available in the app"}
                      </div>
                    </div>
                    <h4>Profile Trees</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Active Tree:</span>
                        <span className="detail-value">
                          {project.profileTrees.active !== undefined &&
                          project.profileTrees.merkle_trees &&
                          project.profileTrees.merkle_trees[
                            project.profileTrees.active
                          ]
                            ? formatAddress(
                                project.profileTrees.merkle_trees[
                                  project.profileTrees.active
                                ]
                              )
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

                {project.badgeCriteria && project.badgeCriteria.length > 0 && (
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
                  {!project.profileTrees?.merkle_trees?.length && (
                    <button
                      className="btn-manage"
                      onClick={() => handleCreateProfileTree(project.address)}
                    >
                      Create Profile Tree
                    </button>
                  )}

                  {(!project.badgeCriteria ||
                    project.badgeCriteria.length === 0) && (
                    <button
                      className="btn-badge"
                      onClick={() => handleCreateBadgeCriteria(project.address)}
                    >
                      Create Badge Criteria
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Project form component
  const ProjectForm = ({ onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
      name: "Vermin Game Project",
      description: "A Honeycomb Protocol project for the Vermin game",
      profileTreesEnabled: true,
      badgeCriteriaEnabled: true,
      subsidizeFees: true,
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
      onSubmit(formData);
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

  // Render the project selector for the users tab
  const renderProjectSelector = () => {
    if (projects.length === 0) {
      return (
        <div className="no-projects-warning">
          <p>
            No projects found. Please create a project first to manage users and
            profiles.
          </p>
        </div>
      );
    }

    return (
      <div className="project-selector">
        <label htmlFor="project-select">Select Project:</label>
        <select
          id="project-select"
          value={selectedProject || ""}
          onChange={(e) => setSelectedProject(e.target.value)}
          disabled={loading}
        >
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((project) => (
            <option key={project.address} value={project.address}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="honeycomb-dashboard">
      <div className="dashboard-header">
        <h2>Honeycomb Protocol Dashboard</h2>
        <p>Manage your Honeycomb projects, assets, and configurations</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users & Profiles
        </button>
        <button
          className={`tab-button ${activeTab === "assets" ? "active" : ""}`}
          onClick={() => setActiveTab("assets")}
        >
          Assets
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "projects" && (
          <div className="project-manager">
            <div className="project-actions">
              <h3>Your Projects</h3>
              <button
                className="btn-create"
                onClick={() => setShowCreateForm(!showCreateForm)}
                disabled={loading}
              >
                {showCreateForm ? "Cancel" : "Create New Project"}
              </button>
            </div>

            {showCreateForm && (
              <ProjectForm
                onSubmit={handleCreateProject}
                onCancel={() => setShowCreateForm(false)}
                isLoading={loading}
              />
            )}

            {loading ? (
              <LoadingSpinner message="Loading Honeycomb data..." />
            ) : (
              renderProjects()
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="user-profile-manager">
            <div className="tab-header">
              <h3>User & Profile Management</h3>
              {renderProjectSelector()}
            </div>

            {loading ? (
              <LoadingSpinner message="Loading user data..." />
            ) : selectedProject ? (
              <AdminUserDashboard
                client={client}
                projectAddress={selectedProject}
              />
            ) : (
              <div className="no-project-selected">
                <p>Please select a project to manage users and profiles.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "assets" && (
          <div className="asset-manager">
            <h3>Asset Management</h3>
            <p>
              This section will allow you to manage your Honeycomb assets
              (coming soon)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoneycombDashboard;
