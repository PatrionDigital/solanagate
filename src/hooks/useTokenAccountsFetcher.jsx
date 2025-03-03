import { useEffect, useRef } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWalletContext } from "@/contexts/WalletContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { getUserProfile } from "@/utils/localStorageUtils";

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
      setIsTokenHolder(userProfile.tokenBalance > 0);
      return;
    }

    if (!publicKey || !connection || isFetching.current) {
      setIsTokenHolder(null);
      return;
    }

    const fetchTokenAccount = async () => {
      isFetching.current = true;
      try {
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
            });
          } else {
            setIsTokenHolder(false);
            // Don't remove profile, just update token balance
            const currentProfile = getUserProfile();
            if (currentProfile) {
              updateUserProfile({
                ...currentProfile,
                tokenBalance: 0,
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
