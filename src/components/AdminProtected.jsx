import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWalletContext } from "@/contexts/WalletContext";
import { isAdminAddress } from "@/utils/adminUtils";
import LoadingSpinner from "@/components/LoadingSpinner";

/**
 * Component that protects content, allowing only admin users to access
 * @param {Object} props Component props
 * @param {ReactNode} props.children Content to render if admin access granted
 * @param {ReactNode} props.fallback Content to render if admin access denied
 * @returns {ReactNode} Protected component
 */
const AdminProtected = ({
  children,
  fallback,
  loadingMessage = "Checking permissions...",
}) => {
  const { publicKey, connected } = useWalletContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsChecking(true);

    if (connected && publicKey) {
      const address = publicKey.toString();
      setIsAdmin(isAdminAddress(address));
    } else {
      setIsAdmin(false);
    }

    setIsChecking(false);
  }, [connected, publicKey]);

  // Show loading state while checking
  if (isChecking) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  // If admin access, show the children
  if (isAdmin) {
    return children;
  }

  // Otherwise show the fallback content
  return (
    fallback || (
      <div className="admin-protected-fallback">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this content.</p>
      </div>
    )
  );
};

AdminProtected.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  loadingMessage: PropTypes.string,
};

export default AdminProtected;
