// src/utils/spinnerUtils.js
/**
 * Utility functions for the spinner game
 */

// Define the prize segments
export const PRIZE_SEGMENTS = [
  { value: 0, label: "Prize 1", color: "#FF6384" },
  { value: 0.1, label: "Prize 2", color: "#36A2EB" },
  { value: 0.5, label: "Prize 3", color: "#FFCE56" },
  { value: 1, label: "Prize 4", color: "#4BC0C0" },
  { value: 3, label: "Prize 5", color: "#9966FF" },
  { value: 5, label: "Prize 6", color: "#FF9F40" },
  { value: 10, label: "Prize 7", color: "#8AC926" },
  { value: 15, label: "Prize 8", color: "#FF6384" },
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
 * @param {string} evolutionLevel - Current evolution level of the TokenPet
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
 * Determine if player gets bonus spins based on TokenPet happiness
 * @param {number} happiness - Happiness level (0-100)
 * @returns {number} Number of bonus spins (0 if not eligible)
 */
export const getBonusSpins = (happiness) => {
  if (happiness >= 90) return 2;
  if (happiness >= 75) return 1;
  return 0;
};

/**
 * Get a random segment index for the wheel with weighted odds
 * @returns {number} Random index for prize selection
 * 
 * Prize Distribution:
 * - 15 VERMIN: 1.5% chance
 * - 10 VERMIN: 4% chance
 * - 5 VERMIN: 5% chance
 * - 0 VERMIN: 10% chance
 * - 0.1 & 0.5 VERMIN: 23.85% each (47.7% total)
 * - 1 & 3 VERMIN: 15.9% each (31.8% total)
 */
export const getRandomPrizeIndex = () => {
  const random = Math.random() * 100; // 0-100
  
  // Find the index of each prize in PRIZE_SEGMENTS
  const prizeIndices = {
    zero: PRIZE_SEGMENTS.findIndex(prize => prize.value === 0),
    pointOne: PRIZE_SEGMENTS.findIndex(prize => prize.value === 0.1),
    pointFive: PRIZE_SEGMENTS.findIndex(prize => prize.value === 0.5),
    one: PRIZE_SEGMENTS.findIndex(prize => prize.value === 1),
    three: PRIZE_SEGMENTS.findIndex(prize => prize.value === 3),
    five: PRIZE_SEGMENTS.findIndex(prize => prize.value === 5),
    ten: PRIZE_SEGMENTS.findIndex(prize => prize.value === 10),
    fifteen: PRIZE_SEGMENTS.findIndex(prize => prize.value === 15)
  };

  // Fixed percentage prizes (20.5% total)
  if (random < 1.5) return prizeIndices.fifteen;  // 0-1.5%: 15 VERMIN (1.5%)
  if (random < 5.5) return prizeIndices.ten;      // 1.5-5.5%: 10 VERMIN (4%)
  if (random < 10.5) return prizeIndices.five;    // 5.5-10.5%: 5 VERMIN (5%)
  if (random < 20.5) return prizeIndices.zero;    // 10.5-20.5%: 0 VERMIN (10%)
  
  // Remaining 79.5% distributed in two cohorts:
  // - 60% of 79.5% = 47.7% for 0.1 & 0.5 VERMIN (23.85% each)
  // - 40% of 79.5% = 31.8% for 1 & 3 VERMIN (15.9% each)
  const remainingRandom = Math.random() * 100; // 0-100% of remaining
  
  // First cohort: 0.1 and 0.5 VERMIN (47.7% total)
  if (remainingRandom < 50) {
    return Math.random() < 0.5 ? prizeIndices.pointOne : prizeIndices.pointFive;
  }
  // Second cohort: 1 and 3 VERMIN (31.8% total)
  else {
    return Math.random() < 0.5 ? prizeIndices.one : prizeIndices.three;
  }
};

/**
 * Format a prize value for display
 * @param {number} value - Value to format
 * @returns {string} Formatted value string
 */
export const formatPrizeValue = (value) => {
  return parseFloat(value).toFixed(1);
};
