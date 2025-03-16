import { useEffect, useRef } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWalletContext } from "@/contexts/WalletContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { getUserProfile } from "@/utils/localStorageUtils";
import { isAdminAddress } from "@/utils/adminUtils";

const TOKEN_MINT_ADDRESS = new PublicKey(
  import.meta.env.VITE_TOKEN_MINT_ADDRESS
);

const SPL_TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const useTokenAccountsFetcher = () => {
  const { connection, publicKey, setIsTokenHolder } = useWalletContext();
  const { updateUserProfile } = useUserProfile();
  const isFetching = useRef(false);

  useEffect(() => {
    const userProfile = getUserProfile();
    if (userProfile && userProfile.tokenBalance) {
      setIsTokenHolder(userProfile.tokenBalance > 0 || userProfile.isAdmin);
      return;
    }

    if (!publicKey || !connection || isFetching.current) {
      setIsTokenHolder(null);
      return;
    }

    const fetchTokenAccount = async () => {
      isFetching.current = true;
      try {
        // First check if the wallet is an admin address
        const walletAddress = publicKey.toString();
        if (isAdminAddress(walletAddress)) {
          console.log("Admin wallet detected. Granting access.");
          setIsTokenHolder(true);

          // Get current profile to preserve other data
          const currentProfile = getUserProfile() || {};
          updateUserProfile({
            ...currentProfile,
            walletAddress: walletAddress,
            // For admins, we set a token balance even if they don't have one
            // This is just for display purposes
            tokenBalance: currentProfile.tokenBalance || 1,
            isAdmin: true, // Add a flag to indicate this is an admin account
          });

          isFetching.current = false;
          return;
        }

        // For non-admin addresses, proceed with the normal token check
        const [ata] = PublicKey.findProgramAddressSync(
          [
            publicKey.toBuffer(),
            SPL_TOKEN_PROGRAM_ID.toBuffer(),
            TOKEN_MINT_ADDRESS.toBuffer(),
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const accountInfo = await connection.getAccountInfo(ata);
        setIsTokenHolder(null);
        console.log("Account Info:", accountInfo);
        if (accountInfo && accountInfo.data) {
          console.log("Checking for Tokens");
          const balance = accountInfo.data.readUIntLE(64, 8);
          if (balance > 0) {
            console.log("Target Tokens Found");
            setIsTokenHolder(true);

            // Get current profile to preserve other data (like hodlTime)
            const currentProfile = getUserProfile() || {};
            updateUserProfile({
              ...currentProfile,
              walletAddress: publicKey.toBase58(),
              tokenBalance: balance,
              isAdmin: false,
            });
          } else {
            setIsTokenHolder(false);
            // Don't remove profile, just update token balance
            const currentProfile = getUserProfile();
            if (currentProfile) {
              updateUserProfile({
                ...currentProfile,
                tokenBalance: 0,
                isAdmin: false,
              });
            }
          }
        } else {
          setIsTokenHolder(false);
          // Don't remove profile, just update token balance
          const currentProfile = getUserProfile();
          if (currentProfile) {
            updateUserProfile({
              ...currentProfile,
              tokenBalance: 0,
              isAdmin: false,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching token accounts:", error);
        setIsTokenHolder(false);
      } finally {
        isFetching.current = false;
      }
    };

    fetchTokenAccount();
  }, [publicKey, connection, setIsTokenHolder, updateUserProfile]);

  return null;
};

export default useTokenAccountsFetcher;
