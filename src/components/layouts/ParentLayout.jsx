import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import useTokenAccountsFetcher from "@/hooks/useTokenAccountsFetcher";
import useHodlTimeFetcher from "@/hooks/useHodlTimeFetcher";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

const ParentLayout = () => {
  const { connected, isTokenHolder } = useWalletContext();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Run the fetchers to check tokens and hodl time
  useTokenAccountsFetcher();
  useHodlTimeFetcher();

  // Set a small delay to ensure all context is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking auth state
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }


  // If not connected, redirect to login
  if (!connected) {
    // Don't redirect if already on login page to prevent infinite loop
    if (location.pathname !== '/login') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <Outlet />;
  }


  // If connected but still loading token status
  if (isTokenHolder === null) {
    return <LoadingSpinner message="Verifying token status..." />;
  }


  // Render the child routes
  return <Outlet />;
};

export default ParentLayout;
