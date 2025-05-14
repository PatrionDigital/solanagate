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
  isSleeping
}) => {
  return (
    <div className="game-controls">
      {/* Main controls */}
      <div className="flex flex-wrap justify-center items-end gap-3 mt-2 w-full">
        <Button
          onClick={feedPet}
          disabled={disabled || isSleeping}
          className="verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50"
        >
          <FaUtensils /> Feed (5)
        </Button>
        <Button
          onClick={playWithPet}
          disabled={disabled || isSleeping}
          className="verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50"
        >
          <FaGamepad /> Play (3)
        </Button>
        <Button
          onClick={toggleSleep}
          disabled={disabled}
          className={`verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50 ${isSleeping ? 'opacity-80' : ''}`}
          data-testid="toggle-sleep-btn"
        >
          <FaBed /> {isSleeping ? 'Wake Up' : 'Sleep'}
        </Button>
        <Button
          onClick={giveMedicine}
          disabled={disabled || isSleeping}
          className="verm-gold-btn bg-gold !important text-black !important font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50"
          data-testid="give-medicine-btn"
          className="verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50"
        >
          <FaMedkit /> Medicine (10)
        </Button>
        <Button
          onClick={giveSpecialCare}
          disabled={disabled || isSleeping}
          className="verm-gold-btn font-bold min-w-[110px] flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-gold/50"
        >
          <FaStar /> Special (20)
        </Button>
      </div>

    </div>
  );
};

GameControls.propTypes = {
  feedPet: PropTypes.func.isRequired,
  playWithPet: PropTypes.func.isRequired,
  toggleSleep: PropTypes.func.isRequired,
  giveMedicine: PropTypes.func.isRequired,
  giveSpecialCare: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isSleeping: PropTypes.bool,
};

GameControls.defaultProps = {
  disabled: false,
  isSleeping: false,
};

export default GameControls;
