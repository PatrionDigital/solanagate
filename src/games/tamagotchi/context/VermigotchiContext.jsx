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

  // --- AWAKE STATE ---
  // Hunger increases by 0.02% every 1500ms
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    const hunger = Math.min(100, pet.hunger + 0.02);
    setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), hunger }));
  }, 1500);

  // Happiness decreases by 0.02% every 1500ms if Hunger > 75%, else -0.01% every 2500ms
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    if (pet.hunger > 75) {
      const happiness = Math.max(0, pet.happiness - 0.02);
      setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), happiness }));
    }
  }, 1500);
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    if (pet.hunger <= 75) {
      const happiness = Math.max(0, pet.happiness - 0.01);
      setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), happiness }));
    }
  }, 2500);

  // Energy decreases by 0.02% every 1500ms
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    const energy = Math.max(0, pet.energy - 0.02);
    setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), energy }));
  }, 1500);

  // If Hunger+Energy < 55%, Health decreases by 0.01% every 2500ms
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    if ((pet.hunger + pet.energy) < 55) {
      const health = Math.max(0, pet.health - 0.01);
      setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), health }));
    }
  }, 2500);

  // --- ASLEEP STATE ---
  // Hunger increases by 0.01% every 2500ms
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    const hunger = Math.min(100, pet.hunger + 0.01);
    setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), hunger }));
  }, 2500);

  // Energy increases by 0.01% every 2000ms
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    const energy = Math.min(100, pet.energy + 0.01);
    setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), energy }));
  }, 2000);

  // Happiness decreases as in awake state
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    if (pet.hunger > 75) {
      const happiness = Math.max(0, pet.happiness - 0.02);
      setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), happiness }));
    }
  }, 1500);
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    if (pet.hunger <= 75) {
      const happiness = Math.max(0, pet.happiness - 0.01);
      setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), happiness }));
    }
  }, 2500);

  // Health decreases as in awake state
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    if ((pet.hunger + pet.energy) < 55) {
      const health = Math.max(0, pet.health - 0.01);
      setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), health }));
    }
  }, 2500);

  // Health increases very gradually if happiness > 85 and hunger < 35
  useGameTimer(() => {
    if (!pet || pet.isDead) return;
    if (pet.happiness > 85 && pet.hunger < 35) {
      const health = Math.min(100, pet.health + 0.0005);
      setPet(new VermigotchiPet(pet.name, { ...pet, ...pet.getStatus(), health }));
    }
  }, 5000);

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
