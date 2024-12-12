import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { WalletProviderWrapper } from "@/contexts/WalletContextProvider.jsx";
import { UserProfileContextProvider } from "@/contexts/UserProfileContextProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WalletProviderWrapper>
      <UserProfileContextProvider>
        <App />
      </UserProfileContextProvider>
    </WalletProviderWrapper>
  </StrictMode>
);
