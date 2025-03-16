import { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import ProjectContext, {
  PROJECT_ACTIONS,
  initialState,
} from "./ProjectContext";

// Reducer function
const projectReducer = (state, action) => {
  switch (action.type) {
    case PROJECT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case PROJECT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case PROJECT_ACTIONS.SET_PROJECTS:
      return { ...state, projects: action.payload, loading: false };

    case PROJECT_ACTIONS.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload],
        currentProject: action.payload, // Optionally set new project as current
      };

    case PROJECT_ACTIONS.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.address === action.payload.address ? action.payload : project
        ),
        currentProject:
          state.currentProject?.address === action.payload.address
            ? action.payload
            : state.currentProject,
      };

    case PROJECT_ACTIONS.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project.address !== action.payload
        ),
        currentProject:
          state.currentProject?.address === action.payload
            ? null
            : state.currentProject,
      };

    case PROJECT_ACTIONS.SET_CURRENT_PROJECT:
      return { ...state, currentProject: action.payload };

    case PROJECT_ACTIONS.SET_CHARACTERS:
      return { ...state, characters: action.payload };

    case PROJECT_ACTIONS.ADD_CHARACTER:
      return { ...state, characters: [...state.characters, action.payload] };

    case PROJECT_ACTIONS.UPDATE_CHARACTER:
      return {
        ...state,
        characters: state.characters.map((character) =>
          character.id === action.payload.id ? action.payload : character
        ),
      };

    case PROJECT_ACTIONS.DELETE_CHARACTER:
      return {
        ...state,
        characters: state.characters.filter(
          (character) => character.id !== action.payload
        ),
      };

    case PROJECT_ACTIONS.SYNC_WITH_BLOCKCHAIN:
      return {
        ...state,
        lastSynced: new Date().toISOString(),
        loading: false,
      };

    case PROJECT_ACTIONS.UPDATE_UI_SETTINGS:
      return {
        ...state,
        uiSettings: {
          ...state.uiSettings,
          ...action.payload,
        },
      };

    case PROJECT_ACTIONS.IMPORT_DATA:
      return {
        ...state,
        ...action.payload,
        dataVersion: state.dataVersion, // Keep current version
        error: null,
        loading: false,
      };

    // New action handler for setting a project as active or inactive
    case PROJECT_ACTIONS.SET_PROJECT_ACTIVE:
      console.log("Setting project active state:", action.payload);
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.address === action.payload.projectAddress
            ? { ...project, isActive: action.payload.isActive }
            : project
        ),
      };

    default:
      return state;
  }
};

// Provider component
const ProjectContextProvider = ({ children, initialProjects = [] }) => {
  const [state, dispatch] = useReducer(projectReducer, {
    ...initialState,
    projects: initialProjects.map((project) => ({
      ...project,
      isActive: project.isActive !== undefined ? project.isActive : false, // Add isActive flag to initial projects
    })),
    currentProject: initialProjects.length > 0 ? initialProjects[0] : null,
  });

  // Helper functions for project management
  const createProject = (projectData) => {
    // Set default isActive to false for new projects
    const projectWithActive = {
      ...projectData,
      isActive:
        projectData.isActive !== undefined ? projectData.isActive : false,
    };
    dispatch({ type: PROJECT_ACTIONS.ADD_PROJECT, payload: projectWithActive });
    return projectWithActive;
  };

  const updateProject = (projectData) => {
    dispatch({ type: PROJECT_ACTIONS.UPDATE_PROJECT, payload: projectData });
    return projectData;
  };

  const deleteProject = (projectAddress) => {
    dispatch({ type: PROJECT_ACTIONS.DELETE_PROJECT, payload: projectAddress });
  };

  const setCurrentProject = (project) => {
    dispatch({ type: PROJECT_ACTIONS.SET_CURRENT_PROJECT, payload: project });
  };

  // Helper functions for character management
  const createCharacter = (characterData) => {
    dispatch({ type: PROJECT_ACTIONS.ADD_CHARACTER, payload: characterData });
    return characterData;
  };

  const updateCharacter = (characterData) => {
    dispatch({
      type: PROJECT_ACTIONS.UPDATE_CHARACTER,
      payload: characterData,
    });
    return characterData;
  };

  const deleteCharacter = (characterId) => {
    dispatch({ type: PROJECT_ACTIONS.DELETE_CHARACTER, payload: characterId });
  };

  const getProjectCharacters = (projectAddress) => {
    return state.characters.filter(
      (char) => char.projectAddress === projectAddress
    );
  };

  const syncWithBlockchain = async () => {
    dispatch({ type: PROJECT_ACTIONS.SET_LOADING, payload: true });

    try {
      // In a real implementation, you would fetch data from the blockchain here
      // For now, we'll just simulate a successful sync
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch({ type: PROJECT_ACTIONS.SYNC_WITH_BLOCKCHAIN });
    } catch (error) {
      dispatch({
        type: PROJECT_ACTIONS.SET_ERROR,
        payload: error.message || "Failed to sync with blockchain",
      });
    }
  };

  // New function to toggle a project's active state
  const setProjectActive = (projectAddress, isActive) => {
    console.log(
      `Setting project ${projectAddress} active to state to ${isActive}`
    );
    dispatch({
      type: PROJECT_ACTIONS.SET_PROJECT_ACTIVE,
      payload: { projectAddress, isActive },
    });

    // Return a resolved promise to make it async-compatible
    return Promise.resolve();
  };

  // Get all active projects
  const getActiveProjects = () => {
    return state.projects.filter((project) => project.isActive);
  };

  // Helper functions for data management
  const exportData = () => {
    try {
      const exportData = {
        projects: state.projects,
        characters: state.characters,
        dataVersion: state.dataVersion,
        exportDate: new Date().toISOString(),
      };

      // Ensure projects have all required fields including authority
      exportData.projects = exportData.projects.map((project) => {
        // Make sure authority is included and valid
        if (!project.authority && state.currentWalletAddress) {
          return {
            ...project,
            authority: state.DatecurrentWalletAddress,
          };
        }
        return project;
      });
      const dataStr = JSON.stringify(exportData);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
        dataStr
      )}`;

      // Create a download link and trigger it
      const exportFileDefaultName = `honeycomb-data-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      return true;
    } catch (error) {
      console.error("Error exporting data:", error);
      dispatch({
        type: PROJECT_ACTIONS.SET_ERROR,
        payload: "Failed to export data: " + error.message,
      });
      return false;
    }
  };

  const importData = (jsonData) => {
    try {
      dispatch({ type: PROJECT_ACTIONS.SET_LOADING, payload: true });

      const parsedData =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      // Validate the data has the expected structure
      if (!parsedData.projects || !Array.isArray(parsedData.projects)) {
        throw new Error("Invalid data format: missing projects array");
      }

      if (!parsedData.characters || !Array.isArray(parsedData.characters)) {
        throw new Error("Invalid data format: missing characters array");
      }

      // Ensure all projects have isActive property
      const projectsWithActive = parsedData.projects.map((project) => ({
        ...project,
        isActive: project.isActive !== undefined ? project.isActive : false,
      }));

      // Prepare the data for import
      const importPayload = {
        projects: projectsWithActive,
        characters: parsedData.characters,
        currentProject:
          projectsWithActive.length > 0 ? projectsWithActive[0] : null,
      };

      // Import the data
      dispatch({ type: PROJECT_ACTIONS.IMPORT_DATA, payload: importPayload });

      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      dispatch({
        type: PROJECT_ACTIONS.SET_ERROR,
        payload: "Failed to import data: " + error.message,
      });
      dispatch({ type: PROJECT_ACTIONS.SET_LOADING, payload: false });
      return false;
    }
  };

  // Function to update UI settings
  const updateUISettings = (settings) => {
    dispatch({ type: PROJECT_ACTIONS.UPDATE_UI_SETTINGS, payload: settings });
  };

  // Load projects from localStorage on mount
  useEffect(() => {
    try {
      // Load and check version
      const storedVersion = localStorage.getItem("honeycomb_data_version");
      const currentVersion = initialState.dataVersion;

      // First check for the main data
      const storedData = localStorage.getItem("honeycomb_data");
      if (storedData) {
        // We have data in the newer format
        const parsedData = JSON.parse(storedData);

        // Simple migration logic - can be expanded as needed
        if (storedVersion && parseInt(storedVersion) < currentVersion) {
          console.log(
            `Migrating data from version ${storedVersion} to ${currentVersion}`
          );
          // Perform any needed migrations
        }
        // Validate project addresses
        const validatedProjects = (parsedData.projects || []).map((project) => {
          if (!project.address) {
            const projectName =
              project.name?.toLowerCase().replace(/[^a-z0-9]/g, "-") ||
              "unnamed";
            const timestamp = Date.now().toString(36);
            return {
              ...project,
              address: `project-${projectName}-${timestamp}`,
              isActive:
                project.isActive !== undefined ? project.isActive : false,
            };
          }
          return {
            ...project,
            isActive: project.isActive !== undefined ? project.isActive : false,
          };
        });

        // Set the projects and characters
        dispatch({
          type: PROJECT_ACTIONS.SET_PROJECTS,
          payload: validatedProjects || [],
        });
        dispatch({
          type: PROJECT_ACTIONS.SET_CHARACTERS,
          payload: parsedData.characters || [],
        });

        // Set UI settings if available
        if (parsedData.uiSettings) {
          dispatch({
            type: PROJECT_ACTIONS.UPDATE_UI_SETTINGS,
            payload: parsedData.uiSettings,
          });
        }

        // Set current project if available
        if (parsedData.currentProjectAddress) {
          const currentProject = parsedData.projects?.find(
            (p) => p.address === parsedData.currentProjectAddress
          );
          if (currentProject) {
            dispatch({
              type: PROJECT_ACTIONS.SET_CURRENT_PROJECT,
              payload: currentProject,
            });
          }
        } else if (parsedData.projects?.length > 0 && !state.currentProject) {
          dispatch({
            type: PROJECT_ACTIONS.SET_CURRENT_PROJECT,
            payload: parsedData.projects[0],
          });
        }
      } else {
        // Check for legacy data
        const storedProjects = localStorage.getItem("honeycomb_projects");
        const storedCharacters = localStorage.getItem("honeycomb_characters");
        const storedCurrentProject = localStorage.getItem(
          "honeycomb_current_project"
        );

        if (storedProjects) {
          let projects = JSON.parse(storedProjects);
          // Validate project addresses
          projects = projects.map((project) => {
            if (!project.address) {
              const projectName =
                project.name?.toLowerCase().replace(/[^a-z0-9]/g, "-") ||
                "unnamed";
              const timestamp = Date.now().toString(36);
              return {
                ...project,
                address: `project-${projectName}-${timestamp}`,
                isActive:
                  project.isActive !== undefined ? project.isActive : false,
              };
            }
            return {
              ...project,
              isActive:
                project.isActive !== undefined ? project.isActive : false,
            };
          });
          dispatch({ type: PROJECT_ACTIONS.SET_PROJECTS, payload: projects });

          // Set current project if available
          if (storedCurrentProject) {
            const currentProject = projects.find(
              (p) => p.address === storedCurrentProject
            );
            if (currentProject) {
              dispatch({
                type: PROJECT_ACTIONS.SET_CURRENT_PROJECT,
                payload: currentProject,
              });
            }
          } else if (projects.length > 0 && !state.currentProject) {
            dispatch({
              type: PROJECT_ACTIONS.SET_CURRENT_PROJECT,
              payload: projects[0],
            });
          }
        }

        if (storedCharacters) {
          dispatch({
            type: PROJECT_ACTIONS.SET_CHARACTERS,
            payload: JSON.parse(storedCharacters),
          });
        }
      }
    } catch (error) {
      console.error("Error loading project data from localStorage:", error);
      dispatch({
        type: PROJECT_ACTIONS.SET_ERROR,
        payload: "Failed to load saved data. Some information may be missing.",
      });
    }
  }, [state.currentProject]);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      // Make sure all projects have proper addresses before saving
      const projectsToSave = state.projects.map((project) => {
        // If a project somehow doesn't have an address, generate one
        if (!project.address) {
          const projectName =
            project.name?.toLowerCase().replace(/[^a-z0-9]/g, "-") || "unnamed";
          const timestamp = Date.now().toString(36);
          return {
            ...project,
            address: `project-${projectName}-${timestamp}`,
          };
        }
        return project;
      });
      // Store all data in a single object
      const dataToStore = {
        projects: projectsToSave,
        characters: state.characters,
        currentProjectAddress: state.currentProject?.address,
        uiSettings: state.uiSettings,
        lastSaved: new Date().toISOString(),
      };

      // Save the unified data
      localStorage.setItem("honeycomb_data", JSON.stringify(dataToStore));
      localStorage.setItem(
        "honeycomb_data_version",
        state.dataVersion.toString()
      );

      // Also save individually for backward compatibility
      localStorage.setItem(
        "honeycomb_projects",
        JSON.stringify(state.projects)
      );
      localStorage.setItem(
        "honeycomb_characters",
        JSON.stringify(state.characters)
      );

      if (state.currentProject) {
        localStorage.setItem(
          "honeycomb_current_project",
          state.currentProject.address
        );
      }
    } catch (error) {
      console.error("Error saving project data to localStorage:", error);
      dispatch({
        type: PROJECT_ACTIONS.SET_ERROR,
        payload:
          "Failed to save data. Your changes may not persist if you close the app.",
      });
    }
  }, [
    state.projects,
    state.characters,
    state.currentProject,
    state.uiSettings,
    state.dataVersion,
  ]);

  const contextValue = {
    state,
    dispatch,
    // Project operations
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    // Character operations
    createCharacter,
    updateCharacter,
    deleteCharacter,
    getProjectCharacters,
    // Project active state management
    setProjectActive,
    getActiveProjects,
    // Data management
    syncWithBlockchain,
    exportData,
    importData,
    updateUISettings,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

ProjectContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialProjects: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      // Other project properties
    })
  ),
};

export default ProjectContextProvider;
