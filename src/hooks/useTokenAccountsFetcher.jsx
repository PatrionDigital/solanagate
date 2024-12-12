import { useEffect, useRef } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWalletContext } from "@/contexts/WalletContext";
import { saveUserProfile, removeUserProfile } from "@/utils/localStorageUtils";

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
    if (!publicKey || !connection || isFetching.current) {
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
        if (accountInfo && accountInfo.data) {
          const balance = accountInfo.data.readUIntLE(64, 8);
          if (balance > 0) {
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