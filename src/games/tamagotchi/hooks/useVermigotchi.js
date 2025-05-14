import { useContext } from "react";
import { VermigotchiContext } from "../context/VermigotchiContext";

export const useVermigotchi = () => useContext(VermigotchiContext);
