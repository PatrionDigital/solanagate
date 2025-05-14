import { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Input } from "@windmill/react-ui";

const GameIntro = ({ onCreatePet, walletConnected }) => {
  const [petName, setPetName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!petName.trim()) {
      setError("Please enter a name for your pet");
      return;
    }
    onCreatePet(petName.trim());
  };

  if (!walletConnected) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8">
        <Card className="p-6 !bg-[rgba(50,50,50,0.8)] border border-gold rounded-lg shadow-lg backdrop-blur text-center">
          <h2 className="text-2xl text-gold font-bold mb-4">
            Welcome to Vermigotchi
          </h2>
          <div className="mb-6">
            <p className="text-white mb-4">
              Please connect your wallet to play.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Card className="p-6 !bg-[rgba(50,50,50,0.8)] border border-gold rounded-lg shadow-lg backdrop-blur">
        <h2 className="text-2xl text-gold font-bold mb-4 text-center">
          Welcome to Vermigotchi
        </h2>
        <div className="mb-6">
          <p className="text-white mb-4">
            Adopt and raise your very own digital pet! Take care of it by
            feeding, playing, and making sure it gets enough rest.
          </p>
          <div className="bg-[rgba(0,0,0,0.3)] border border-gold/30 p-4 rounded-md mb-4">
            <h3 className="text-gold font-bold mb-2">How to Play:</h3>
            <ul className="text-white list-none text-sm space-y-2">
              <li>
                Your pet has hunger, happiness, energy and health stats that
                change over time
              </li>
              <li>
                <strong className="text-gold">Feed</strong> your pet to reduce
                hunger (costs 5 $VERMIN)
              </li>
              <li>
                <strong className="text-gold">Play</strong> with your pet to
                increase happiness (costs 3 $VERMIN)
              </li>
              <li>
                <strong className="text-gold">Sleep</strong> lets your pet
                regain energy (free)
              </li>
              <li>
                <strong className="text-gold">Medicine</strong> instantly
                restores health (costs 10 $VERMIN)
              </li>
              <li>
                <strong className="text-gold">Special</strong> care boosts all
                stats (costs 20 $VERMIN)
              </li>
            </ul>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="border-t border-gray-700 pt-6">
          <div className="max-w-sm mx-auto">
            <h3 className="text-xl text-gold font-bold mb-3">Name Your Pet</h3>
            <Input
              className="mb-4"
              placeholder="Enter pet name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="submit"
                className="!bg-gold !text-black font-bold focus:ring-2 focus:ring-gold/50 border-none"
                style={{ backgroundColor: "#FFD700", color: "#111" }}
              >
                Create Pet (50 $VERMIN)
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

GameIntro.propTypes = {
  onCreatePet: PropTypes.func.isRequired,
  walletConnected: PropTypes.bool.isRequired,
};

export default GameIntro;
