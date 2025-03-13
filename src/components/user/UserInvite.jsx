import { useState } from "react";
import PropTypes from "prop-types";
import { isValidPublicKey } from "../../utils/honeycombHelpers";

/**
 * Component for inviting users to the platform via wallet address
 */
const UserInvite = ({
  client,
  projectAddress,
  onInviteSent = () => {},
  onError = () => {},
  className = "",
}) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Generate invite link
  const generateInviteLink = () => {
    const origin = window.location.origin;
    const inviteCode = Math.random().toString(36).substring(2, 10);

    return `${origin}/register?invite=${inviteCode}&project=${projectAddress}`;
  };

  // Validate form
  const validateForm = () => {
    if (!walletAddress.trim()) {
      setError("Please enter a wallet address");
      return false;
    }

    if (!isValidPublicKey(walletAddress)) {
      setError("Please enter a valid Solana wallet address");
      return false;
    }

    setError("");
    return true;
  };

  // Send invitation
  const sendInvitation = async (e) => {
    e.preventDefault();

    if (!validateForm() || !client || !projectAddress) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);

    try {
      // Generate invite link that would be sent to the user
      const inviteLink = generateInviteLink();

      // If your API supports sending invites, you would call it here
      // For example:
      /*
      await client.sendInvite({
        project: projectAddress,
        wallet: walletAddress,
        message: message,
        inviteLink: inviteLink
      });
      */

      // Since we don't have a real implementation, simulate success
      // In a real app, you would call your API and handle the response

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setWalletAddress("");
      setMessage("");

      // Call the success callback with invite details
      onInviteSent({
        wallet: walletAddress,
        project: projectAddress,
        message: message,
        inviteLink: inviteLink,
        sentAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
      setError(error.message || "Failed to send invitation");
      onError(error.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`user-invite ${className}`}>
      <div className="user-invite__header">
        <h3 className="user-invite__title">Invite User</h3>
      </div>

      {error && <div className="user-invite__error">{error}</div>}

      {success && (
        <div className="user-invite__success">
          Invitation sent successfully!
        </div>
      )}

      <form onSubmit={sendInvitation} className="user-invite__form">
        <div className="user-invite__form-group">
          <label htmlFor="wallet-address" className="user-invite__label">
            Wallet Address
          </label>
          <input
            id="wallet-address"
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter Solana wallet address"
            className="user-invite__input"
            disabled={isSubmitting}
          />
          <p className="user-invite__hint">
            Enter the Solana wallet address of the user you want to invite.
          </p>
        </div>

        <div className="user-invite__form-group">
          <label htmlFor="invite-message" className="user-invite__label">
            Invitation Message (optional)
          </label>
          <textarea
            id="invite-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a personal message to include with the invitation"
            className="user-invite__textarea"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="user-invite__actions">
          <button
            type="submit"
            className="user-invite__submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </form>

      <div className="user-invite__info">
        <h4 className="user-invite__info-title">About Invitations</h4>
        <p className="user-invite__info-text">
          Invitations will be sent to the provided wallet address. The user will
          receive a unique link to join the platform and create their profile.
        </p>
      </div>
    </div>
  );
};

UserInvite.propTypes = {
  client: PropTypes.object.isRequired,
  projectAddress: PropTypes.string.isRequired,
  onInviteSent: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
};

export default UserInvite;
