// src/pages/honeycomb-admin/honeycombUtils.js
import * as web3 from "@solana/web3.js";
import createEdgeClient from "@honeycomb-protocol/edge-client";
import base58 from "bs58";

// Constants - these should be in your .env file
export const API_URL =
  import.meta.env.VITE_HONEYCOMB_API_URL || "https://edge.eboy.dev/";
export const RPC_URL =
  import.meta.env.VITE_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

// Initialize connection
export const getConnection = () => {
  return new web3.Connection(RPC_URL, {
    commitment: "processed",
  });
};

// Initialize Honeycomb client
export const getClient = (useSSE = false) => {
  return createEdgeClient(API_URL, useSSE);
};

/**
 * Creates an authorization for the Honeycomb client
 * @param {web3.Keypair} keypair - The wallet keypair
 * @returns {Promise<string>} The access token
 */
export const createAuthorization = async (publicKey, signMessage) => {
  try {
    const client = getClient();
    const wallet = publicKey.toString();

    // Request authorization challenge from the server
    const { authRequest } = await client.authRequest({ wallet });

    // Sign the auth request message
    const messageBytes = new TextEncoder().encode(authRequest.message);
    const signature = await signMessage(messageBytes);

    // Confirm authentication with the server
    const { authConfirm } = await client.authConfirm({
      wallet,
      signature: base58.encode(signature),
    });

    // Store the token in localStorage
    const tokenData = {
      accessToken: authConfirm.accessToken,
      timestamp: Math.ceil(Date.now() / 1000),
    };
    localStorage.setItem("honeycomb_access_token", JSON.stringify(tokenData));

    return authConfirm.accessToken;
  } catch (error) {
    console.error("Error during authorization creation", error);
    throw error;
  }
};

/**
 * Read the access token from localStorage
 * @returns {Object} The access token and timestamp
 */
export const readAccessToken = () => {
  try {
    const data = localStorage.getItem("honeycomb_access_token");
    if (!data) {
      return { accessToken: null, timestamp: 0 };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Could not read access token", error);
    return { accessToken: null, timestamp: 0 };
  }
};

/**
 * Authorize with the Honeycomb client
 * @param {web3.PublicKey} publicKey - The wallet public key
 * @param {Function} signMessage - Function to sign messages with the wallet
 * @returns {Promise<string>} Access token
 */
export const authorize = async (publicKey, signMessage) => {
  try {
    let { accessToken, timestamp } = readAccessToken();

    // If token is expired or doesn't exist, create a new one
    const tokenValidity = 60 * 60 * 20; // 20 hours
    const currentTime = Math.ceil(Date.now() / 1000);

    if (!accessToken || currentTime - timestamp > tokenValidity) {
      accessToken = await createAuthorization(publicKey, signMessage);
    }

    return accessToken;
  } catch (error) {
    console.error("Error during authorization", error);
    throw error;
  }
};

/**
 * Send a transaction to the blockchain
 * @param {Object} txResponse - Transaction response from Honeycomb client
 * @param {web3.Keypair[]} signers - Transaction signers
 * @param {string} action - Description of the action
 * @param {boolean} logOnSuccess - Whether to log on success
 * @returns {Promise<Object>} Transaction response
 */
export const sendTransaction = async (
  txResponse,
  signTransaction,
  action,
  logOnSuccess = false
) => {
  try {
    // Create the transaction object
    const transaction = new web3.Transaction();
    transaction.add(
      ...txResponse.transaction.instructions.map(
        (instruction) =>
          new web3.TransactionInstruction({
            keys: instruction.keys,
            programId: new web3.PublicKey(instruction.programId),
            data: Uint8Array.from(atob(instruction.data), (c) =>
              c.charCodeAt(0)
            ),
          })
      )
    );

    // Get recent blockhash
    const connection = getConnection();
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new web3.PublicKey(txResponse.feePayer);

    // Sign transaction
    const signedTransaction = await signTransaction(transaction);

    // Send transaction
    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction({
      signature: txid,
      blockhash,
      lastValidBlockHeight,
    });

    const response = {
      signature: txid,
      status: confirmation.value.err ? "Failed" : "Success",
      error: confirmation.value.err,
    };

    if (logOnSuccess || response.status !== "Success") {
      console.error(
        action,
        response.status,
        response.signature,
        response.error
      );
    }

    return response;
  } catch (error) {
    console.error(`Error in ${action}:`, error);
    return {
      signature: null,
      status: "Failed",
      error: error.message,
    };
  }
};

/**
 * Create a new Honeycomb project
 * @param {Object} client - Honeycomb client
 * @param {Object} connection - Solana connection
 * @param {web3.PublicKey} publicKey - Wallet public key
 * @param {string} name - Project name
 * @param {Function} signTransaction - Function to sign transactions with wallet
 * @param {boolean} subsidizeFees - Whether to subsidize fees
 * @returns {Promise<Object>} The created project
 */
export const createProject = async (
  client,
  connection,
  publicKey,
  name,
  signTransaction,
  subsidizeFees = true
) => {
  try {
    // Create project transaction
    const {
      createCreateProjectTransaction: {
        project: projectAddress,
        tx: txResponse,
      },
    } = await client.createCreateProjectTransaction({
      name,
      authority: publicKey.toString(),
      payer: publicKey.toString(),
      subsidizeFees,
    });

    // Send transaction
    const response = await sendTransaction(
      txResponse,
      signTransaction,
      "createCreateProjectTransaction"
    );

    if (response.status !== "Success") {
      throw new Error(`Failed to create project: ${response.error}`);
    }

    // Get the created project
    const projectResponse = await client.findProjects({
      addresses: [projectAddress],
    });

    if (
      !projectResponse ||
      !projectResponse.project ||
      !projectResponse.project[0]
    ) {
      throw new Error("Project created but couldn't be retrieved");
    }

    const project = projectResponse.project[0];

    // If subsidizing fees, fund the project
    if (subsidizeFees) {
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const fundingTx = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new web3.PublicKey(projectAddress),
          lamports: 100_000_000, // 0.1 SOL
        })
      );

      fundingTx.recentBlockhash = blockhash;
      fundingTx.feePayer = publicKey;

      const signedFundingTx = await signTransaction(fundingTx);

      const fundingTxid = await connection.sendRawTransaction(
        signedFundingTx.serialize()
      );

      await connection.confirmTransaction({
        signature: fundingTxid,
        blockhash,
        lastValidBlockHeight,
      });
    }

    return project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/**
 * Create a profiles tree for a project
 * @param {Object} client - Honeycomb client
 * @param {string} projectAddress - Project address
 * @param {web3.PublicKey} publicKey - Wallet public key
 * @param {Function} signTransaction - Function to sign transactions
 * @returns {Promise<Object>} Updated project
 */
export const createProfilesTree = async (
  client,
  projectAddress,
  publicKey,
  signTransaction
) => {
  try {
    // Create profiles tree transaction
    const {
      createCreateProfilesTreeTransaction: { tx: txResponse },
    } = await client.createCreateProfilesTreeTransaction({
      treeConfig: {
        advanced: {
          maxDepth: 3,
          maxBufferSize: 8,
          canopyDepth: 3,
        },
      },
      project: projectAddress,
      payer: publicKey.toString(),
    });

    // Send transaction
    const response = await sendTransaction(
      txResponse,
      signTransaction,
      "createCreateProfilesTreeTransaction"
    );

    if (response.status !== "Success") {
      throw new Error(`Failed to create profiles tree: ${response.error}`);
    }

    // Get the updated project
    const projectResponse = await client.findProjects({
      addresses: [projectAddress],
    });

    if (
      !projectResponse ||
      !projectResponse.project ||
      !projectResponse.project[0]
    ) {
      throw new Error(
        "Profiles tree created but project couldn't be retrieved"
      );
    }

    return projectResponse.project[0];
  } catch (error) {
    console.error("Error creating profiles tree:", error);
    throw error;
  }
};

/**
 * Create badge criteria for a project
 * @param {Object} client - Honeycomb client
 * @param {string} projectAddress - Project address
 * @param {web3.PublicKey} publicKey - Wallet public key
 * @param {Function} signTransaction - Function to sign transactions
 * @returns {Promise<Object>} Updated project
 */
export const createBadgeCriteria = async (
  client,
  projectAddress,
  publicKey,
  signTransaction
) => {
  try {
    // Create badge criteria transaction
    const { createInitializeBadgeCriteriaTransaction: txResponse } =
      await client.createInitializeBadgeCriteriaTransaction({
        args: {
          authority: publicKey.toString(),
          projectAddress,
          endTime: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // One week from now
          startTime: Math.floor(Date.now() / 1000),
          badgeIndex: 0,
          payer: publicKey.toString(),
          condition: "Public", // Using "Public" condition
        },
      });

    // Send transaction
    const response = await sendTransaction(
      txResponse,
      signTransaction,
      "createInitializeBadgeCriteriaTransaction"
    );

    if (response.status !== "Success") {
      throw new Error(`Failed to create badge criteria: ${response.error}`);
    }

    // Get the updated project
    const projectResponse = await client.findProjects({
      addresses: [projectAddress],
    });

    if (
      !projectResponse ||
      !projectResponse.project ||
      !projectResponse.project[0]
    ) {
      throw new Error(
        "Badge criteria created but project couldn't be retrieved"
      );
    }

    return projectResponse.project[0];
  } catch (error) {
    console.error("Error creating badge criteria:", error);
    throw error;
  }
};

// Helper function to generate a random ID
export const makeid = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
