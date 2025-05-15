// src/components/games/spinner/SpinnerGame.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useVermigotchi } from "@/games/tamagotchi/hooks/useVermigotchi";
import useSpinnerGame from "@/hooks/useSpinnerGame";
import Wheel from "./Wheel";
import SpinnerGameDebugPanel from "./SpinnerGameDebugPanel";
import SpinInfo from "./SpinInfo";
import SpinHistory from "./SpinHistory";
import "@/styles/SpinnerGame.css";
import AdminProtected from "@/components/AdminProtected";
import { Button } from "@windmill/react-ui";

const SpinnerGame = () => {
  // Get the current Vermigotchi pet from context
  const { pet } = useVermigotchi();

  // Always call the hook, even if pet is null
  const {
    spins,
    isSpinning,
    spinHistory,
    character,
    prizeIndex,
    spin,
    getTotalWinnings,
    canSpin,
    triggerOnboarding,
    setSpins,
    setSpinHistory,
    setLastSpinTime,
  } = useSpinnerGame(pet);

  // Local state and effects must be declared before any return
  // (move all hooks here)
  // Example: const [showPrize, setShowPrize] = useState(false);
  // ... other hooks
  // (Assume all hooks are now at the top, before any return)

  useEffect(() => {
    console.log("[SpinnerGame] character changed:", character);
  }, [character]);

  // Show prize notification
  const [showPrize, setShowPrize] = useState(false);
  const [currentPrize, setCurrentPrize] = useState(null);



  // Show loading if pet or character is null
  if (!pet || !character) {
    return (
      <div className="vermin-spinner-loading">
        <h3>Loading your Vermigotchi...</h3>
      </div>
    );
  }

  // Handle spin button click
  const handleSpin = (e) => {
    e.stopPropagation(); // Prevent bubbling
    if (!canSpin || isSpinning) return;
    spin();
  };


  // Handle spin completion
  const handleSpinComplete = () => {
    const lastSpin = spinHistory[spinHistory.length - 1];
    if (lastSpin) {
      setCurrentPrize(lastSpin);
      setShowPrize(true);
      setTimeout(() => setShowPrize(false), 5000);
    }
    // No longer remounting the Wheel; reset logic is handled internally
  };


  // Handler for debug panel actions (admin only)
  const handleDebugAction = (action) => {
    if (!character) return;
    const spinnerKey = `vermin_spinner_${character.id || character.name}`;
    if (action === "addSpin") {
      setSpins((prev) => {
        const newSpins = prev + 1;
        // Update localStorage
        const saved = localStorage.getItem(spinnerKey);
        if (saved) {
          const data = JSON.parse(saved);
          localStorage.setItem(
            spinnerKey,
            JSON.stringify({
              ...data,
              remainingSpins: newSpins,
            })
          );
        }
        return newSpins;
      });
    } else if (action === "resetHistory") {
      setSpins(1);
      setSpinHistory([]);
      setLastSpinTime(null);
      localStorage.setItem(
        spinnerKey,
        JSON.stringify({
          history: [],
          lastSpinTime: null,
          remainingSpins: 1,
        })
      );
    }
  };

  // Show onboarding modal/message for first-time players
  const onboardingMessage = triggerOnboarding ? (
    <div className="vermin-spinner-onboarding-modal">
      <div className="vermin-spinner-onboarding-content">
        <h2>Welcome to the Vermin Spinner!</h2>
        <p>
          This is your first time playing. Spin the wheel for a chance to win
          VERMIN tokens. Good luck!
        </p>
        <ul>
          <li>🎯 You get 1 free spin every day</li>
          <li>😊 Keep your Vermigotchi happy for bonus spins</li>
          <li>🧬 Higher evolution = bigger prizes</li>
        </ul>
      </div>
    </div>
  ) : null;

  return (
    <div className="vermin-spinner-game">
      <h2 className="vermin-spinner-game-title">Vermin Spinner Game</h2>
      {/* Admin Debug Panel */}
      {character && (
        <AdminProtected>
          <SpinnerGameDebugPanel
            character={character}
            onDebugAction={handleDebugAction}
          />
        </AdminProtected>
      )}
      {onboardingMessage}
      <div className="vermin-spinner-game-main">
        <div className="vermin-spinner-game-left">
          <Wheel
            isSpinning={isSpinning}
            prizeIndex={prizeIndex}
            onSpinComplete={handleSpinComplete}
          />
          <Button
            className={`vermin-spinner-btn ${
              !canSpin || isSpinning ? "vermin-spinner-btn--disabled" : ""
            }`}
            onClick={handleSpin}
            disabled={!canSpin || isSpinning}
            style={{ marginTop: 24 }}
          >
            {isSpinning ? "Spinning..." : `Spin (${spins} left)`}
          </Button>
        </div>
        <div className="vermin-spinner-game-right">
          <div className="vermin-spinner-game-info-row">
            <SpinInfo
              spins={spins}
              character={character}
              totalWinnings={getTotalWinnings()}
            />
          </div>
          <div className="vermin-spinner-game-history-row">
            <SpinHistory history={spinHistory} />
          </div>
        </div>
      </div>
      {/* Prize notification */}
      {showPrize && currentPrize && (
        <div className="vermin-spinner-prize-notification">
          <h3>🎉 You Won! 🎉</h3>
          <div className="vermin-spinner-prize-amount">
            {currentPrize.finalValue} VERMIN
          </div>
          {currentPrize.baseValue !== currentPrize.finalValue && (
            <div className="vermin-spinner-prize-bonus">
              {currentPrize.evolutionLevel} bonus: +
              {(
                (currentPrize.finalValue / currentPrize.baseValue - 1) *
                100
              ).toFixed(0)}
              %
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SpinnerGame.propTypes = {
  characterId: PropTypes.string,
};

export default SpinnerGame;
