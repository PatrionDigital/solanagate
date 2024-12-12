import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// Contexts
import TokenAccountsFetcher from "./utils/TokenAccountsFetcher";
import MainLayout from "@/components/layouts/MainLayout";

import "./App.css";

function App() {
  return (
    <Router>
      <TokenAccountsFetcher />
      <main style={{ padding: "0 20px" }}>
        <Routes>
          <Route path="/*" element={<MainLayout />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
