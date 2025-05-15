// src/components/games/spinner/SpinInstructions.jsx
import { Card } from "@windmill/react-ui";

const SpinInstructions = () => {
  return (
    <Card className="vermin-spinner-info-card">
      <h3 className="vermin-spinner-info-title">How to Play</h3>
      <div className="vermin-spinner-info-content text-white text-sm">
        <p className="mb-2">Spin the wheel for a chance to win VERMIN tokens. Good luck!</p>
        <ul className="space-y-1">
          <li>🎯 You get 1 free spin every day</li>
          <li>😊 Keep your Vermigotchi happy for bonus spins</li>
          <li>🧬 Higher evolution = bigger prizes</li>
        </ul>
      </div>
    </Card>
  );
};

export default SpinInstructions;
