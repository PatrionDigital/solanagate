import { useState, useEffect } from "react";
import { Card } from "@windmill/react-ui";
import { useWalletContext } from "@/contexts/WalletContext";
import PetVisual from "./PetVisual";
import PetStatus from "./PetStatus";
import GameControls from "./GameControls";
import GameIntro from "./GameIntro";
import CharacterSettings from "./CharacterSettings";
import { FaCog } from "react-icons/fa";
import { useVermigotchi } from "../hooks/useVermigotchi";

const VermigotchiContainer = () => {
  const { publicKey } = useWalletContext();
  const [showIntro, setShowIntro] = useState(true);
  const {
    pet,
    isPetAlive,
    hasPet,
    createPet,
    feedPet,
    playWithPet,
    toggleSleep,
    giveMedicine,
    giveSpecialCare,
    message,
    resetPet,
    setPet
  } = useVermigotchi();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (hasPet) {
      setShowIntro(false);
    }
  }, [hasPet]);

  const handleCreatePet = (name) => {
    createPet(name);
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <GameIntro onCreatePet={handleCreatePet} walletConnected={!!publicKey} />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Card className="p-6 !bg-[rgba(50,50,50,0.8)] border border-gold rounded-lg shadow-lg backdrop-blur flex flex-col gap-6">
        {/* Top row: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Character visual */}
          <div className="flex items-center justify-center">
            <PetVisual
              stage={pet.stage}
              mood={pet.mood}
              isSleeping={pet.isSleeping}
              isSick={pet.isSick}
              isDead={pet.isDead}
            />
          </div>
          {/* Character stats and name + settings */}
          <div className="flex flex-col gap-4 justify-center">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl text-gold font-bold">{pet.name}</h2>
              <button
                className="ml-2 text-gold hover:text-yellow-400 focus:outline-none"
                aria-label="Character Settings"
                onClick={() => setShowSettings(true)}
              >
                <FaCog size={22} />
              </button>
            </div>
            <p className="text-white">Age: {pet.age} days | Stage: {pet.stage}</p>
            <PetStatus
              hunger={pet.hunger}
              happiness={pet.happiness}
              energy={pet.energy}
              health={pet.health}
            />
            {message && (
              <div className="bg-[rgba(0,0,0,0.3)] border border-gold/30 p-3 rounded-md mt-2">
                <p className="text-white">{message}</p>
              </div>
            )}
          </div>
        </div>
        {/* Bottom row: gameplay controls */}
        <div className="w-full flex justify-center">
          <GameControls
            feedPet={feedPet}
            playWithPet={playWithPet}
            toggleSleep={toggleSleep}
            giveMedicine={giveMedicine}
            giveSpecialCare={giveSpecialCare}
            disabled={!isPetAlive}
            isSleeping={pet.isSleeping}
          />
        </div>
        {/* Character Settings Modal */}
        {showSettings && (
          <CharacterSettings
            currentName={pet.name}
            onRename={name => setPet({ ...pet, name })}
            onReset={() => {
              setShowSettings(false);
              resetPet();
            }}
            onClose={() => setShowSettings(false)}
          />
        )}
      </Card>
    </div>
  );
};

export default VermigotchiContainer;
