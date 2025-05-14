import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import VermigotchiPet from "../VermigotchiPet";
import { useGameTimer } from "../hooks/useGameTimer";

// Create context
export const VermigotchiContext = createContext({
  pet: null,
  setPet: () => {},
  isPetAlive: false,
  hasPet: false,
  createPet: () => {},
  feedPet: () => {},
  playWithPet: () => {},
  toggleSleep: () => {},
  giveMedicine: () => {},
  giveSpecialCare: () => {},
  resetPet: () => {},
  message: "",
});

export const VermigotchiProvider = ({ children }) => {
  const [pet, setPet] = useState(null);
  const [message, setMessage] = useState("");

  // Load pet from localStorage
  useEffect(() => {
    const savedPet = localStorage.getItem("vermin_vermigotchi_pet");
    if (savedPet) {
      setPet(VermigotchiPet.fromJSON(savedPet));
    }
  }, []);

  // Save pet to localStorage
  useEffect(() => {
    if (pet) {
      localStorage.setItem("vermin_vermigotchi_pet", pet.toJSON());
    }
  }, [pet]);

  // Stat decay: every minute, degrade pet stats if alive and not sleeping
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    // Decay values (tune as needed)
    const hungerDecay = 4;
    const happinessDecay = 3;
    const energyDecay = 2;
    const healthDecay = (pet.hunger > 80 || pet.energy < 20) ? 5 : 1; // more health loss if starving/exhausted
    const newStatus = {
      ...pet.getStatus(),
      hunger: Math.min(100, pet.hunger + hungerDecay),
      happiness: Math.max(0, pet.happiness - happinessDecay),
      energy: Math.max(0, pet.energy - energyDecay),
      health: Math.max(0, pet.health - healthDecay),
    };
    let updatedPet = new VermigotchiPet(pet.name, newStatus);
    // No updateMood() method; mood is computed via getMood()
    if (updatedPet.health <= 0 || updatedPet.hunger >= 100 || updatedPet.energy <= 0) {
      updatedPet.isDead = true;
      setMessage("Your pet has passed away due to neglect.");
    }
    setPet(updatedPet);
  }, 60000); // 60 seconds

  const hasPet = !!pet;
  const isPetAlive = pet && !pet.isDead;

  const createPet = (name) => {
    const newPet = new VermigotchiPet(name);
    setPet(newPet);
    setMessage(`Welcome, ${name}! Take good care of your pet.`);
  };

  const feedPet = () => {
    if (!pet) return;
    const result = pet.feed();
    setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const playWithPet = () => {
    if (!pet) return;
    const result = pet.play();
    setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const toggleSleep = () => {
    if (!pet) return;
    const result = pet.sleep();
    setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const giveMedicine = () => {
    if (!pet) return;
    const result = pet.medicine();
    setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const giveSpecialCare = () => {
    if (!pet) return;
    const result = pet.specialCare();
    setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const resetPet = () => {
    setPet(null);
    localStorage.removeItem("vermin_vermigotchi_pet");
    setMessage("Your pet has been reset. Create a new one!");
  };

  return (
    <VermigotchiContext.Provider
      value={{
        pet: pet ? pet.getStatus() : null,
        setPet,
        isPetAlive,
        hasPet,
        createPet,
        feedPet,
        playWithPet,
        toggleSleep,
        giveMedicine,
        giveSpecialCare,
        resetPet,
        message,
      }}
    >
      {children}
    </VermigotchiContext.Provider>
  );
};

VermigotchiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
