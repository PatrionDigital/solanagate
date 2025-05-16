import PropTypes from "prop-types";

// Pet visual representations for different stages and moods
const PetVisual = ({ stage, mood, isSleeping, isSick, isDead }) => {
  // Helper to determine which visual to show
  const getPetVisual = () => {
    if (isDead) {
      return (
        <div className="pet-dead">
          {/* Dead pet appearance */}
          <div className="h-40 w-40 mx-auto rounded-full bg-gray-800/70 border-2 border-red-500/70 flex items-center justify-center">
            <span className="text-5xl">💀</span>
          </div>
        </div>
      );
    }
    if (stage === "egg") {
      return (
        <div className="pet-egg animate-pulse">
          <div className="h-48 w-40 mx-auto rounded-full bg-gradient-to-b from-gold/50 to-gold/10 border-2 border-gold/30 flex items-center justify-center">
            <span className="text-6xl">🥚</span>
          </div>
          <p className="text-center mt-4 text-gold">Hatching soon...</p>
        </div>
      );
    }
    let baseVisual;
    switch (stage) {
      case "baby":
        baseVisual = (
          <div className="pet-baby">
            <div className="h-48 w-48 mx-auto rounded-full bg-gradient-to-b from-purple-500/30 to-purple-800/30 border-2 border-purple-500/50 flex items-center justify-center">
              <span className="text-6xl">🐣</span>
            </div>
          </div>
        );
        break;
      case "child":
        baseVisual = (
          <div className="pet-child">
            <div className="h-56 w-56 mx-auto rounded-full bg-gradient-to-b from-blue-500/30 to-blue-800/30 border-2 border-blue-500/50 flex items-center justify-center">
              <span className="text-6xl">🐥</span>
            </div>
          </div>
        );
        break;
      case "teen":
        baseVisual = (
          <div className="pet-teen">
            <div className="h-64 w-64 mx-auto rounded-full bg-gradient-to-b from-green-500/30 to-green-800/30 border-2 border-green-500/50 flex items-center justify-center">
              <span className="text-6xl">🦊</span>
            </div>
          </div>
        );
        break;
      case "adult":
        baseVisual = (
          <div className="pet-adult">
            <div className="h-64 w-64 mx-auto rounded-full bg-gradient-to-b from-gold/30 to-amber-800/30 border-2 border-gold/50 flex items-center justify-center">
              <span className="text-6xl">🦁</span>
            </div>
          </div>
        );
        break;
      default:
        baseVisual = (
          <div className="pet-unknown">
            <div className="h-48 w-48 mx-auto rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
              <span className="text-6xl">❓</span>
            </div>
          </div>
        );
    }
    return (
      <div className="pet-container relative">
        {baseVisual}
        <div className="absolute top-0 right-0 flex gap-2">
          {isSleeping && <span className="text-3xl">💤</span>}
          {isSick && <span className="text-3xl">🤒</span>}
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <p className="text-center text-gold">
            {getMoodEmoji(mood)} <span className="capitalize">{mood}</span>
          </p>
        </div>
      </div>
    );
  };
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "ecstatic": return "😁";
      case "happy": return "😊";
      case "content": return "🙂";
      case "neutral": return "😐";
      case "hungry": return "🍽️";
      case "starving": return "🥺";
      case "depressed": return "😢";
      case "exhausted": return "😴";
      case "sick": return "🤒";
      case "sleeping": return "💤";
      default: return "❓";
    }
  };
  return (
    <div className="pet-visual-container p-4 flex items-center justify-center">
      {getPetVisual()}
    </div>
  );
};

PetVisual.propTypes = {
  stage: PropTypes.string.isRequired,
  mood: PropTypes.string.isRequired,
  isSleeping: PropTypes.bool.isRequired,
  isSick: PropTypes.bool.isRequired,
  isDead: PropTypes.bool.isRequired,
};

export default PetVisual;
