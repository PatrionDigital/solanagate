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
    <div className="w-full min-w-full">
      <BackgroundEffect />
      <main className="w-full min-w-full relative z-10">
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;
