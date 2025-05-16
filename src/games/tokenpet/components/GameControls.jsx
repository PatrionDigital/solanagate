import PropTypes from "prop-types";
import { Button } from "@windmill/react-ui";
import "./verm-gold-btn.css";
import { FaUtensils, FaGamepad, FaBed, FaMedkit, FaStar } from "react-icons/fa";

const GameControls = ({ 
  feedPet, 
  playWithPet, 
  toggleSleep, 
  giveMedicine, 
  giveSpecialCare, 
  disabled,
  isSleeping,
  selectedAction
}) => {
  return (
    <div className="game-controls">
      {/* Main controls */}
      <div className="flex flex-wrap justify-center items-end gap-3 mt-2 w-full">
        {selectedAction === 'feed' && (
          <Button
            onClick={feedPet}
            disabled={disabled || isSleeping}
            className="verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50"
          >
            <FaUtensils /> Feed (5)
          </Button>
        )}
        {selectedAction === 'play' && (
          <Button
            onClick={playWithPet}
            disabled={disabled || isSleeping}
            className="verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50"
          >
            <FaGamepad /> Play (3)
          </Button>
        )}
        {selectedAction === 'sleep' && (
          <Button
            onClick={toggleSleep}
            disabled={disabled}
            className={`verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50 ${isSleeping ? 'opacity-80' : ''}`}
            data-testid="toggle-sleep-btn"
          >
            <FaBed /> {isSleeping ? 'Wake Up' : 'Sleep'}
          </Button>
        )}
        {selectedAction === 'medicine' && (
          <Button
            onClick={giveMedicine}
            disabled={disabled || isSleeping}
            className="verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50"
            data-testid="give-medicine-btn"
          >
            <FaMedkit /> Medicine (10)
          </Button>
        )}
        {selectedAction === 'special' && (
          <Button
            onClick={giveSpecialCare}
            disabled={disabled || isSleeping}
            className="verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50"
          >
            <FaStar /> Special (20)
          </Button>
        )}
      </div>

    </div>
  );
};

GameControls.propTypes = {
  feedPet: PropTypes.func,
  playWithPet: PropTypes.func,
  toggleSleep: PropTypes.func,
  giveMedicine: PropTypes.func,
  giveSpecialCare: PropTypes.func,
  disabled: PropTypes.bool,
  isSleeping: PropTypes.bool,
  selectedAction: PropTypes.string.isRequired,
};

GameControls.defaultProps = {
  disabled: false,
  isSleeping: false,
};

export default GameControls;
