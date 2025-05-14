import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//Layouts
import MainLayout from "@/components/layouts/MainLayout";
import AboutLayout from "@/components/layouts/AboutLayout";
import GameLayout from "@/components/layouts/GameLayout";
import VermigotchiContainer from "@/games/tamagotchi/components/VermigotchiContainer";
import { VermigotchiProvider } from "@/games/tamagotchi/context/VermigotchiContext";
import BackgroundEffect from "@/components/BackgroundEffect";

// Import HoneycombAdminPage directly from the modules file
import { HoneycombAdminPage } from "@/pages/honeycomb-admin/HoneycombModules";
import "@/pages/honeycomb-admin/honeycombAdmin.css";
import "@/pages/honeycomb-admin/adminAuth.css";

//Styles
import "@/styles/App.css";
import "./theme-buttons.css";

function App() {
  return (
    <Router>
      <BackgroundEffect />
      <main style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/*" element={<MainLayout />} />
          <Route path="/about" element={<AboutLayout />} />
          <Route path="/games" element={<GameLayout />}>
            <Route index element={
              <VermigotchiProvider>
                <VermigotchiContainer />
              </VermigotchiProvider>
            } />
          </Route>
          <Route path="/admin" element={<HoneycombAdminPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
