// src/games/spinner/SpinHistory.jsx
import PropTypes from "prop-types";
import { Card } from "@windmill/react-ui";
import { formatPrizeValue } from "@/utils/spinnerUtils";

const SpinHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <Card className="token-spinner-history">
        <h3 className="token-spinner-history-title">Spin History</h3>
        <p className="token-spinner-history-empty-message">No spins yet. Take your first spin to win prizes!</p>
      </Card>
    );
  }

  return (
    <Card className="token-spinner-history">
      <h3 className="token-spinner-history-title">Spin History</h3>
      <div className="token-spinner-history-list">
        {history.slice().reverse().map((spin, index) => {
          const spinDate = new Date(spin.timestamp);
          const formattedDate = spinDate.toLocaleDateString();
          const formattedTime = spinDate.toLocaleTimeString();
          return (
            <div key={index} className="token-spinner-history-item">
              <div className="token-spinner-history-item-time">
                {formattedDate} at {formattedTime}
              </div>
              <div className="token-spinner-history-item-details">
                <span className="token-spinner-history-item-prize">
                  {formatPrizeValue(spin.finalValue)} {import.meta.env.VITE_TOKEN_SYMBOL || 'TOKEN'}
                </span>
                {spin.baseValue !== spin.finalValue && (
                  <div className="token-spinner-history-item-bonus">
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
