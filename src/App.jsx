import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
//Hooks
//import useTokenAccountsFetcher from "@/hooks/useTokenAccountsFetcher";

//Layouts
import MainLayout from "@/components/layouts/MainLayout";
import AboutLayout from "@/components/layouts/AboutLayout";
import BackgroundEffect from "@/components/BackgroundEffect";

//Styles
import "@/styles/App.css";

function App() {
  return (
    <Router>
      <BackgroundEffect />
      <main style={{ padding: "0 20px", position: "relative", zIndex: 1 }}>
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
