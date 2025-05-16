import { useContext } from 'react';
import { TokenPetContext } from '../context/TokenPetContext';

const useTokenPet = () => {
  const context = useContext(TokenPetContext);
  if (context === undefined) {
    throw new Error('useTokenPet must be used within a TokenPetProvider');
  }
  return context;
};

export default useTokenPet;
