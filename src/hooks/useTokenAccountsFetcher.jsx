import { useEffect, useRef } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWalletContext } from "@/contexts/WalletContext";
import {
  saveUserProfile,
  removeUserProfile,
  getUserProfile,
} from "@/utils/localStorageUtils";

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
  const isFetching = useRef(false);

  useEffect(() => {
    const userProfile = getUserProfile();
    if (userProfile) {
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
            saveUserProfile({
              walletAddress: publicKey.toBase58(),
              tokenBalance: balance,
            });
          } else {
            setIsTokenHolder(false);
            removeUserProfile();
          }
        } else {
          setIsTokenHolder(false);
          removeUserProfile();
        }
      } catch (error) {
        console.error("Error fetching token accounts:", error);
        setIsTokenHolder(false);
        removeUserProfile();
      } finally {
        isFetching.current = false;
      }
    };

    fetchTokenAccount();
  }, [publicKey, connection, setIsTokenHolder]);

  return null;
};

export default useTokenAccountsFetcher;
