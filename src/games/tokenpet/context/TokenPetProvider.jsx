import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TokenPet from "../TokenPet";
import { useGameTimer } from "../hooks/useGameTimer";
import { TokenPetContext } from "./TokenPetContext";

const TokenPetProvider = ({ children }) => {
  const [pet, setPet] = useState(null);
  const [message, setMessage] = useState("");

  // Load pet from localStorage
  useEffect(() => {
    const savedPet = localStorage.getItem("vermin_tokenpet_pet");
    if (savedPet) {
      setPet(TokenPet.fromJSON(savedPet));
    }
  }, []);

  // Save pet to localStorage
  useEffect(() => {
    if (pet) {
      localStorage.setItem("vermin_tokenpet_pet", pet.toJSON());
    }
  }, [pet]);

  // --- AWAKE STATE ---
  // Hunger increases by 0.02% every 225 seconds (reduced by 85% from 1500s)
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    const hunger = Math.min(100, pet.hunger + 0.02);
    setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), hunger }));
  }, 225000);

  // Happiness decreases by 0.02% every 225 seconds if Hunger > 75%, else -0.01% every 375 seconds
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    if (pet.hunger > 75) {
      const happiness = Math.max(0, pet.happiness - 0.02);
      setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), happiness }));
    }
  }, 225000);
  
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    if (pet.hunger <= 75) {
      const happiness = Math.max(0, pet.happiness - 0.01);
      setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), happiness }));
    }
  }, 375000);

  // Energy decreases by 0.02% every 225 seconds
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    const energy = Math.max(0, pet.energy - 0.02);
    setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), energy }));
  }, 225000);

  // If Hunger+Energy < 55%, Health decreases by 0.01% every 375 seconds
  useGameTimer(() => {
    if (!pet || pet.isDead || pet.isSleeping) return;
    if ((pet.hunger + pet.energy) < 55) {
      const health = Math.max(0, pet.health - 0.01);
      setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), health }));
    }
  }, 375000);

  // --- ASLEEP STATE ---
  // Hunger increases by 0.01% every 375 seconds
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    const hunger = Math.min(100, pet.hunger + 0.01);
    setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), hunger }));
  }, 375000);

  // Energy increases by 0.01% every 300 seconds
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    const energy = Math.min(100, pet.energy + 0.01);
    setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), energy }));
  }, 300000);

  // Happiness decreases as in awake state
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    if (pet.hunger > 75) {
      const happiness = Math.max(0, pet.happiness - 0.02);
      setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), happiness }));
    }
  }, 225000);
  
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    if (pet.hunger <= 75) {
      const happiness = Math.max(0, pet.happiness - 0.01);
      setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), happiness }));
    }
  }, 375000);

  // Health decreases as in awake state
  useGameTimer(() => {
    if (!pet || pet.isDead || !pet.isSleeping) return;
    if ((pet.hunger + pet.energy) < 55) {
      const health = Math.max(0, pet.health - 0.01);
      setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), health }));
    }
  }, 2500);

  // Health increases very gradually if happiness > 85 and hunger < 35
  useGameTimer(() => {
    if (!pet || pet.isDead) return;
    if (pet.happiness > 85 && pet.hunger < 35) {
      const health = Math.min(100, pet.health + 0.0005);
      setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus(), health }));
    }
  }, 5000);

  const createPet = (name) => {
    const newPet = new TokenPet(name);
    setPet(newPet);
    setMessage(`Welcome, ${name}! Take good care of your pet.`);
  };

  const feedPet = () => {
    if (!pet) return;
    const result = pet.feed();
    setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const playWithPet = () => {
    if (!pet) return;
    const result = pet.play();
    setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const toggleSleep = () => {
    if (!pet) return;
    const result = pet.sleep();
    setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const giveMedicine = () => {
    if (!pet) return;
    const result = pet.medicine();
    setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const giveSpecialCare = () => {
    if (!pet) return;
    const result = pet.specialCare();
    setPet(new TokenPet(pet.name, { ...pet, ...pet.getStatus() }));
    setMessage(result.message);
  };

  const resetPet = () => {
    setPet(null);
    localStorage.removeItem("tokenPet");
    setMessage("Your pet has been reset. Create a new one!");
  };

  const contextValue = {
    pet,
    setPet,
    isPetAlive: pet ? !pet.isDead : false,
    hasPet: !!pet,
    createPet,
    feedPet,
    playWithPet,
    toggleSleep,
    giveMedicine,
    giveSpecialCare,
    resetPet,
    message,
  };

  return (
    <TokenPetContext.Provider value={contextValue}>
      {children}
    </TokenPetContext.Provider>
  );
};

TokenPetProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { TokenPetProvider };
export default TokenPetProvider;
