import PropTypes from "prop-types";
import NumberFlow from "@number-flow/react";

// === Stat Bar Animation Settings ===
// Adjust these values to control the update interval and smoothness for each stat
const STAT_UPDATE_PARAMS = {
  hunger: { INTERVAL_MS: 1500, LERP: 0.2 },
  happiness: { INTERVAL_MS: 1500, LERP: 0.2 },
  energy: { INTERVAL_MS: 1500, LERP: 0.2 },
  health: { INTERVAL_MS: 1500, LERP: 0.2 },
};
// ================================

import { useEffect, useState } from "react";

const PetStatus = ({ hunger, happiness, energy, health }) => {
  // Smooth updating values every 800ms
  const [displayed, setDisplayed] = useState({ hunger, happiness, energy, health });

  // Independent update for each stat
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayed(prev => ({
        ...prev,
        hunger: prev.hunger + (hunger - prev.hunger) * STAT_UPDATE_PARAMS.hunger.LERP,
      }));
    }, STAT_UPDATE_PARAMS.hunger.INTERVAL_MS);
    return () => clearInterval(interval);
  }, [hunger]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayed(prev => ({
        ...prev,
        happiness: prev.happiness + (happiness - prev.happiness) * STAT_UPDATE_PARAMS.happiness.LERP,
      }));
    }, STAT_UPDATE_PARAMS.happiness.INTERVAL_MS);
    return () => clearInterval(interval);
  }, [happiness]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayed(prev => ({
        ...prev,
        energy: prev.energy + (energy - prev.energy) * STAT_UPDATE_PARAMS.energy.LERP,
      }));
    }, STAT_UPDATE_PARAMS.energy.INTERVAL_MS);
    return () => clearInterval(interval);
  }, [energy]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayed(prev => ({
        ...prev,
        health: prev.health + (health - prev.health) * STAT_UPDATE_PARAMS.health.LERP,
      }));
    }, STAT_UPDATE_PARAMS.health.INTERVAL_MS);
    return () => clearInterval(interval);
  }, [health]);
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
  return (
    <div className="pet-status-container">
      {/* Hunger status */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-white">Hunger</span>
          <span className="text-sm text-white"><NumberFlow value={Math.floor(displayed.hunger * 100) / 100} decimals={2} />%</span>
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
          <span className="text-sm text-white"><NumberFlow value={Math.floor(displayed.happiness * 100) / 100} decimals={2} />%</span>
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
          <span className="text-sm text-white"><NumberFlow value={Math.floor(displayed.energy * 100) / 100} decimals={2} />%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getStatusColor(energy, "energy")}`}
            style={{ width: `${energy}%`, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          ></div>
        </div>
      </div>
      {/* Vermigotchi status */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-white">Health</span>
          <span className="text-sm text-white"><NumberFlow value={Math.floor(displayed.health * 100) / 100} decimals={2} />%</span>
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
