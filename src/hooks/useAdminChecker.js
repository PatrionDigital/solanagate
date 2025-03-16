import { useState, useEffect } from "react";
import { useWalletContext } from "@/contexts/WalletContext";
import { isAdminAddress } from "@/utils/adminUtils";

/**
 * Hook to check if the current wallet is an admin wallet
 * @returns {boolean} Whether the connected wallet belongs to an admin
 */
const useAdminChecker = () => {
  const { publicKey, connected } = useWalletContext();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toString();
      setIsAdmin(isAdminAddress(address));
    } else {
      setIsAdmin(false);
    }
  }, [connected, publicKey]);

  return isAdmin;
};

export default useAdminChecker;
