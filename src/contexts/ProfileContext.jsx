import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

export const ProfileContext = createContext({
  profile: null,
  profileLoading: false,
  profileError: null,
  badges: [],
  badgesLoading: false,
  assets: [],
  assetsLoading: false,
  refreshProfile: () => {},
  createProfile: () => Promise.resolve(),
  updateProfile: () => Promise.resolve(),
  claimBadge: () => Promise.resolve(),
  fetchUserAssets: () => Promise.resolve([]),
});

export const ProfileProvider = ({ children, client }) => {
  const { publicKey, signMessage, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  const [badges, setBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(false);

  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);

  // Get current project from context or config
  const getCurrentProject = useCallback(async () => {
    try {
      // Fetch the current project from the client
      // This assumes your client has a method to get current project
      // Replace with actual implementation based on your setup
      const { project } = await client.findProjects({
        // You might filter by name or other criteria
        limit: 1,
      });

      return project[0];
    } catch (error) {
      console.error("Error fetching current project:", error);
      return null;
    }
  }, [client]);

  const fetchProfile = useCallback(async () => {
    if (!publicKey) return null;

    setProfileLoading(true);
    setProfileError(null);

    try {
      const project = await getCurrentProject();
      if (!project) throw new Error("No project found");

      const { profiles } = await client.findProfiles({
        project: project.address,
        wallets: [publicKey.toString()],
      });

      if (profiles && profiles.length > 0) {
        setProfile(profiles[0]);
        return profiles[0];
      } else {
        setProfile(null);
        return null;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfileError(error.message);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, [publicKey, client, getCurrentProject]);

  const fetchBadges = useCallback(async () => {
    if (!profile) return;

    setBadgesLoading(true);

    try {
      const project = await getCurrentProject();
      if (!project) throw new Error("No project found");

      const { badges } = await client.findBadges({
        profile: profile.address,
        project: project.address,
      });

      setBadges(badges || []);
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setBadgesLoading(false);
    }
  }, [profile, client, getCurrentProject]);

  const fetchUserAssets = useCallback(async () => {
    if (!publicKey) return [];

    setAssetsLoading(true);

    try {
      // Implementation depends on how assets are structured in your application
      // This is a simplified example that would need to be adjusted
      const response = await client.findAssets({
        owner: publicKey.toString(),
      });

      setAssets(response.assets || []);
      return response.assets || [];
    } catch (error) {
      console.error("Error fetching assets:", error);
      return [];
    } finally {
      setAssetsLoading(false);
    }
  }, [publicKey, client]);

  const createProfile = useCallback(
    async (profileData) => {
      if (!publicKey || !signMessage) {
        throw new Error("Wallet not connected");
      }

      try {
        const project = await getCurrentProject();
        if (!project) throw new Error("No project found");

        // Check if profile exists
        const existingProfile = await fetchProfile();
        if (existingProfile) {
          throw new Error("Profile already exists");
        }

        // Create profile transaction
        const { createCreateProfileTransaction } =
          await client.createCreateProfileTransaction({
            project: project.address,
            wallet: publicKey.toString(),
            data: profileData,
          });

        // Send the transaction
        // This will need to be adjusted based on your transaction handling
        const signature = await sendTransaction(
          new web3.Transaction().add(createCreateProfileTransaction.tx),
          connection
        );

        await connection.confirmTransaction(signature, "confirmed");

        // Refresh the profile after creation
        await fetchProfile();
        return signature;
      } catch (error) {
        console.error("Error creating profile:", error);
        setProfileError(error.message);
        throw error;
      }
    },
    [
      publicKey,
      signMessage,
      sendTransaction,
      connection,
      client,
      fetchProfile,
      getCurrentProject,
    ]
  );

  const updateProfile = useCallback(
    async (updatedData) => {
      if (!publicKey || !profile) {
        throw new Error("Wallet not connected or profile not found");
      }

      try {
        const project = await getCurrentProject();
        if (!project) throw new Error("No project found");

        // Create update profile transaction
        const { createUpdateProfileTransaction } =
          await client.createUpdateProfileTransaction({
            profile: profile.address,
            data: updatedData,
          });

        // Send the transaction
        const signature = await sendTransaction(
          new web3.Transaction().add(createUpdateProfileTransaction.tx),
          connection
        );

        await connection.confirmTransaction(signature, "confirmed");

        // Refresh the profile after update
        await fetchProfile();
        return signature;
      } catch (error) {
        console.error("Error updating profile:", error);
        setProfileError(error.message);
        throw error;
      }
    },
    [
      publicKey,
      profile,
      sendTransaction,
      connection,
      client,
      fetchProfile,
      getCurrentProject,
    ]
  );

  const claimBadge = useCallback(
    async (badgeIndex) => {
      if (!publicKey || !profile) {
        throw new Error("Wallet not connected or profile not found");
      }

      try {
        const project = await getCurrentProject();
        if (!project) throw new Error("No project found");

        // Create claim badge transaction
        const { createClaimBadgeTransaction } =
          await client.createClaimBadgeTransaction({
            project: project.address,
            profile: profile.address,
            badgeIndex,
          });

        // Send the transaction
        const signature = await sendTransaction(
          new web3.Transaction().add(createClaimBadgeTransaction.tx),
          connection
        );

        await connection.confirmTransaction(signature, "confirmed");

        // Refresh badges after claiming
        await fetchBadges();
        return signature;
      } catch (error) {
        console.error("Error claiming badge:", error);
        throw error;
      }
    },
    [
      publicKey,
      profile,
      sendTransaction,
      connection,
      client,
      fetchBadges,
      getCurrentProject,
    ]
  );

  // Refresh all profile data
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
    if (profile) {
      await Promise.all([fetchBadges(), fetchUserAssets()]);
    }
  }, [fetchProfile, fetchBadges, fetchUserAssets, profile]);

  // Load profile when wallet connects
  useEffect(() => {
    if (publicKey) {
      fetchProfile();
    } else {
      setProfile(null);
      setBadges([]);
      setAssets([]);
    }
  }, [publicKey, fetchProfile]);

  // Load badges when profile loads
  useEffect(() => {
    if (profile) {
      fetchBadges();
      fetchUserAssets();
    }
  }, [profile, fetchBadges, fetchUserAssets]);

  const value = {
    profile,
    profileLoading,
    profileError,
    badges,
    badgesLoading,
    assets,
    assetsLoading,
    refreshProfile,
    createProfile,
    updateProfile,
    claimBadge,
    fetchUserAssets,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
  client: PropTypes.object.isRequired,
};

export default ProfileContext;
