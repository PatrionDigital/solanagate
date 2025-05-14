import { useState, useEffect } from "react";
import { Card, Button } from "@windmill/react-ui";
import ActionConfirmModal from "./ActionConfirmModal";
import { useWalletContext } from "@/contexts/WalletContext";
import PetVisual from "./PetVisual";
import PetStatus from "./PetStatus";
import GameIntro from "./GameIntro";
import CharacterSettings from "./CharacterSettings";
import { FaCog, FaUtensils, FaGamepad, FaMedkit, FaStar, FaMoon, FaSun } from "react-icons/fa";
import { useVermigotchi } from "../hooks/useVermigotchi";

const actionOptions = [
  { value: 'feed', label: 'Feed', icon: <FaUtensils className="inline-block mr-2" /> },
  { value: 'play', label: 'Play', icon: <FaGamepad className="inline-block mr-2" /> },
  { value: 'sleep', label: pet => pet?.isSleeping ? 'Wake Up' : 'Sleep', icon: pet => pet?.isSleeping ? <FaSun className="inline-block mr-2" /> : <FaMoon className="inline-block mr-2" /> },
  { value: 'medicine', label: 'Medicine', icon: <FaMedkit className="inline-block mr-2" /> },
  { value: 'special', label: 'Special', icon: <FaStar className="inline-block mr-2" /> },
];

const VermigotchiContainer = () => {
  const { publicKey } = useWalletContext();
  const [showIntro, setShowIntro] = useState(true);
  const {
    pet,

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
  const [selectedAction, setSelectedAction] = useState('feed');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

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

  // If pet is dead, show a death panel with reset option
  if (pet && pet.isDead) {
    return (
      <div className="w-full max-w-2xl mx-auto py-8 flex flex-col items-center justify-center">
        <Card className="p-8 !bg-[rgba(50,50,50,0.92)] border border-red-600 rounded-lg shadow-2xl flex flex-col items-center gap-6">
          <PetVisual
            stage={pet.stage}
            mood={pet.mood}
            isSleeping={pet.isSleeping}
            isSick={pet.isSick}
            isDead={pet.isDead}
          />
          <h2 className="text-3xl font-bold text-red-500 mb-2">Your pet has passed away</h2>
          {message && (
            <div className="bg-[rgba(0,0,0,0.3)] border border-red-500/30 p-3 rounded-md mt-2">
              <p className="text-white text-center">{message}</p>
            </div>
          )}
          <Button
            className="!bg-gold !text-black font-bold mt-6 px-8 py-3 text-lg focus:ring-2 focus:ring-gold/50 border-none"
            style={{ backgroundColor: '#FFD700', color: '#111' }}
            onClick={resetPet}
          >
            Reset &amp; Start New Pet
          </Button>
        </Card>
      </div>
    );
  }

  // === Alpha testing: Log next evolution time ===
  if (pet && pet.evolutionStages) {
    const stages = pet.evolutionStages;
    const stageKeys = Object.keys(stages);
    const currentIdx = stageKeys.indexOf(pet.stage);
    if (currentIdx !== -1 && currentIdx < stageKeys.length - 1) {
      const nextStage = stageKeys[currentIdx + 1];
      const ageNeeded = stages[nextStage];
      const now = new Date();
      const createdAt = new Date(pet.createdAt);
      const minutesSinceCreation = (now - createdAt) / (1000 * 60);
      const minutesNeeded = ageNeeded * 24 * 60;
      const minutesLeft = Math.max(0, minutesNeeded - minutesSinceCreation);
      if (minutesLeft > 0) {
        console.log(`Pet will evolve to '${nextStage}' in ~${minutesLeft.toFixed(2)} minutes.`);
      } else {
        console.log(`Pet is ready to evolve to '${nextStage}'.`);
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Card className="p-6 !bg-[rgba(50,50,50,0.8)] border border-gold rounded-lg shadow-lg backdrop-blur flex flex-col gap-6">
        {/* Action selector menu (mobile/desktop) */}
        <div className="w-full mb-4">
          {/* Mobile selector: dropdown */}
          <div className="block md:hidden w-full mb-4">
            <select
              className="w-full px-4 py-2 rounded-lg bg-[rgba(60,60,60,0.7)] text-gold border border-gold/40 focus:ring-2 focus:ring-gold/30 focus:outline-none font-semibold"
              value={''}
              onChange={e => {
                setSelectedAction(e.target.value);
                setPendingAction(e.target.value);
                setConfirmOpen(true);
              }}
            >
              {actionOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="text-black">
                  {/* Render label dynamically for sleep */}
                  {typeof opt.label === 'function' ? opt.label(pet) : opt.label}
                </option>
              ))}
            </select> 
          </div>
          {/* Desktop selector: horizontal buttons */}
          <div className="hidden md:flex flex-wrap gap-2 justify-center mb-4">
            {actionOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={`min-w-[110px] px-4 py-2 rounded-lg font-semibold border transition-all duration-150 outline-none focus:ring-2 focus:ring-gray-400/30 focus:z-10
                  ${selectedAction === opt.value
                    ? "bg-gold/80 text-black font-bold border-gold"
                    : "bg-[rgba(60,60,60,0.7)] text-white border-gold/30 hover:bg-[rgba(60,60,60,0.9)] hover:border-gold/50 hover:text-gold focus:bg-[rgba(60,60,60,0.9)] focus:border-gold/50 focus:text-gold active:bg-[rgba(60,60,60,0.9)] active:border-gold/50 active:text-gold cursor-pointer"}
                `}
                onClick={() => {
                  setSelectedAction(opt.value);
                  setPendingAction(opt.value);
                  setConfirmOpen(true);
                }}
                tabIndex={0}
              >
                {/* Icon for button */}
                {typeof opt.icon === 'function' ? opt.icon(pet) : opt.icon}
                {/* Label for button */}
                {typeof opt.label === 'function' ? opt.label(pet) : opt.label}
              </button>
            ))}
          </div>
        </div>
        {/* Top row: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Character visual */}
          <div className="flex items-center justify-center">
            {pet ? (
              <PetVisual
                stage={pet.stage}
                mood={pet.mood}
                isSleeping={pet.isSleeping}
                isSick={pet.isSick}
                isDead={pet.isDead}
              />
            ) : null}
          </div>
          {/* Character stats and name + settings */}
          <div className="flex flex-col gap-4 justify-center">
            {pet && (
              <>
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
              </>
            )}
            {message && (
              <div className="bg-[rgba(0,0,0,0.3)] border border-gold/30 p-3 rounded-md mt-2">
                <p className="text-white">{message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action confirmation modal */}
        <ActionConfirmModal
          open={confirmOpen}
          actionLabel={(() => {
            if (pendingAction === 'sleep') {
              return pet?.isSleeping ? 'wake your pet up' : 'put your pet to sleep';
            }
            return actionOptions.find(a => a.value === pendingAction)?.label || '';
          })()}
          actionPrice={(() => {
            switch (pendingAction) {
              case 'feed': return 5;
              case 'play': return 3;
              case 'medicine': return 10;
              case 'special': return 20;
              default: return '';
            }
          })()}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            setSelectedAction(''); // Reset so user can select same action again
            // Actually trigger the action
            if (pendingAction === 'feed') feedPet();
            if (pendingAction === 'play') playWithPet();
            if (pendingAction === 'sleep') toggleSleep();
            if (pendingAction === 'medicine') giveMedicine();
            if (pendingAction === 'special') giveSpecialCare();
          }}
        />
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
