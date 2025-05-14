import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import BackgroundEffect from "@/components/BackgroundEffect";

// Styles
import "@/styles/App.css";
import "./theme-buttons.css";
import "@/pages/honeycomb-admin/honeycombAdmin.css";
import "@/pages/honeycomb-admin/adminAuth.css";

function App() {
  return (
    <>
      <BackgroundEffect />
      <main style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
        <RouterProvider router={router} />
      </main>
    </>
  );
}

export default App;
