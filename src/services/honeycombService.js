import createEdgeClient from "@honeycomb-protocol/edge-client";

/**
 * Class for managing interactions with the Honeycomb Protocol API
 */
class HoneycombService {
  /**
   * Initialize the service
   * @param {string} apiUrl - Honeycomb API endpoint
   * @param {boolean} useSSE - Whether to use server-sent events
   */
  constructor(apiUrl, useSSE = false) {
    this.client = createEdgeClient(apiUrl, useSSE);
    this.apiUrl = apiUrl;
    this.token = null;
  }

  /**
   * Set the authentication token
   * @param {string} token - Auth token to use for requests
   */
  setAuthToken(token) {
    this.token = token;
    // If the client has a method to set auth token, use it
    if (this.client.setAuthToken) {
      this.client.setAuthToken(token);
    }
  }

  /**
   * Get projects with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Projects data
   */
  async getProjects(params = {}) {
    try {
      return await this.client.findProjects(params);
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  /**
   * Get profiles for a project
   * @param {string} projectAddress - Project address
   * @param {Array} wallets - Optional wallet addresses to filter by
   * @returns {Promise<Object>} Profiles data
   */
  async getProfiles(projectAddress, wallets = []) {
    try {
      const params = {
        project: projectAddress,
      };

      if (wallets.length > 0) {
        params.wallets = wallets;
      }

      return await this.client.findProfiles(params);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      throw error;
    }
  }

  /**
   * Get a single profile by address
   * @param {string} profileAddress - Profile address
   * @returns {Promise<Object>} Profile data
   */
  async getProfileByAddress(profileAddress) {
    try {
      const { profiles } = await this.client.findProfiles({
        addresses: [profileAddress],
      });

      return profiles?.[0] || null;
    } catch (error) {
      console.error("Error fetching profile by address:", error);
      throw error;
    }
  }

  /**
   * Get badges for a profile
   * @param {string} projectAddress - Project address
   * @param {string} profileAddress - Profile address
   * @returns {Promise<Object>} Badges data
   */
  async getProfileBadges(projectAddress, profileAddress) {
    try {
      return await this.client.findBadges({
        profile: profileAddress,
        project: projectAddress,
      });
    } catch (error) {
      console.error("Error fetching profile badges:", error);
      throw error;
    }
  }

  /**
   * Create a profile transaction
   * @param {string} projectAddress - Project address
   * @param {string} walletAddress - Wallet address
   * @param {Object} profileData - Profile data to save
   * @returns {Promise<Object>} Transaction data
   */
  async createProfileTransaction(projectAddress, walletAddress, profileData) {
    try {
      return await this.client.createCreateProfileTransaction({
        project: projectAddress,
        wallet: walletAddress,
        data: profileData,
      });
    } catch (error) {
      console.error("Error creating profile transaction:", error);
      throw error;
    }
  }

  /**
   * Update a profile transaction
   * @param {string} profileAddress - Profile address
   * @param {Object} updatedData - Updated profile data
   * @returns {Promise<Object>} Transaction data
   */
  async updateProfileTransaction(profileAddress, updatedData) {
    try {
      return await this.client.createUpdateProfileTransaction({
        profile: profileAddress,
        data: updatedData,
      });
    } catch (error) {
      console.error("Error creating update profile transaction:", error);
      throw error;
    }
  }

  /**
   * Create a claim badge transaction
   * @param {string} projectAddress - Project address
   * @param {string} profileAddress - Profile address
   * @param {number} badgeIndex - Badge index to claim
   * @returns {Promise<Object>} Transaction data
   */
  async claimBadgeTransaction(projectAddress, profileAddress, badgeIndex) {
    try {
      return await this.client.createClaimBadgeTransaction({
        project: projectAddress,
        profile: profileAddress,
        badgeIndex,
      });
    } catch (error) {
      console.error("Error creating claim badge transaction:", error);
      throw error;
    }
  }

  /**
   * Get character models for a project
   * @param {string} projectAddress - Project address
   * @returns {Promise<Object>} Character models data
   */
  async getCharacterModels(projectAddress) {
    try {
      return await this.client.findCharacterModels({
        project: projectAddress,
      });
    } catch (error) {
      console.error("Error fetching character models:", error);
      throw error;
    }
  }

  /**
   * Upload a file to storage
   * @param {Object} params - Upload parameters
   * @returns {Promise<Object>} Upload result with URL
   */
  async uploadFile(params) {
    try {
      // Implementation depends on the actual Honeycomb API
      // This is a placeholder
      return await this.client.uploadFile(params);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  /**
   * Get user assets
   * @param {string} ownerAddress - Asset owner address
   * @returns {Promise<Array>} Assets data
   */
  async getUserAssets(ownerAddress) {
    try {
      // Implementation depends on the actual Honeycomb API
      // This is a placeholder
      const response = await this.client.findAssets({
        owner: ownerAddress,
      });

      return response.assets || [];
    } catch (error) {
      console.error("Error fetching user assets:", error);
      return [];
    }
  }
}

export default HoneycombService;
