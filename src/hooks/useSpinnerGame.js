// src/hooks/useSpinnerGame.js
import { useState, useEffect, useCallback } from "react";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useProject } from "@/hooks/useProject";
import {
  getRandomPrizeIndex,
  isEligibleForFreeSpin,
  getBonusSpins,
  calculatePrizeWithBonus,
  PRIZE_SEGMENTS
} from "@/utils/spinnerUtils";

/**
 * Custom hook for managing spinner game state
 */
const useSpinnerGame = (characterId) => {
  const { updateUserProfile, userProfile } = useUserProfile();
  const { state, updateCharacter } = useProject();
  const [spins, setSpins] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinHistory, setSpinHistory] = useState([]);
  const [lastSpinTime, setLastSpinTime] = useState(null);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [character, setCharacter] = useState(null);

  // Load character data and spin history
  useEffect(() => {
    if (!characterId) return;
    const foundCharacter = state.characters?.find(c => c.id === characterId);
    if (foundCharacter) {
      setCharacter(foundCharacter);
      if (foundCharacter.spinnerData) {
        setSpinHistory(foundCharacter.spinnerData.history || []);
        setLastSpinTime(foundCharacter.spinnerData.lastSpinTime || null);
        setSpins(foundCharacter.spinnerData.remainingSpins || 0);
      } else {
        const hasFreeSpinToday = isEligibleForFreeSpin(null);
        setSpins(hasFreeSpinToday ? 1 : 0);
      }
    }
  }, [characterId, state.characters]);

  // Save spinner data to character
  const saveSpinnerData = useCallback((data) => {
    if (!character) return;
    const updatedCharacter = {
      ...character,
      spinnerData: {
        ...character.spinnerData,
        ...data
      }
    };
    updateCharacter(updatedCharacter);
    setCharacter(updatedCharacter);
  }, [character, updateCharacter]);

  // Check for free daily spin
  useEffect(() => {
    if (!character) return;
    const hasFreeSpinToday = isEligibleForFreeSpin(lastSpinTime);
    if (hasFreeSpinToday && spins === 0) {
      setSpins(prev => prev + 1);
    }
  }, [character, lastSpinTime, spins]);

  // Check for bonus spins from Vermigotchi happiness
  useEffect(() => {
    if (!character) return;
    const happiness = character.attributes?.happiness || 0;
    const bonusSpins = getBonusSpins(happiness);
    if (bonusSpins > 0 && character.spinnerData?.bonusSpinsAdded !== true) {
      setSpins(prev => prev + bonusSpins);
      saveSpinnerData({ bonusSpinsAdded: true });
    }
  }, [character, saveSpinnerData]);

  // Perform a spin
  const spin = useCallback(() => {
    if (isSpinning || spins <= 0 || !character) return;
    setIsSpinning(true);
    const newPrizeIndex = getRandomPrizeIndex();
    setPrizeIndex(newPrizeIndex);
    const prizeValue = PRIZE_SEGMENTS[newPrizeIndex].value;
    const evolutionLevel = character.evolutionStage || "EGG";
    const finalPrize = calculatePrizeWithBonus(prizeValue, evolutionLevel);
    setTimeout(() => {
      const now = new Date().toISOString();
      const newSpin = {
        timestamp: now,
        prizeIndex: newPrizeIndex,
        baseValue: prizeValue,
        finalValue: finalPrize,
        evolutionLevel,
      };
      const updatedHistory = [...spinHistory, newSpin];
      setSpinHistory(updatedHistory);
      setLastSpinTime(now);
      setSpins(prev => prev - 1);
      setIsSpinning(false);
      saveSpinnerData({
        history: updatedHistory,
        lastSpinTime: now,
        remainingSpins: spins - 1,
        bonusSpinsAdded: isEligibleForFreeSpin(lastSpinTime) ? false : true
      });
      if (finalPrize > 0) {
        const tokenBalance = userProfile?.tokenBalance || 0;
        const newBalance = tokenBalance + (finalPrize * 1000000); // Convert to lamports
        updateUserProfile({
          ...userProfile,
          tokenBalance: newBalance,
        });
      }
    }, 5000); // 5 seconds for the spinning animation
  }, [isSpinning, spins, character, prizeIndex, spinHistory, saveSpinnerData, userProfile, updateUserProfile, lastSpinTime]);

  // Get total winnings
  const getTotalWinnings = useCallback(() => {
    return spinHistory.reduce((total, spin) => total + spin.finalValue, 0);
  }, [spinHistory]);

  return {
    spins,
    isSpinning,
    spinHistory,
    lastSpinTime,
    character,
    prizeIndex,
    spin,
    getTotalWinnings,
    canSpin: spins > 0 && !isSpinning,
  };
};

export default useSpinnerGame;
