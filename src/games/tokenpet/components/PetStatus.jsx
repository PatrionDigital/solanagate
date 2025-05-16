import PropTypes from "prop-types";
import NumberFlow from "@number-flow/react";

// Helper to determine status bar color
const getStatusColor = (value, type) => {
  // For hunger, higher is worse
  if (type === "hunger") {
    if (value > 80) return "bg-red-500";
    if (value > 60) return "bg-yellow-500";
    if (value > 40) return "bg-green-500";
    return "bg-blue-500";
  }
  // For other stats, higher is better
  if (value < 20) return "bg-red-500";
  if (value < 40) return "bg-yellow-500";
  if (value < 60) return "bg-yellow-300";
  if (value < 80) return "bg-green-500";
  return "bg-blue-500";
};


const PetStatus = ({ hunger, happiness, energy, health }) => {
  // Directly display the latest values from props
  return (
    <div className="pet-status-container w-full max-w-sm mx-auto">
      {/* Hunger status */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-white">Hunger</span>
          <span className="text-sm text-white w-20 text-right font-mono inline-block align-middle select-none"><NumberFlow value={parseFloat(hunger.toFixed(2))} decimals={2} />%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getStatusColor(hunger, "hunger")}`}
            style={{ width: `${hunger}%`, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          ></div>
        </div>
      </div>
      {/* Happiness status */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-white">Happiness</span>
          <span className="text-sm text-white w-20 text-right font-mono inline-block align-middle select-none"><NumberFlow value={parseFloat(happiness.toFixed(2))} decimals={2} />%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getStatusColor(happiness, "happiness")}`}
            style={{ width: `${happiness}%`, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          ></div>
        </div>
      </div>
      {/* Energy status */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-white">Energy</span>
          <span className="text-sm text-white w-20 text-right font-mono inline-block align-middle select-none"><NumberFlow value={parseFloat(energy.toFixed(2))} decimals={2} />%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getStatusColor(energy, "energy")}`}
            style={{ width: `${energy}%`, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          ></div>
        </div>
      </div>
      {/* TokenPet status */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-white">Health</span>
          <span className="text-sm text-white w-20 text-right font-mono inline-block align-middle select-none"><NumberFlow value={parseFloat(health.toFixed(2))} decimals={2} />%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getStatusColor(health, "health")}`}
            style={{ width: `${health}%`, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

PetStatus.propTypes = {
  hunger: PropTypes.number.isRequired,
  happiness: PropTypes.number.isRequired,
  energy: PropTypes.number.isRequired,
  health: PropTypes.number.isRequired,
};

export default PetStatus;
