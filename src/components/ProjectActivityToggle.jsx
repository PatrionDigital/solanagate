import { useState } from "react";
import PropTypes from "prop-types";
import { useProject } from "@/hooks/useProject";

/**
 * Component for toggling a project's active state in admin view
 */
const ProjectActivityToggle = ({
  project,
  className = "",
  onChange = () => {},
}) => {
  const { setProjectActive } = useProject();
  const [isActive, setIsActive] = useState(project.isActive);
  const [isToggling, setIsToggling] = useState(false);

  // Handle toggle change
  const handleToggle = async () => {
    setIsToggling(true);

    try {
      // Update the project in context
      await setProjectActive(project.address, !isActive);

      // Update local state
      setIsActive(!isActive);

      // Call onChange callback
      onChange(project.address, !isActive);
    } catch (error) {
      console.error("Error toggling project activity:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className={`project-activity-toggle ${className}`}>
      <div className="project-activity-toggle__label">Active Status:</div>

      <div className="project-activity-toggle__controls">
        <label className="project-activity-toggle__switch">
          <input
            type="checkbox"
            checked={isActive}
            onChange={handleToggle}
            disabled={isToggling}
            className="project-activity-toggle__input"
          />
          <span className="project-activity-toggle__slider"></span>
        </label>

        <span
          className={`project-activity-toggle__status ${
            isActive
              ? "project-activity-toggle__status--active"
              : "project-activity-toggle__status--inactive"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="project-activity-toggle__description">
        {isActive ? (
          <p>This project is visible to users and can be interacted with.</p>
        ) : (
          <p>This project is hidden from users until activated.</p>
        )}
      </div>
    </div>
  );
};

ProjectActivityToggle.propTypes = {
  project: PropTypes.shape({
    address: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
  }).isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default ProjectActivityToggle;
