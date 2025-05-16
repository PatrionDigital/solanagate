import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import "./styles/Template.css";
import App from "./App.jsx";
import { Windmill } from '@windmill/react-ui';
import { WalletProviderWrapper } from "@/contexts/WalletContextProvider.jsx";
import { UserProfileContextProvider } from "@/contexts/UserProfileContextProvider";
import ProjectContextProvider from "@/contexts/ProjectContextProvider";
import { ProfileProvider } from "@/contexts/ProfileContext";
import HoneycombService from "@/services/honeycombService";

// Honeycomb configuration
const HONEYCOMB_API_URL = "https://edge.eboy.dev/";
const honeycombService = new HoneycombService(HONEYCOMB_API_URL);

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <StrictMode>
    <Windmill>
      <WalletProviderWrapper>
        <ProfileProvider client={honeycombService.client}>
          <UserProfileContextProvider>
            <ProjectContextProvider>
              <App />
            </ProjectContextProvider>
          </UserProfileContextProvider>
        </ProfileProvider>
      </WalletProviderWrapper>
    </Windmill>
  </StrictMode>,
  document.getElementById("root")
);
