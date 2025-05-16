import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { formatPublicKey } from "@/utils/honeycombHelpers";

/**
 * Component for displaying and managing users (admin view)
 */
const UserList = ({
  client,
  projectAddress,
  className = "",
  onUserSelect = () => {},
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const USERS_PER_PAGE = 10;

  // Fetch users for the project
  const fetchUsers = async (pageNum = 1) => {
    if (!client || !projectAddress) return;

    setLoading(true);
    setError("");

    try {
      const { profiles } = await client.findProfiles({
        project: projectAddress,
        limit: USERS_PER_PAGE,
        offset: (pageNum - 1) * USERS_PER_PAGE,
      });

      if (pageNum === 1) {
        setUsers(profiles || []);
      } else {
        setUsers((prevUsers) => [...prevUsers, ...(profiles || [])]);
      }

      // Check if there might be more users to load
      setHasMore((profiles?.length || 0) === USERS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load next page of users
  const loadMoreUsers = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(nextPage);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length >= 3) {
      setIsSearching(true);

      // Filter users by name or wallet address
      const results = users.filter((user) => {
        const name = user.data?.name?.toLowerCase() || "";
        const wallet = user.wallet.toLowerCase();
        const searchLower = term.toLowerCase();

        return name.includes(searchLower) || wallet.includes(searchLower);
      });

      setSearchResults(results);
    } else {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
  };

  // Fetch users on component mount
  useEffect(() => {
    if (projectAddress) {
      fetchUsers(1);
    }
  }, [projectAddress]);

  // Generate full name or fallback to wallet address
  const getUserDisplayName = (user) => {
    if (user.data?.name) return user.data.name;
    return formatPublicKey(user.wallet);
  };

  // Get user avatar or placeholder
  const getUserAvatar = (user) => {
    if (user.data?.image) {
      return (
        <img
          src={user.data.image}
          alt={user.data?.name || "User"}
          className="user-list__user-avatar"
        />
      );
    }

    return (
      <div className="user-list__user-avatar-placeholder">
        {user.data?.name?.charAt(0) || user.wallet.charAt(0)}
      </div>
    );
  };

  // Handle click on a user
  const handleUserClick = (user) => {
    onUserSelect(user);
  };

  // Display the loading state
  if (loading && users.length === 0) {
    return (
      <div className={`user-list user-list--loading ${className}`}>
        <div className="user-list__loading">
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  // Display error state
  if (error && users.length === 0) {
    return (
      <div className={`user-list user-list--error ${className}`}>
        <div className="user-list__error">
          <p>{error}</p>
          <button
            onClick={() => fetchUsers(1)}
            className="user-list__retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Display empty state
  if (!loading && users.length === 0) {
    return (
      <div className={`user-list user-list--empty ${className}`}>
        <div className="user-list__empty">
          <h3 className="user-list__empty-title">No Users Found</h3>
          <p className="user-list__empty-message">
            There are no user profiles created for this project yet.
          </p>
        </div>
      </div>
    );
  }

  // Determine which users to display
  const displayedUsers = isSearching ? searchResults : users;

  // Main component render
  return (
    <div className={`user-list ${className}`}>
      <div className="user-list__header">
        <h3 className="user-list__title">Users</h3>

        <div className="user-list__search">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or wallet"
            className="user-list__search-input"
          />

          {isSearching && (
            <button onClick={clearSearch} className="user-list__search-clear">
              Clear
            </button>
          )}
        </div>
      </div>

      {error && <div className="user-list__error-banner">{error}</div>}

      {isSearching && searchResults.length === 0 ? (
        <div className="user-list__no-results">
          <p>No users found matching &quot;{searchTerm}&quot;</p>
        </div>
      ) : (
        <>
          <div className="user-list__users">
            {displayedUsers.map((user, index) => (
              <div
                key={user.address || index}
                className="user-list__user"
                onClick={() => handleUserClick(user)}
              >
                <div className="user-list__user-avatar-container">
                  {getUserAvatar(user)}
                </div>

                <div className="user-list__user-info">
                  <h4 className="user-list__user-name">
                    {getUserDisplayName(user)}
                  </h4>

                  <p className="user-list__user-wallet">
                    {formatPublicKey(user.wallet)}
                  </p>

                  {user.data?.created_at && (
                    <p className="user-list__user-joined">
                      Joined:{" "}
                      {new Date(user.data.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="user-list__user-actions">
                  <button
                    className="user-list__user-view-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(user);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!isSearching && hasMore && (
            <div className="user-list__load-more">
              <button
                onClick={loadMoreUsers}
                disabled={loading}
                className="user-list__load-more-button"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

UserList.propTypes = {
  client: PropTypes.object.isRequired,
  projectAddress: PropTypes.string.isRequired,
  className: PropTypes.string,
  onUserSelect: PropTypes.func,
};

export default UserList;
