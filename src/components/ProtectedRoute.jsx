import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useWalletContext } from "../contexts/WalletContext";

/**
 * Protects a route by requiring wallet connection.
 * If not connected, redirects to /login (LandingPage) and saves intended location.
 */
const ProtectedRoute = ({ children }) => {
  const { connected } = useWalletContext();
  const location = useLocation();

  console.log('[ProtectedRoute] Rendering, connected:', connected, 'path:', location.pathname);

  // If not connected and not on the login page, redirect to login
  if (!connected && location.pathname !== '/login') {
    console.log('[ProtectedRoute] Not connected, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If already on login page and connected, redirect to home
  if (connected && location.pathname === '/login') {
    console.log('[ProtectedRoute] Already connected, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedRoute] User is connected, rendering children');
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
