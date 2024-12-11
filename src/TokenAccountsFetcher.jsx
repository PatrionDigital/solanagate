import { useEffect, useRef } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWalletContext } from "./contexts/useWalletContext";
//import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const TOKEN_MINT_ADDRESS = new PublicKey(
  import.meta.env.VITE_TOKEN_MINT_ADDRESS
);

const SPL_TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const TokenAccountsFetcher = () => {
  const { connection, publicKey, setIsTokenHolder } = useWalletContext();

  const isFetching = useRef(false);

  useEffect(() => {
    console.log("TokenAccountsFetcher triggered", {
      publicKey: publicKey?.toBase58(),
      connection,
      isFetching: isFetching.current,
    });
    if (!publicKey || !connection || isFetching.current) {
      console.log("Skipping fetch. Conditions not met:", {
        publicKey,
        connection,
      });
      return;
    }

    const fetchTokenAccount = async () => {
      isFetching.current = true;
      try {
        console.log(
          "Querying RPC: findProgramAddress for TOKEN_MINT_ADDRESS: ",
          TOKEN_MINT_ADDRESS.toBase58()
        );
        const [ata] = PublicKey.findProgramAddressSync(
          [
            publicKey.toBuffer(),
            SPL_TOKEN_PROGRAM_ID.toBuffer(),
            TOKEN_MINT_ADDRESS.toBuffer(),
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        console.log("Looking for ATA:", ata.toBase58());

        // Fetch the account info for the ATA
        const accountInfo = await connection.getAccountInfo(ata);
        console.log("Account Info:", { connection, accountInfo });
        // If ATA exists and has a balance, set isTokenHolder to true
        if (accountInfo && accountInfo.data) {
          const balance = accountInfo.data.readUIntLE(64, 8);
          console.log("Balance:", balance);
          if (balance > 0) {
            console.log("Tokens Found");
            setIsTokenHolder(true);
          } else {
            console.log("Tokens not found.");
            setIsTokenHolder(false);
          }
        } else {
          // If the account does not exist or is empty, set false
          console.log("Account does not exist, or is empty.");
          setIsTokenHolder(false);
        }
      } catch (error) {
        console.error("Error feching token accounts:", error);
      } finally {
        isFetching.current = false; // Reset fetch flag.
      }
    };

    fetchTokenAccount();
    // Testing routing
    setIsTokenHolder(true);
  }, [publicKey, connection, setIsTokenHolder]);

  return null;
};

export default TokenAccountsFetcher;
