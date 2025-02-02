import { useEffect, useRef, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWalletContext } from "@/contexts/WalletContext";
import {
  getUserProfile,
  removeUserProfile,
  saveUserProfile,
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

const useHodlTimeFetcher = () => {
  const { connection, publicKey } = useWalletContext();
  const [hodlTime, setHodlTime] = useState(null);
  const isFetching = useRef(false);

  const formatTime = (duration) => {
    console.log("Duration in milliseconds:", duration);
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;

    const timeString = [];
    if (days > 0) timeString.push(`${days} day${days > 1 ? "s" : ""}`);
    if (remainingHours > 0)
      timeString.push(`${remainingHours} hour${remainingHours > 1 ? "s" : ""}`);
    console.log("Formatted time:", timeString.join(", "));
    return timeString.join(", ") || "Just now";
  };

  useEffect(() => {
    const userProfile = getUserProfile();
    if (userProfile && userProfile.hodlTime) {
      setHodlTime(userProfile.hodlTime);
      return;
    }

    if (!publicKey || !connection || isFetching.current) {
      return;
    }

    const fetchHodlTime = async () => {
      console.log("Fetching hodlTime...");
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

        const signatures = await connection.getSignaturesForAddress(ata);
        console.log("Fetched Signatures:", signatures);
        if (signatures?.length > 0) {
          const transactionSignature = signatures[0].signature;
          console.log("Using transaction signature:", transactionSignature);
          const transaction = await connection.getTransaction(
            transactionSignature
          );
          console.log("Fetched transaction:", transaction);

          if (
            transaction &&
            transaction.meta &&
            transaction.meta.postTokenBalances
          ) {
            console.log(
              "Post-token balances:",
              transaction.meta.postTokenBalances
            );
            const tokenTransfer = transaction.meta.postTokenBalances.find(
              (balance) =>
                balance.mint === TOKEN_MINT_ADDRESS.toBase58() &&
                balance.owner === publicKey.toBase58()
            );
            if (tokenTransfer) {
              console.log("Token transfer found:", tokenTransfer);
              const firstReceivedTime = transaction.blockTime * 1000;
              const now = Date.now();
              const duration = now - firstReceivedTime;

              const formattedDuration = formatTime(duration);
              setHodlTime(formattedDuration);
              const currentProfile = getUserProfile();
              const updatedProfile = {
                ...currentProfile,
                hodlTime: formattedDuration,
              };
              saveUserProfile(updatedProfile);
            } else {
              console.log("No matching token transfer found");
              setHodlTime(null);
            }
          }
        } else {
          console.log("No signatures found for address:", ata.toBase58());
          removeUserProfile();
          setHodlTime(null);
        }
      } catch (error) {
        console.error("Error fetching hodl time:", error);
        removeUserProfile();
        setHodlTime(null);
      } finally {
        isFetching.current = false;
      }
    };

    fetchHodlTime();
  }, [publicKey, connection]);

  return hodlTime;
};
export default useHodlTimeFetcher;
