import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useProject } from "@/hooks/useProject";
import "@/styles/ProjectSelector.css";

/**
 * ProjectSelector component allows users to select from available active projects
 */
const ProjectSelector = ({
  onSelectProject,
  showAllOption = true,
  selectedProject = "all",
  label = "Select Project:",
  className = "",
  adminMode = false, // If true, shows all projects, not just active ones
}) => {
  const { state, getActiveProjects } = useProject();
  const [localSelectedProject, setLocalSelectedProject] =
    useState(selectedProject);
  const [availableProjects, setAvailableProjects] = useState([]);

  useEffect(() => {
    // Get available projects based on adminMode
    const projects = adminMode ? state.projects : getActiveProjects();

    // Set available projects
    setAvailableProjects(projects);
  }, [state.projects, adminMode, getActiveProjects]);

  useEffect(() => {
    // Update local state when prop changes
    setLocalSelectedProject(selectedProject);
  }, [selectedProject]);

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    setLocalSelectedProject(newValue);

    // Find the selected project object
    const selectedProjectObject =
      newValue === "all"
        ? "all"
        : availableProjects.find((p) => p.address === newValue) || null;

    // Call the callback with the selected project
    if (onSelectProject) {
      onSelectProject(selectedProjectObject);
    }
  };

  // If there are no projects and no "all" option, show message
  if (availableProjects.length === 0 && !showAllOption) {
    return (
      <div className={`project-selector ${className} project-selector--empty`}>
        <p>No {adminMode ? "" : "active "}projects available</p>
      </div>
    );
  }

  return (
    <div className={`project-selector ${className}`}>
      <label htmlFor="project-select" className="project-selector__label">
        {label}
      </label>
      <select
        id="project-select"
        value={localSelectedProject}
        onChange={handleSelectChange}
        className="project-selector__select"
      >
        {showAllOption && <option value="all">All Projects</option>}

        {availableProjects.map((project) => (
          <option key={project.address} value={project.address}>
            {project.name}
          </option>
        ))}
      </select>

      {/* If no active projects but admin mode is on, show guidance */}
      {adminMode &&
        availableProjects.length > 0 &&
        getActiveProjects().length === 0 && (
          <div className="project-selector__info">
            No active projects. Set a project to active in Admin settings.
          </div>
        )}
    </div>
  );
};

ProjectSelector.propTypes = {
  onSelectProject: PropTypes.func,
  showAllOption: PropTypes.bool,
  selectedProject: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  adminMode: PropTypes.bool,
};

export default ProjectSelector;
