import { useState } from "react";
import PropTypes from "prop-types";
import {
  isValidPublicKey,
  formatPublicKey,
} from "../../utils/honeycombHelpers";

/**
 * Component for searching users by wallet address or username
 */
const UserSearch = ({
  client,
  projectAddress,
  onUserFound = () => {},
  onError = () => {},
  buttonText = "Search",
  placeholder = "Enter wallet address or username",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setNoResults(false);

    // Clear results when search term is cleared
    if (!e.target.value) {
      setSearchResults([]);
    }
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e?.preventDefault();

    if (!searchTerm.trim() || !client || !projectAddress) return;

    setIsSearching(true);
    setNoResults(false);

    try {
      let results = [];

      // If search term looks like a wallet address, search by wallet
      if (isValidPublicKey(searchTerm)) {
        const { profiles } = await client.findProfiles({
          project: projectAddress,
          wallets: [searchTerm],
        });

        if (profiles && profiles.length > 0) {
          results = profiles;
        }
      } else {
        // Otherwise, search by username (if your API supports this)
        // This is a simplified example - actual implementation depends on your API
        const { profiles } = await client.findProfiles({
          project: projectAddress,
          search: searchTerm,
        });

        if (profiles && profiles.length > 0) {
          // Filter results by name containing the search term
          results = profiles.filter((profile) =>
            profile.data?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      }

      setSearchResults(results);
      setNoResults(results.length === 0);

      // If exactly one user is found, call the onUserFound callback
      if (results.length === 1) {
        onUserFound(results[0]);
      }
    } catch (error) {
      console.error("Error searching for users:", error);
      onError(error.message || "Failed to search for users");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a user from search results
  const handleSelectUser = (user) => {
    onUserFound(user);
    setSearchResults([]);
    setSearchTerm("");
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setNoResults(false);
  };

  return (
    <div className={`user-search ${className}`}>
      <form onSubmit={handleSearch} className="user-search__form">
        <div className="user-search__input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="user-search__input"
            disabled={isSearching}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="user-search__clear-button"
              disabled={isSearching}
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          className="user-search__submit-button"
          disabled={!searchTerm.trim() || isSearching}
        >
          {isSearching ? "Searching..." : buttonText}
        </button>
      </form>

      {noResults && (
        <div className="user-search__no-results">
          <p>No users found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="user-search__results">
          <h4 className="user-search__results-title">
            Search Results ({searchResults.length})
          </h4>

          <div className="user-search__results-list">
            {searchResults.map((user, index) => (
              <div
                key={user.address || index}
                className="user-search__result"
                onClick={() => handleSelectUser(user)}
              >
                <div className="user-search__result-avatar">
                  {user.data?.image ? (
                    <img
                      src={user.data.image}
                      alt={user.data?.name || "User"}
                      className="user-search__result-avatar-img"
                    />
                  ) : (
                    <div className="user-search__result-avatar-placeholder">
                      {user.data?.name?.charAt(0) || user.wallet.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="user-search__result-info">
                  <h5 className="user-search__result-name">
                    {user.data?.name || "Unnamed User"}
                  </h5>
                  <p className="user-search__result-wallet">
                    {formatPublicKey(user.wallet)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

UserSearch.propTypes = {
  client: PropTypes.object.isRequired,
  projectAddress: PropTypes.string.isRequired,
  onUserFound: PropTypes.func,
  onError: PropTypes.func,
  buttonText: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default UserSearch;
