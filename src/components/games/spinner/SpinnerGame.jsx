// src/components/games/spinner/SpinnerGame.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useProject } from "@/hooks/useProject";
import useSpinnerGame from "@/hooks/useSpinnerGame";
import Wheel from "./Wheel";
import SpinInfo from "./SpinInfo";
import SpinHistory from "./SpinHistory";
import "@/styles/SpinnerGame.css";
import { Button, Label, Select, Card } from "@windmill/react-ui";

const SpinnerGame = ({ characterId }) => {
  const { state } = useProject();
  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(characterId || "");

  // Load characters
  useEffect(() => {
    if (state.characters) {
      setCharacters(state.characters);
      if (!characterId && state.characters.length > 0) {
        setSelectedCharacterId(state.characters[0].id);
      }
    }
  }, [state.characters, characterId]);

  // Get spinner game state from hook
  const {
    spins,
    isSpinning,
    spinHistory,
    character,
    prizeIndex,
    spin,
    getTotalWinnings,
    canSpin
  } = useSpinnerGame(selectedCharacterId);

  // Handle character selection
  const handleCharacterChange = (e) => {
    setSelectedCharacterId(e.target.value);
  };

  // Handle spin button click
  const handleSpin = () => {
    if (canSpin) {
      spin();
    }
  };

  // Show prize notification
  const [showPrize, setShowPrize] = useState(false);
  const [currentPrize, setCurrentPrize] = useState(null);

  // Handle spin completion
  const handleSpinComplete = () => {
    const lastSpin = spinHistory[spinHistory.length - 1];
    if (lastSpin) {
      setCurrentPrize(lastSpin);
      setShowPrize(true);
      setTimeout(() => setShowPrize(false), 5000);
    }
  };

  if (characters.length === 0) {
    return (
      <Card className="vermin-spinner-game vermin-spinner-game--no-characters">
        <h2 className="vermin-spinner-game-title">Vermin Spinner Game</h2>
        <p>You need to create a Vermigotchi character first to play the spinner game.</p>
        <Button
          className="vermin-spinner-game-button"
          onClick={() => window.location.href = "/games/vermigotchi"}
        >
          Create a Vermigotchi
        </Button>
      </Card>
    );
  }

  return (
    <div className="vermin-spinner-game">
      <h2 className="vermin-spinner-game-title">Vermin Spinner Game</h2>
      {/* Character selection */}
      <div className="vermin-spinner-character-select">
        <Label htmlFor="character-select">Select your Vermigotchi:</Label>
        <Select
          id="character-select"
          value={selectedCharacterId}
          onChange={handleCharacterChange}
          disabled={isSpinning}
        >
          {characters.map(char => (
            <option key={char.id} value={char.id}>
              {char.name} - Level {char.level}
            </option>
          ))}
        </Select>
      </div>
      {/* Main game area */}
      <div className="vermin-spinner-game-container">
        <div className="vermin-spinner-game-wheel">
          <Wheel
            isSpinning={isSpinning}
            prizeIndex={prizeIndex}
            onSpinComplete={handleSpinComplete}
          />
          <Button
            className={`vermin-spinner-btn ${!canSpin ? "vermin-spinner-btn--disabled" : ""}`}
            onClick={handleSpin}
            disabled={!canSpin}
          >
            {isSpinning ? "Spinning..." : `Spin (${spins} left)`}
          </Button>
        </div>
        <div className="vermin-spinner-game-info">
          <SpinInfo
            spins={spins}
            character={character}
            totalWinnings={getTotalWinnings()}
          />
          <SpinHistory history={spinHistory} />
        </div>
      </div>
      {/* Prize notification */}
      {showPrize && currentPrize && (
        <div className="vermin-spinner-prize-notification">
          <h3>🎉 You Won! 🎉</h3>
          <div className="vermin-spinner-prize-amount">{currentPrize.finalValue} VERMIN</div>
          {currentPrize.baseValue !== currentPrize.finalValue && (
            <div className="vermin-spinner-prize-bonus">
              {currentPrize.evolutionLevel} bonus: +
              {((currentPrize.finalValue / currentPrize.baseValue - 1) * 100).toFixed(0)}%
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
