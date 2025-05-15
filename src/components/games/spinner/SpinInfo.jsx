// src/components/games/spinner/SpinInfo.jsx
import PropTypes from "prop-types";
import { Card } from "@windmill/react-ui";
import { formatPrizeValue, EVOLUTION_BONUSES } from "@/utils/spinnerUtils";

const SpinInfo = ({ spins, character, totalWinnings }) => {
  const evolutionLevel = character?.evolutionStage || "EGG";
  const bonus = EVOLUTION_BONUSES[evolutionLevel] || 1.0;
  const bonusPercentage = (bonus - 1) * 100;

  return (
    <Card className="vermin-spinner-info-card">
      <h3 className="vermin-spinner-info-title">Spinner Game Info</h3>
      <div className="vermin-spinner-info-content">
        <div className="vermin-spinner-stat">
          <span className="vermin-spinner-stat-label">Remaining Spins:</span>
          <span className="vermin-spinner-stat-value">{spins}</span>
        </div>
        <div className="vermin-spinner-stat">
          <span className="vermin-spinner-stat-label">Vermigotchi Level:</span>
          <span className="vermin-spinner-stat-value">{evolutionLevel}</span>
        </div>
        <div className="vermin-spinner-stat">
          <span className="vermin-spinner-stat-label">Prize Bonus:</span>
          <span className="vermin-spinner-stat-value">
            {bonusPercentage > 0 ? `+${bonusPercentage}%` : "No Bonus"}
          </span>
        </div>
        <div className="vermin-spinner-stat">
          <span className="vermin-spinner-stat-label">Total Winnings:</span>
          <span className="vermin-spinner-stat-value">{formatPrizeValue(totalWinnings)} VERMIN</span>
        </div>
      </div>
      <div className="vermin-spinner-instructions">
        <h4>How to Play:</h4>
        <ul>
          <li>You get 1 free spin every day</li>
          <li>Keep your Vermigotchi happy to earn bonus spins!</li>
          <li>Higher evolution levels give better prize bonuses</li>
          <li>Win up to 15 VERMIN tokens per spin</li>
        </ul>
      </div>
    </Card>
  );
};

SpinInfo.propTypes = {
  spins: PropTypes.number.isRequired,
  character: PropTypes.object,
  totalWinnings: PropTypes.number.isRequired,
};

export default SpinInfo;
