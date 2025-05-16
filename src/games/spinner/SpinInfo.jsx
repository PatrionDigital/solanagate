// src/games/spinner/SpinInfo.jsx
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
          <span className="vermin-spinner-stat-label">TokenPet Level:</span>
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
    </Card>
  );
};

SpinInfo.propTypes = {
  spins: PropTypes.number.isRequired,
  character: PropTypes.object,
  totalWinnings: PropTypes.number.isRequired,
};

export default SpinInfo;
