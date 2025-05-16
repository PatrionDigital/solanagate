import { useContext } from "react";
import ProjectContext from "@/contexts/ProjectContext";

/**
 * Custom hook to access the ProjectContext
 * @returns {Object} The project context value
 */
export const useProject = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within a ProjectContextProvider");
  }

  return context;
};

export default useProject;
