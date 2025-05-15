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

// Games
import { VermigotchiProvider } from "@/games/tamagotchi/context/VermigotchiContext";
import VermigotchiContainer from "@/games/tamagotchi/components/VermigotchiContainer";
import GameDashboard from "@/components/games/GameDashboard";
import SpinnerGame from "@/components/games/spinner/SpinnerGame";

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
            path: "vermigotchi",
            element: (
              <VermigotchiProvider>
                <VermigotchiContainer />
              </VermigotchiProvider>
            ),
          },
          {
            path: "spinner",
            element: <SpinnerGame />
          },
        ],
      },
      
      // Admin section
      {
        path: "/admin",
        element: <HoneycombAdminPage />,
      },
      {
        path: "/honeycomb-admin",
        element: <HoneycombAdminPage />,
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
