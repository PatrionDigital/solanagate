import { createBrowserRouter } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layouts
import ParentLayout from "@/components/layouts/ParentLayout";
import MainLayout from "@/components/layouts/MainLayout";
import AboutLayout from "@/components/layouts/AboutLayout";
import GameLayout from "@/components/layouts/GameLayout";

// Pages
import LandingPage from "@/components/LandingPage";
import { HoneycombAdminPage } from "@/pages/honeycomb-admin/HoneycombModules";
import AdminLayout from "@/components/layouts/AdminLayout";

// Games
import TokenPetProvider from "@/games/tokenpet/context/TokenPetProvider";
import TokenPetContainer from "@/games/tokenpet/components/TokenPetContainer";
import GameDashboard from "@/games/GameDashboard";
import SpinnerGame from "@/games/spinner/SpinnerGame";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <LandingPage />,
  },
  
  // Protected routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ParentLayout />
      </ProtectedRoute>
    ),
    children: [
      // Root route - shows MainLayout with default content
      {
        index: true,
        element: <MainLayout />,
      },
      
      // About page - uses MainLayout
      {
        path: "/about",
        element: <AboutLayout />,
      },
      
      // Games section - uses GameLayout
      {
        path: "/games",
        element: <GameLayout />,
        children: [
          {
            index: true,
            // GameDashboard for /games
            element: <GameDashboard />
          },
          {
            path: "tokenpet",
            element: (
              <TokenPetProvider>
                <TokenPetContainer />
              </TokenPetProvider>
            ),
          },
          {
            path: "spinner",
            element: (
              <TokenPetProvider>
                <SpinnerGame />
              </TokenPetProvider>
            )
          },
        ],
      },
      
      // Admin section
      {
        path: "/admin",
        element: (
          <AdminLayout>
            <HoneycombAdminPage />
          </AdminLayout>
        ),
      },
      {
        path: "/honeycomb-admin",
        element: (
          <AdminLayout>
            <HoneycombAdminPage />
          </AdminLayout>
        ),
      },
      
      // Catch-all route - redirects to root
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
  
  // Fallback for unauthenticated users
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
