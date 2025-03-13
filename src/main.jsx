import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import "./styles/Template.css";
import App from "./App.jsx";
import { WalletProviderWrapper } from "@/contexts/WalletContextProvider.jsx";
import { UserProfileContextProvider } from "@/contexts/UserProfileContextProvider";
import ProjectContextProvider from "@/contexts/ProjectContextProvider";

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <StrictMode>
    <WalletProviderWrapper>
      <UserProfileContextProvider>
        <ProjectContextProvider>
          <App />
        </ProjectContextProvider>
      </UserProfileContextProvider>
    </WalletProviderWrapper>
  </StrictMode>,
  document.getElementById("root")
);
