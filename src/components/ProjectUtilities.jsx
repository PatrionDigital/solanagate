import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useProject } from "@/hooks/useProject";

/**
 * Project Utilities component - provides backup, restore, and other utilities
 */
const ProjectUtilities = ({ className }) => {
  const { state, exportData, importData } = useProject();
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);

  const handleExport = () => {
    const success = exportData();
    if (success) {
      setImportStatus({
        type: "success",
        message: "Data exported successfully! Check your downloads folder.",
      });
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const result = importData(event.target.result);
        if (result) {
          setImportStatus({
            type: "success",
            message: "Data imported successfully!",
          });
        } else {
          setImportStatus({
            type: "error",
            message: "Failed to import data. Check console for details.",
          });
        }

        // Reset file input
        e.target.value = null;
        setTimeout(() => setImportStatus(null), 3000);
      } catch (error) {
        console.error("Error parsing import file:", error);
        setImportStatus({
          type: "error",
          message: `Error: ${error.message}`,
        });
        setTimeout(() => setImportStatus(null), 5000);
      }
    };

    reader.onerror = () => {
      setImportStatus({
        type: "error",
        message: "Error reading file",
      });
      setTimeout(() => setImportStatus(null), 3000);
    };

    reader.readAsText(file);
  };

  return (
    <div className={`project-utilities ${className || ""}`}>
      <div className="utilities-header">
        <h3>Project Utilities</h3>
      </div>

      <div className="utilities-content">
        <div className="utility-info">
          <p>
            Projects: <strong>{state.projects.length}</strong> | Characters:{" "}
            <strong>{state.characters.length}</strong> | Last Saved:{" "}
            <strong>
              {state.lastSynced
                ? new Date(state.lastSynced).toLocaleString()
                : "Never"}
            </strong>
          </p>
        </div>

        <div className="utility-actions">
          <button className="btn-export" onClick={handleExport}>
            Export Data
          </button>

          <button className="btn-import" onClick={handleImportClick}>
            Import Data
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {importStatus && (
          <div className={`import-status ${importStatus.type}`}>
            {importStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

ProjectUtilities.propTypes = {
  className: PropTypes.string,
};

export default ProjectUtilities;
