import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
//Hooks
import useTokenAccountsFetcher from "@/hooks/useTokenAccountsFetcher";

//Layouts
import MainLayout from "@/components/layouts/MainLayout";
import AboutLayout from "@/components/layouts/AboutLayout";

//Styles
import "@/styles/App.css";

function App() {
  // Call Fetch Token Accounts Hook
  useTokenAccountsFetcher();
  return (
    <Router>
      <main style={{ padding: "0 20px" }}>
        <Routes>
          <Route path="/*" element={<MainLayout />} />
          <Route path="/about" element={<AboutLayout />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
