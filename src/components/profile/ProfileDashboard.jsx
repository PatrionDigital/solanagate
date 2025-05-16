import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useWallet } from "@solana/wallet-adapter-react";
import useProfile from "../../hooks/useProfile";
import useHoneycombAuth from "../../hooks/useHoneycombAuth";
import { Card, Button } from "@windmill/react-ui";
import ProfileCard from "./ProfileCard";
import ProfileBadges from "./ProfileBadges";
import ProfileAssets from "./ProfileAssets";
import ProfileEditor from "./ProfileEditor";
import AdminProtected from "../AdminProtected";

// Admin Debug Panel Component
const SpinnerGameDebugPanel = ({ onDebugAction }) => {
  const [message, setMessage] = useState("");

  const handleAddSpin = useCallback(() => {
    if (onDebugAction) onDebugAction("addSpin");
    setMessage("+1 spin added!");
    setTimeout(() => setMessage(""), 1500);
  }, [onDebugAction]);

  const handleResetHistory = useCallback(() => {
    if (onDebugAction) onDebugAction("resetHistory");
    setMessage("Spin history and spins reset!");
    setTimeout(() => setMessage(""), 1500);
  }, [onDebugAction]);

  return (
    <Card className="vermin-spinner-debug-panel mt-4">
      <h3 className="text-lg font-semibold mb-2">Spinner Game Debug</h3>
      <div className="flex space-x-2">
        <Button size="small" onClick={handleAddSpin}>
          Add Spin
        </Button>
        <Button size="small" layout="outline" onClick={handleResetHistory}>
          Reset History
        </Button>
      </div>
      {message && <div className="mt-2 text-sm text-green-500">{message}</div>}
    </Card>
  );
};

SpinnerGameDebugPanel.propTypes = {
  onDebugAction: PropTypes.func.isRequired,
};

/**
 * Dashboard component integrating all profile management features
 */
const ProfileDashboard = ({ client, className = "", onSpinnerDebugAction }) => {
  const { connected } = useWallet();
  const { profileLoading, hasProfile, refreshProfile } = useProfile();

  const { isAuthenticated, authLoading, authenticate } =
    useHoneycombAuth(client);

  const [activeView, setActiveView] = useState("profile"); // 'profile', 'edit', 'create', 'badges', 'assets'
  const [error, setError] = useState("");

  // Authenticate when wallet is connected
  useEffect(() => {
    if (connected && !isAuthenticated && !authLoading) {
      authenticate().catch((err) => {
        console.error("Authentication error:", err);
        setError("Failed to authenticate. Please try again.");
      });
    }
  }, [connected, isAuthenticated, authLoading, authenticate]);

  // Reset active view when profile status changes
  useEffect(() => {
    if (!profileLoading) {
      if (hasProfile) {
        setActiveView("profile");
      } else {
        setActiveView("create");
      }
    }
  }, [hasProfile, profileLoading]);

  // Handle editor success
  const handleEditorSuccess = () => {
    refreshProfile();
    setActiveView("profile");
  };

  // Handle editor cancel
  const handleEditorCancel = () => {
    if (hasProfile) {
      setActiveView("profile");
    } else {
      // If no profile exists and user cancels creation,
      // stay on create view but we could navigate elsewhere
      setActiveView("create");
    }
  };

  // Show wallet connect message if not connected
  if (!connected) {
    return (
      <div
        className={`profile-dashboard profile-dashboard--no-wallet ${className}`}
      >
        <div className="profile-dashboard__connect-message">
          <h3>Connect Your Wallet</h3>
          <p>Please connect your wallet to access your profile.</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <div
        className={`profile-dashboard profile-dashboard--loading ${className}`}
      >
        <div className="profile-dashboard__loading">
          <span>Loading your profile...</span>
        </div>
      </div>
    );
  }

  // Show authentication error
  if (!isAuthenticated && !authLoading) {
    return (
      <div
        className={`profile-dashboard profile-dashboard--auth-error ${className}`}
      >
        <div className="profile-dashboard__error">
          <h3>Authentication Error</h3>
          <p>
            {error ||
              "Failed to authenticate with your wallet. Please try again."}
          </p>
          <button
            onClick={authenticate}
            className="profile-dashboard__retry-button"
          >
            Retry Authentication
          </button>
        </div>
      </div>
    );
  }

  // Render profile creation view
  if (activeView === "create") {
    return (
      <div
        className={`profile-dashboard profile-dashboard--create ${className}`}
      >
        <h2 className="profile-dashboard__title">Create Your Profile</h2>
        <ProfileEditor
          isCreate={true}
          client={client}
          onSuccess={handleEditorSuccess}
          onCancel={handleEditorCancel}
        />
      </div>
    );
  }

  // Render profile edit view
  if (activeView === "edit") {
    return (
      <div className={`profile-dashboard profile-dashboard--edit ${className}`}>
        <h2 className="profile-dashboard__title">Edit Your Profile</h2>
        <ProfileEditor
          isCreate={false}
          client={client}
          onSuccess={handleEditorSuccess}
          onCancel={handleEditorCancel}
        />
      </div>
    );
  }

  // Main dashboard view with tabs for different sections
  return (
    <div className={`profile-dashboard ${className}`}>
      <div className="profile-dashboard__header">
        <h2 className="profile-dashboard__title">Your Profile</h2>

        <div className="profile-dashboard__tabs">
          <button
            className={`profile-dashboard__tab ${
              activeView === "profile" ? "profile-dashboard__tab--active" : ""
            }`}
            onClick={() => setActiveView("profile")}
          >
            Profile
          </button>
          <button
            className={`profile-dashboard__tab ${
              activeView === "badges" ? "profile-dashboard__tab--active" : ""
            }`}
            onClick={() => setActiveView("badges")}
          >
            Badges
          </button>
          <button
            className={`profile-dashboard__tab ${
              activeView === "assets" ? "profile-dashboard__tab--active" : ""
            }`}
            onClick={() => setActiveView("assets")}
          >
            Assets
          </button>
        </div>

        <div className="profile-dashboard__actions">
          <button
            onClick={() => setActiveView("edit")}
            className="profile-dashboard__edit-button"
          >
            Edit Profile
          </button>
          <button
            onClick={refreshProfile}
            className="profile-dashboard__refresh-button"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="profile-dashboard__content">
        {/* Admin Debug Panel */}
        {onSpinnerDebugAction && (
          <AdminProtected>
            <SpinnerGameDebugPanel onDebugAction={onSpinnerDebugAction} />
          </AdminProtected>
        )}
        {activeView === "profile" && (
          <div className="profile-dashboard__profile-view">
            <ProfileCard showEditButton={false} />

            {/* Show preview of badges and assets in profile view */}
            <div className="profile-dashboard__previews">
              <div className="profile-dashboard__badges-preview">
                <h3 className="profile-dashboard__section-title">Badges</h3>
                <ProfileBadges />
                <button
                  onClick={() => setActiveView("badges")}
                  className="profile-dashboard__view-all"
                >
                  View All Badges
                </button>
              </div>

              <div className="profile-dashboard__assets-preview">
                <h3 className="profile-dashboard__section-title">
                  Recent Assets
                </h3>
                <ProfileAssets limit={4} />
                <button
                  onClick={() => setActiveView("assets")}
                  className="profile-dashboard__view-all"
                >
                  View All Assets
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === "badges" && (
          <div className="profile-dashboard__badges-view">
            <h3 className="profile-dashboard__section-title">Your Badges</h3>
            <ProfileBadges />
          </div>
        )}

        {activeView === "assets" && (
          <div className="profile-dashboard__assets-view">
            <h3 className="profile-dashboard__section-title">Your Assets</h3>
            <ProfileAssets />
          </div>
        )}
      </div>
    </div>
  );
};

ProfileDashboard.propTypes = {
  client: PropTypes.object.isRequired,
  className: PropTypes.string,
  onSpinnerDebugAction: PropTypes.func,
};

export default ProfileDashboard;
