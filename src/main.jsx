import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { WalletProviderWrapper } from "./contexts/WalletConnect.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WalletProviderWrapper>
      <App />
    </WalletProviderWrapper>
  </StrictMode>
);
