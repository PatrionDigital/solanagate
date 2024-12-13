import PropTypes from "prop-types";
import "@/styles/LoadingSpinner.css";

const LoadingSpinner = ({ message }) => (
  <div className="loading-spinner">
    <div className="spinner-circle"></div>
    <p>{message}</p>
  </div>
);

LoadingSpinner.propTypes = {
  message: PropTypes.string.isRequired,
};

export default LoadingSpinner;
