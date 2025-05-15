// src/components/games/spinner/SpinHistory.jsx
import PropTypes from "prop-types";
import { Card } from "@windmill/react-ui";
import { formatPrizeValue } from "@/utils/spinnerUtils";

const SpinHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <Card className="vermin-spinner-history">
        <h3 className="vermin-spinner-history-title">Spin History</h3>
        <p className="vermin-spinner-history-empty-message">No spins yet. Take your first spin to win prizes!</p>
      </Card>
    );
  }

  return (
    <Card className="vermin-spinner-history">
      <h3 className="vermin-spinner-history-title">Spin History</h3>
      <div className="vermin-spinner-history-list">
        {history.slice().reverse().map((spin, index) => {
          const spinDate = new Date(spin.timestamp);
          const formattedDate = spinDate.toLocaleDateString();
          const formattedTime = spinDate.toLocaleTimeString();
          return (
            <div key={index} className="vermin-spinner-history-item">
              <div className="vermin-spinner-history-item-time">
                {formattedDate} at {formattedTime}
              </div>
              <div className="vermin-spinner-history-item-details">
                <span className="vermin-spinner-history-item-prize">
                  {formatPrizeValue(spin.finalValue)} VERMIN
                </span>
                {spin.baseValue !== spin.finalValue && (
                  <div className="vermin-spinner-history-item-bonus">
                    (Base: {formatPrizeValue(spin.baseValue)} +
                    {" " + formatPrizeValue(spin.finalValue - spin.baseValue)} bonus)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

SpinHistory.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      prizeIndex: PropTypes.number.isRequired,
      baseValue: PropTypes.number.isRequired,
      finalValue: PropTypes.number.isRequired,
      evolutionLevel: PropTypes.string.isRequired,
    })
  ),
};

SpinHistory.defaultProps = {
  history: [],
};

export default SpinHistory;
