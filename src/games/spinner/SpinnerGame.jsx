// src/games/spinner/SpinnerGame.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useTokenPet from "@/games/tokenpet/hooks/useTokenPet";
import SpinInstructions from "./SpinInstructions";
import useSpinnerGame from "@/hooks/useSpinnerGame";
import Wheel from "./Wheel";
import SpinInfo from "./SpinInfo";
import SpinHistory from "./SpinHistory";
import "@/styles/SpinnerGame.css";
import { Button, Card } from "@windmill/react-ui";
import Confetti from "react-confetti";
import { FiArrowLeft } from "react-icons/fi";

const SpinnerGame = () => {
  const navigate = useNavigate();
  
  const handleBackToGames = () => {
    navigate('/games');
  };
  // Get the current TokenPet from context
  const { pet } = useTokenPet();

  // Always call the hook, even if pet is null
  const handleSpinComplete = useCallback((updatedHistory) => {
    console.log('[SpinnerGame] handleSpinComplete called with history:', updatedHistory);
    const lastSpin = updatedHistory[updatedHistory.length - 1];
    if (lastSpin) {
      setCurrentPrize(lastSpin);
      setShowPrize(true);
      // Trigger scale-in animation after the modal is shown
      setTimeout(() => setIsAnimating(true), 10);
      console.log('[SpinnerGame] Prize modal should show. Prize:', lastSpin);
      
      // Start hiding animation slightly before the timeout to allow for smooth exit
      setTimeout(() => {
        setIsAnimating(false);
        // Wait for the scale-out animation to complete before hiding the modal
        setTimeout(() => setShowPrize(false), 300);
      }, 4700); // 5000ms total - 300ms for animation
    } else {
      console.log('[SpinnerGame] No lastSpin found in updatedHistory');
    }
  }, []);

  const {
    spins,
    isSpinning,
    spinHistory,
    character,
    prizeIndex,
    spin,
    getTotalWinnings,
    canSpin,
  } = useSpinnerGame(pet, handleSpinComplete);

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // Handle spin button click
  const handleSpin = (e) => {
    e.stopPropagation(); // Prevent bubbling
    if (!canSpin || isSpinning) return;
    spin();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="vermin-spinner-game-title">Vermin Spinner Game</h2>
        <Button 
          onClick={handleBackToGames}
          layout="outline"
          className="flex items-center gap-2 text-sm"
          size="small"
        >
          <FiArrowLeft /> Back to Games
        </Button>
      </div>
      <Card className="p-6 !bg-[rgba(50,50,50,0.8)] border border-gold rounded-lg shadow-lg backdrop-blur">
        <div className="vermin-spinner-game-main">
          <div className="vermin-spinner-game-left">
            {console.log('[SpinnerGame] Rendering <Wheel />', { isSpinning, prizeIndex })}
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
            {/* Mobile Selector - Only visible on small screens */}
            <div className="vermin-mobile-selector">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="vermin-mobile-select"
              >
                <option value="info">Game Info</option>
                <option value="history">Spin History</option>
                <option value="howtoplay">How to Play</option>
              </select>
            </div>
            
            {/* Desktop Tabs - Hidden on mobile */}
            <div className="vermin-tabs">
              <button
                className={`vermin-tab ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                Game Info
              </button>
              <button
                className={`vermin-tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Spin History
              </button>
              <button
                className={`vermin-tab ${activeTab === 'howtoplay' ? 'active' : ''}`}
                onClick={() => setActiveTab('howtoplay')}
              >
                How to Play
              </button>
            </div>
            <div className="vermin-tab-content">
              {activeTab === 'info' && (
                <SpinInfo
                  spins={spins}
                  character={character}
                  totalWinnings={getTotalWinnings()}
                />
              )}
              {activeTab === 'history' && (
                <SpinHistory history={spinHistory} />
              )}
              {activeTab === 'howtoplay' && (
                <SpinInstructions />
              )}
            </div>
          </div>
        </div>
      </Card>
      {/* Prize notification */}
      {showPrize && currentPrize && (
        <>
          {currentPrize.finalValue > 0 && (
            <Confetti
              numberOfPieces={250}
              recycle={false}
              width={window.innerWidth}
              height={window.innerHeight}
            />
          )}
          <div className="vermin-prize-notification-container">
            <Card className={`vermin-prize-notification-card ${isAnimating ? 'scale-in' : 'scale-out'}`}>
              {currentPrize.finalValue > 0 ? (
                <>
                  <h3 className="vermin-prize-title">🎉 You Won! 🎉</h3>
                  <div className="vermin-spinner-prize-amount">
                    {currentPrize.finalValue} <span className="vermin-prize-token">VERMIN</span>
                  </div>
                  {currentPrize.baseValue !== currentPrize.finalValue && (
                    <div className="vermin-prize-bonus">
                      (Base: {currentPrize.baseValue} + Bonus:{' '}
                      {currentPrize.finalValue - currentPrize.baseValue})
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="vermin-prize-title">😭 Better Luck Next Time!</h3>
                  <div className="vermin-prize-message">
                    Sorry! You didn&apos;t win anything this time.
                  </div>
                </>
              )}
              <div className="vermin-prize-actions">
                <Button
                  onClick={() => {
                    setIsAnimating(false);
                    setTimeout(() => setShowPrize(false), 300);
                  }}
                  className="vermin-spinner-prize-close-btn"
                >
                  OK
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

SpinnerGame.propTypes = {
  characterId: PropTypes.string,
};

export default SpinnerGame;
