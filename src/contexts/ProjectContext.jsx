import { createContext } from "react";

// Create the context
const ProjectContext = createContext();

// Action types
export const PROJECT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_PROJECTS: "SET_PROJECTS",
  ADD_PROJECT: "ADD_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  SET_CURRENT_PROJECT: "SET_CURRENT_PROJECT",
  SET_CHARACTERS: "SET_CHARACTERS",
  ADD_CHARACTER: "ADD_CHARACTER",
  UPDATE_CHARACTER: "UPDATE_CHARACTER",
  DELETE_CHARACTER: "DELETE_CHARACTER",
  SYNC_WITH_BLOCKCHAIN: "SYNC_WITH_BLOCKCHAIN",
  UPDATE_UI_SETTINGS: "UPDATE_UI_SETTINGS",
  IMPORT_DATA: "IMPORT_DATA",
  SET_PROJECT_ACTIVE: "SET_PROJECT_ACTIVE",
};

// Initial state that can be imported by the provider
export const initialState = {
  projects: [],
  currentProject: null,
  characters: [],
  loading: false,
  error: null,
  lastSynced: null,
  dataVersion: 1, // For schema versioning
  uiSettings: {
    lastViewedTab: null,
    expandedProjects: [],
    characterListView: "grid", // 'grid' or 'list'
  },
};

export default ProjectContext;
