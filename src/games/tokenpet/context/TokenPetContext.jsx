import { createContext } from "react";

// Create context
export const TokenPetContext = createContext({
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
