// src/hooks/useSpinnerGame.js
import { useState, useEffect, useCallback, useRef } from "react";
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
 * @param {Object|string} characterOrId - Character object or ID
 * @param {Function} [onSpinComplete] - Callback called when spin completes
 */
const useSpinnerGame = (characterOrId, onSpinComplete) => {
  const { updateUserProfile, userProfile } = useUserProfile();
  const { updateCharacter } = useProject();
  // Set initial spins to 1 for first-time player
  const [spins, setSpins] = useState(() => {
    if (characterOrId && typeof characterOrId === 'object') {
      const spinnerKey = `vermin_spinner_${characterOrId.id || characterOrId.name}`;
      const savedSpinner = localStorage.getItem(spinnerKey);
      if (savedSpinner) {
        const data = JSON.parse(savedSpinner);
        if (!data.lastSpinTime) return 1;
        const eligible = isEligibleForFreeSpin(data.lastSpinTime);
        return eligible ? 1 : (data.remainingSpins ?? 0);
      }
    }
    return 1;
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinHistory, setSpinHistory] = useState([]);
  const [lastSpinTime, setLastSpinTime] = useState(null);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [character, setCharacter] = useState(null);
  // Ref to keep the stable character reference
  const lastValidCharacterRef = useRef(null);
  // Ref to track previous identity and health
  const prevIdRef = useRef(null);
  const prevHealthRef = useRef(null);

  useEffect(() => {
    let prevCharacter = lastValidCharacterRef.current;
    if (!characterOrId || typeof characterOrId !== 'object') return;
    const id = characterOrId.id || characterOrId.name;
    const health = characterOrId.health;
    const prevId = prevIdRef.current;
    const prevHealth = prevHealthRef.current;

    // Update if pet identity changes
    if (id !== prevId) {
      lastValidCharacterRef.current = characterOrId;
      setCharacter(characterOrId);
      prevIdRef.current = id;
      prevHealthRef.current = health;
      return;
    }
    // Update if health crosses from >=5% to <5%
    if (typeof prevHealth === 'number' && prevHealth >= 5 && health < 5) {
      lastValidCharacterRef.current = characterOrId;
      setCharacter(characterOrId);
    }
    prevIdRef.current = id;
    prevHealthRef.current = health;

    // Cleanup: if previous character had a destroy method, call it
    return () => {
      if (prevCharacter && typeof prevCharacter.destroy === 'function') {
        try {
          prevCharacter.destroy();
        } catch (e) {
          // Swallow errors to prevent crashing
          console.warn('[useSpinnerGame] Error during cleanup destroy:', e);
        }
      }
    };
  }, [characterOrId]);



  // Detect if characterOrId is an object (pet) or id string
  const isCharacterObject = characterOrId && typeof characterOrId === 'object';


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
      setSpins(1);
      // Persist the new spin count to localStorage if using Vermigotchi pet context
      if (isCharacterObject) {
        const spinnerKey = `vermin_spinner_${characterOrId.id || characterOrId.name}`;
        const updatedData = {
          history: spinHistory,
          lastSpinTime,
          remainingSpins: 1,
        };
        localStorage.setItem(spinnerKey, JSON.stringify(updatedData));
      } else {
        // For legacy/project context, persist using saveSpinnerData
        saveSpinnerData({
          history: spinHistory,
          lastSpinTime,
          remainingSpins: 1,
        });
      }
    }
  }, [character, lastSpinTime, spins, isCharacterObject, characterOrId, spinHistory, saveSpinnerData]);

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
    console.debug('[SpinnerGame] spin() called', { spins, isSpinning, character });
    if (isSpinning || spins <= 0 || !character) {
      console.warn('[SpinnerGame] spin() skipped', { isSpinning, spins, character });
      return;
    }
    if (isSpinning || spins <= 0 || !character) return;
    setIsSpinning(true);
    console.debug('[SpinnerGame] Spinning started');
    const newPrizeIndex = getRandomPrizeIndex();
    setPrizeIndex(newPrizeIndex);
    console.debug('[SpinnerGame] Prize index set', { newPrizeIndex });
    const prizeValue = PRIZE_SEGMENTS[newPrizeIndex].value;
    const evolutionLevel = character.evolutionStage || "EGG";
    const finalPrize = calculatePrizeWithBonus(prizeValue, evolutionLevel);
    setTimeout(() => {
      console.debug('[SpinnerGame] Spin animation complete');
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
      console.debug('[SpinnerGame] Spin history updated', { updatedHistory });
      
      // Call onSpinComplete with the latest history if provided
      if (typeof onSpinComplete === 'function') {
        onSpinComplete(updatedHistory);
      }
      
      setLastSpinTime(now);
      console.debug('[SpinnerGame] Last spin time updated', { now });
      setSpins(prev => {
        const newSpins = prev - 1;
        console.debug('[SpinnerGame] Spins decremented', { prev, newSpins });
        return newSpins;
      });
      setIsSpinning(false);
      console.debug('[SpinnerGame] Spinning ended');
      saveSpinnerData({
        history: updatedHistory,
        lastSpinTime: now,
        remainingSpins: spins - 1,
        bonusSpinsAdded: isEligibleForFreeSpin(lastSpinTime) ? false : true
      });
      console.debug('[SpinnerGame] Spinner data saved', {
        history: updatedHistory,
        lastSpinTime: now,
        remainingSpins: spins - 1
      });
      if (finalPrize > 0) {
        console.debug('[SpinnerGame] Prize awarded', { finalPrize });
        const tokenBalance = userProfile?.tokenBalance || 0;
        const newBalance = tokenBalance + (finalPrize * 1000000); // Convert to lamports
        updateUserProfile({
          ...userProfile,
          tokenBalance: newBalance,
        });
      }
    }, 5000); // 5 seconds for the spinning animation
  }, [isSpinning, spins, character, prizeIndex, spinHistory, saveSpinnerData, userProfile, updateUserProfile, lastSpinTime, onSpinComplete]);

  // Get total winnings
  const getTotalWinnings = useCallback(() => {
    return spinHistory.reduce((total, spin) => total + spin.finalValue, 0);
  }, [spinHistory]);

  const isFirstSpin = spinHistory.length === 0 && !lastSpinTime;
  const triggerOnboarding = isFirstSpin;

  return {
    spins,
    isSpinning,
    spinHistory,
    lastSpinTime,
    // For pet context, character is always the last valid pet object (reference never changes unless id/name changes)
    character: lastValidCharacterRef.current,
    prizeIndex,
    spin,
    getTotalWinnings,
    canSpin: (spins > 0 && !isSpinning) || isFirstSpin,
    isFirstSpin,
    triggerOnboarding,
    // Expose setters for admin/debug purposes
    setSpins,
    setSpinHistory,
    setLastSpinTime,
  };


};

export default useSpinnerGame;
