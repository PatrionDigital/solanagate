import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWallet } from "@solana/wallet-adapter-react";
import useHoneycombAuth from "../../hooks/useHoneycombAuth";
import UserList from "./UserList";
import UserSearch from "./UserSearch";
import UserInvite from "./UserInvite";
import { formatPublicKey } from "../../utils/honeycombHelpers";

/**
 * Admin dashboard for managing users and profiles
 */
const AdminUserDashboard = ({ client, projectAddress, className = "" }) => {
  const { publicKey, connected } = useWallet();
  const { isAuthenticated, authLoading, authenticate } =
    useHoneycombAuth(client);

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeView, setActiveView] = useState("users"); // 'users', 'search', 'invite', 'user-detail'
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");

  // Check if current user is an admin
  const checkAdminStatus = async () => {
    if (!connected || !publicKey || !client || !projectAddress) {
      setIsAdmin(false);
      return;
    }

    try {
      // This is a placeholder. In your actual app, you would check
      // if the connected wallet has admin rights for the project
      const { project } = await client.findProjects({
        addresses: [projectAddress],
      });

      // Check if connected wallet is the project authority
      const isProjectAuthority =
        project?.[0]?.authority === publicKey.toString();

      setIsAdmin(isProjectAuthority);

      if (!isProjectAuthority) {
        setError("You do not have admin permissions for this project.");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setError("Failed to verify admin permissions. Please try again.");
      setIsAdmin(false);
    }
  };

  // Authenticate and check admin status on component mount
  useEffect(() => {
    if (connected && !isAuthenticated && !authLoading) {
      authenticate()
        .then(() => checkAdminStatus())
        .catch((err) => {
          console.error("Authentication error:", err);
          setError("Failed to authenticate. Please try again.");
        });
    } else if (connected && isAuthenticated) {
      checkAdminStatus();
    }
  }, [connected, isAuthenticated, authLoading, projectAddress]);

  // Handle user selection from list or search
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setActiveView("user-detail");
  };

  // Handle invitation sent
  const handleInviteSent = (inviteData) => {
    // In a real app, you might want to show a success message
    // or add the invitation to a list of pending invites
    console.log("Invitation sent:", inviteData);

    // Return to users list after successfully sending an invite
    setActiveView("users");
  };

  // Show wallet connect message if not connected
  if (!connected) {
    return (
      <div
        className={`admin-dashboard admin-dashboard--no-wallet ${className}`}
      >
        <div className="admin-dashboard__connect-message">
          <h3>Connect Your Wallet</h3>
          <p>Please connect your wallet to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className={`admin-dashboard admin-dashboard--loading ${className}`}>
        <div className="admin-dashboard__loading">
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  // Show authentication error
  if (!isAuthenticated && !authLoading) {
    return (
      <div
        className={`admin-dashboard admin-dashboard--auth-error ${className}`}
      >
        <div className="admin-dashboard__error">
          <h3>Authentication Error</h3>
          <p>
            {error ||
              "Failed to authenticate with your wallet. Please try again."}
          </p>
          <button
            onClick={authenticate}
            className="admin-dashboard__retry-button"
          >
            Retry Authentication
          </button>
        </div>
      </div>
    );
  }

  // Show permission error if not an admin
  if (!isAdmin) {
    return (
      <div
        className={`admin-dashboard admin-dashboard--no-permission ${className}`}
      >
        <div className="admin-dashboard__permission-error">
          <h3>Access Denied</h3>
          <p>
            {error ||
              "You do not have permission to access the admin dashboard."}
          </p>
        </div>
      </div>
    );
  }

  // Main admin dashboard view
  return (
    <div className={`admin-dashboard ${className}`}>
      <div className="admin-dashboard__header">
        <h2 className="admin-dashboard__title">User Management</h2>

        <div className="admin-dashboard__tabs">
          <button
            className={`admin-dashboard__tab ${
              activeView === "users" ? "admin-dashboard__tab--active" : ""
            }`}
            onClick={() => setActiveView("users")}
          >
            All Users
          </button>
          <button
            className={`admin-dashboard__tab ${
              activeView === "search" ? "admin-dashboard__tab--active" : ""
            }`}
            onClick={() => setActiveView("search")}
          >
            Search
          </button>
          <button
            className={`admin-dashboard__tab ${
              activeView === "invite" ? "admin-dashboard__tab--active" : ""
            }`}
            onClick={() => setActiveView("invite")}
          >
            Invite User
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-dashboard__error-banner">
          {error}
          <button
            onClick={() => setError("")}
            className="admin-dashboard__error-close"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="admin-dashboard__content">
        {activeView === "users" && (
          <UserList
            client={client}
            projectAddress={projectAddress}
            onUserSelect={handleUserSelect}
          />
        )}

        {activeView === "search" && (
          <div className="admin-dashboard__search-container">
            <h3 className="admin-dashboard__section-title">Search Users</h3>
            <UserSearch
              client={client}
              projectAddress={projectAddress}
              onUserFound={handleUserSelect}
              onError={setError}
            />
          </div>
        )}

        {activeView === "invite" && (
          <div className="admin-dashboard__invite-container">
            <h3 className="admin-dashboard__section-title">Invite New User</h3>
            <UserInvite
              client={client}
              projectAddress={projectAddress}
              onInviteSent={handleInviteSent}
              onError={setError}
            />
          </div>
        )}

        {activeView === "user-detail" && selectedUser && (
          <div className="admin-dashboard__user-detail">
            <div className="admin-dashboard__user-detail-header">
              <h3 className="admin-dashboard__section-title">
                User Details:{" "}
                {selectedUser.data?.name ||
                  formatPublicKey(selectedUser.wallet)}
              </h3>
              <button
                onClick={() => setActiveView("users")}
                className="admin-dashboard__back-button"
              >
                Back to Users
              </button>
            </div>

            <div className="admin-dashboard__user-profile">
              {/* Create special version of ProfileCard that accepts user data */}
              <div className="admin-dashboard__profile-card-wrapper">
                <div className="admin-dashboard__profile-card">
                  <div className="admin-dashboard__profile-header">
                    <div className="admin-dashboard__profile-avatar">
                      {selectedUser.data?.image ? (
                        <img
                          src={selectedUser.data.image}
                          alt={selectedUser.data?.name || "User"}
                          className="admin-dashboard__profile-avatar-img"
                        />
                      ) : (
                        <div className="admin-dashboard__profile-avatar-placeholder">
                          {selectedUser.data?.name?.charAt(0) ||
                            selectedUser.wallet.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="admin-dashboard__profile-info">
                      <h4 className="admin-dashboard__profile-name">
                        {selectedUser.data?.name || "Unnamed User"}
                      </h4>
                      <p className="admin-dashboard__profile-wallet">
                        {formatPublicKey(selectedUser.wallet)}
                      </p>

                      {selectedUser.data?.created_at && (
                        <p className="admin-dashboard__profile-joined">
                          Joined:{" "}
                          {new Date(
                            selectedUser.data.created_at
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedUser.data?.bio && (
                    <div className="admin-dashboard__profile-bio">
                      <p>{selectedUser.data.bio}</p>
                    </div>
                  )}

                  {selectedUser.data?.attributes &&
                    selectedUser.data.attributes.length > 0 && (
                      <div className="admin-dashboard__profile-attributes">
                        <h5 className="admin-dashboard__attributes-title">
                          Attributes
                        </h5>
                        <div className="admin-dashboard__attributes-list">
                          {selectedUser.data.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="admin-dashboard__attribute"
                            >
                              <span className="admin-dashboard__attribute-name">
                                {attr.trait_type}:
                              </span>
                              <span className="admin-dashboard__attribute-value">
                                {attr.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="admin-dashboard__user-actions">
                <h5 className="admin-dashboard__actions-title">
                  Admin Actions
                </h5>
                <div className="admin-dashboard__action-buttons">
                  <button className="admin-dashboard__action-button admin-dashboard__action-button--message">
                    Message User
                  </button>
                  <button className="admin-dashboard__action-button admin-dashboard__action-button--badges">
                    Manage Badges
                  </button>
                  <button className="admin-dashboard__action-button admin-dashboard__action-button--reset">
                    Reset Profile
                  </button>
                </div>
              </div>
            </div>

            {/* We could add additional user management features here */}
            <div className="admin-dashboard__user-badges">
              <h4 className="admin-dashboard__section-title">User Badges</h4>
              <p className="admin-dashboard__placeholder-text">
                Badge management functionality would be implemented here.
              </p>
            </div>

            <div className="admin-dashboard__user-activity">
              <h4 className="admin-dashboard__section-title">User Activity</h4>
              <p className="admin-dashboard__placeholder-text">
                User activity tracking would be implemented here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

AdminUserDashboard.propTypes = {
  client: PropTypes.object.isRequired,
  projectAddress: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default AdminUserDashboard;
