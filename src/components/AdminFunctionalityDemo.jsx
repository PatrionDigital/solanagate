import { useState } from "react";
import PropTypes from "prop-types";
import { useWalletContext } from "@/contexts/WalletContext";
import { isAdminAddress } from "@/utils/adminUtils";
import useAdminChecker from "@/hooks/useAdminChecker";
import AdminProtected from "./AdminProtected";

/**
 * Demo component showing how to use the admin access functionality
 */
const AdminFunctionalityDemo = ({ className = "" }) => {
  const { publicKey, connected } = useWalletContext();
  const isAdmin = useAdminChecker();
  const [adminSectionExpanded, setAdminSectionExpanded] = useState(false);

  // Demo admin function - available only to admins
  const handleSpecialAdminFunction = () => {
    alert("Admin function executed!");
    console.log("Admin special function was executed");
  };

  const walletAddress = publicKey?.toString() || "";

  // Simple styles for the demo component
  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "rgba(50, 50, 50, 0.8)",
      borderRadius: "8px",
      border: "1px solid rgba(212, 175, 55, 0.3)",
      margin: "20px 0",
    },
    heading: {
      color: "#d4af37",
      marginTop: 0,
    },
    statusBadge: {
      display: "inline-block",
      padding: "3px 8px",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "bold",
      marginLeft: "10px",
    },
    adminBadge: {
      backgroundColor: "#4caf50",
      color: "white",
    },
    notAdminBadge: {
      backgroundColor: "#f44336",
      color: "white",
    },
    section: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "rgba(60, 60, 60, 0.8)",
      borderRadius: "8px",
      border: "1px solid rgba(212, 175, 55, 0.3)",
    },
    button: {
      backgroundColor: "rgba(212, 175, 55, 0.7)",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "10px",
      marginTop: "10px",
    },
    infoRow: {
      margin: "10px 0",
    },
    label: {
      fontWeight: "bold",
      color: "#d4af37",
      marginRight: "10px",
    },
    value: {
      color: "white",
    },
    expandButton: {
      backgroundColor: "transparent",
      border: "1px solid rgba(212, 175, 55, 0.5)",
      borderRadius: "4px",
      padding: "8px 15px",
      color: "#d4af37",
      cursor: "pointer",
      marginTop: "10px",
      display: "block",
      width: "100%",
    },
  };

  return (
    <div className={className} style={styles.container}>
      <h2 style={styles.heading}>
        Admin Functionality Demo
        {connected && (
          <span
            style={{
              ...styles.statusBadge,
              ...(isAdmin ? styles.adminBadge : styles.notAdminBadge),
            }}
          >
            {isAdmin ? "ADMIN" : "NOT ADMIN"}
          </span>
        )}
      </h2>

      {!connected ? (
        <p>Please connect your wallet to test admin functionality.</p>
      ) : (
        <>
          <div style={styles.infoRow}>
            <span style={styles.label}>Wallet Address:</span>
            <span style={styles.value}>{walletAddress}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Admin Status:</span>
            <span style={styles.value}>
              {isAdminAddress(walletAddress)
                ? "Admin wallet detected"
                : "Not an admin wallet"}
            </span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Access Level:</span>
            <span style={styles.value}>
              You {isAdmin ? "have" : "do not have"} admin privileges
            </span>
          </div>

          <button
            style={styles.expandButton}
            onClick={() => setAdminSectionExpanded(!adminSectionExpanded)}
          >
            {adminSectionExpanded ? "Hide" : "Show"} Admin-Protected Content
          </button>

          {adminSectionExpanded && (
            <>
              {/* Method 1: Direct conditional rendering with hook */}
              <div style={styles.section}>
                <h3>Method 1: useAdminChecker Hook</h3>
                <p>
                  This content is conditionally rendered using the
                  useAdminChecker hook.
                </p>

                {isAdmin ? (
                  <div>
                    <p>This paragraph is only visible to admins.</p>
                    <button
                      style={styles.button}
                      onClick={handleSpecialAdminFunction}
                    >
                      Admin Only Button
                    </button>
                  </div>
                ) : (
                  <p>You need admin privileges to see the special content.</p>
                )}
              </div>

              {/* Method 2: Using the AdminProtected component */}
              <div style={styles.section}>
                <h3>Method 2: AdminProtected Component</h3>
                <p>
                  This content uses the AdminProtected component for access
                  control.
                </p>

                <AdminProtected
                  fallback={
                    <div>
                      <p>This is the fallback content for non-admins.</p>
                      <p>Contact an administrator if you need access.</p>
                    </div>
                  }
                >
                  <div>
                    <p>Congratulations! You can see this admin-only content.</p>
                    <button
                      style={styles.button}
                      onClick={handleSpecialAdminFunction}
                    >
                      Execute Admin Function
                    </button>
                  </div>
                </AdminProtected>
              </div>

              {/* Method 3: Direct use of isAdminAddress utility */}
              <div style={styles.section}>
                <h3>Method 3: isAdminAddress Utility</h3>
                <p>
                  This content uses the isAdminAddress utility function
                  directly.
                </p>

                {isAdminAddress(walletAddress) ? (
                  <div>
                    <p>
                      This content is only visible to wallets in the admin list.
                    </p>
                    <code>
                      ADMIN_ADDRESSES =
                      [&apos;72j257cEWGEaD3379m8w59bceMJDsqe3dCuaivXPF7RL&apos;,
                      &apos;2TdY2FnnpBgXYGdNbDkzTk9tLZEq1uHrvZY4fFXQ9Aut&apos;]
                    </code>
                  </div>
                ) : (
                  <p>Your wallet is not in the admin allowlist.</p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

AdminFunctionalityDemo.propTypes = {
  className: PropTypes.string,
};

export default AdminFunctionalityDemo;
