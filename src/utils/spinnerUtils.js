// src/utils/spinnerUtils.js
/**
 * Utility functions for the spinner game
 */

// Define the prize segments
export const PRIZE_SEGMENTS = [
  { value: 0, label: "0 VERMIN", color: "#FF6384" },
  { value: 0.1, label: "0.1 VERMIN", color: "#36A2EB" },
  { value: 0.5, label: "0.5 VERMIN", color: "#FFCE56" },
  { value: 1, label: "1 VERMIN", color: "#4BC0C0" },
  { value: 3, label: "3 VERMIN", color: "#9966FF" },
  { value: 5, label: "5 VERMIN", color: "#FF9F40" },
  { value: 10, label: "10 VERMIN", color: "#8AC926" },
  { value: 15, label: "15 VERMIN", color: "#FF6384" },
];

// Evolution levels and their corresponding bonuses
export const EVOLUTION_BONUSES = {
  EGG: 1.0,      // No bonus
  BABY: 1.1,     // 10% bonus
  CHILD: 1.2,    // 20% bonus
  TEEN: 1.3,     // 30% bonus 
  ADULT: 1.5,    // 50% bonus
};

/**
 * Calculate the final prize based on the base prize value and evolution level
 * @param {number} prizeValue - Base prize value
 * @param {string} evolutionLevel - Current evolution level of the Vermigotchi
 * @returns {number} Final prize value with bonus applied
 */
export const calculatePrizeWithBonus = (prizeValue, evolutionLevel = "EGG") => {
  const bonus = EVOLUTION_BONUSES[evolutionLevel] || 1.0;
  return prizeValue * bonus;
};

/**
 * Check if a user is eligible for a free daily spin
 * @param {Date|string} lastSpinTime - Timestamp of the last spin
 * @returns {boolean} Whether the user is eligible for a free spin
 */
export const isEligibleForFreeSpin = (lastSpinTime) => {
  if (!lastSpinTime) return true;
  
  const lastSpin = new Date(lastSpinTime);
  const now = new Date();
  
  // Check if last spin was yesterday or earlier (different calendar day)
  return (
    lastSpin.getFullYear() < now.getFullYear() ||
    lastSpin.getMonth() < now.getMonth() ||
    lastSpin.getDate() < now.getDate()
  );
};

/**
 * Determine if player gets bonus spins based on Vermigotchi happiness
 * @param {number} happiness - Happiness level (0-100)
 * @returns {number} Number of bonus spins (0 if not eligible)
 */
export const getBonusSpins = (happiness) => {
  if (happiness >= 90) return 2;
  if (happiness >= 75) return 1;
  return 0;
};

/**
 * Get a random segment index for the wheel
 * @returns {number} Random index for prize selection
 */
export const getRandomPrizeIndex = () => {
  return Math.floor(Math.random() * PRIZE_SEGMENTS.length);
};

/**
 * Format a prize value for display
 * @param {number} value - Value to format
 * @returns {string} Formatted value string
 */
export const formatPrizeValue = (value) => {
  return parseFloat(value).toFixed(1);
};
