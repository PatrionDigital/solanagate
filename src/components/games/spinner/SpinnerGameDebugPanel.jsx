import { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button } from "@windmill/react-ui";

/**
 * Admin-only debug panel for Spinner Game
 * Allows adding spins and resetting spin history for the current character/pet
 */
const SpinnerGameDebugPanel = ({ character, onDebugAction }) => {
  const [message, setMessage] = useState("");

  const handleAddSpin = () => {
    if (onDebugAction) onDebugAction("addSpin");
    setMessage("+1 spin added!");
    setTimeout(() => setMessage(""), 1500);
  };

  const handleResetHistory = () => {
    if (onDebugAction) onDebugAction("resetHistory");
    setMessage("Spin history and spins reset!");
    setTimeout(() => setMessage(""), 1500);
  };

  return (
    <Card className="vermin-spinner-debug-panel">
      <h3 className="vermin-spinner-debug-title">Spinner Debug Panel</h3>
      <div className="vermin-spinner-debug-actions">
        <Button onClick={handleAddSpin} className="vermin-spinner-debug-btn">Add Spin</Button>
        <Button onClick={handleResetHistory} className="vermin-spinner-debug-btn vermin-spinner-debug-btn--danger">Reset History</Button>
      </div>
      {message && <div className="vermin-spinner-debug-message">{message}</div>}
    </Card>
  );
};

SpinnerGameDebugPanel.propTypes = {
  character: PropTypes.object,
  onDebugAction: PropTypes.func.isRequired,
};

export default SpinnerGameDebugPanel;
