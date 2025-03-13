import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import useProfile from "@/hooks/useProfile";
import {
  fileToDataUrl,
  uploadProfileImage,
  upsertProfileAttribute,
} from "@/utils/honeycombHelpers";

/**
 * Component for creating or editing a user profile
 */
const ProfileEditor = ({
  isCreate = false,
  client = null,
  onSuccess = () => {},
  onCancel = () => {},
}) => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { profile, createProfile, updateProfile } = useProfile();

  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [attributes, setAttributes] = useState([]);

  // New attribute form fields
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeValue, setNewAttributeValue] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load current profile data into form when available
  useEffect(() => {
    if (profile && !isCreate) {
      setName(profile.data?.name || "");
      setBio(profile.data?.bio || "");
      setImage(profile.data?.image || "");
      setAttributes(profile.data?.attributes || []);

      if (profile.data?.image) {
        setImagePreview(profile.data.image);
      }
    }
  }, [profile, isCreate]);

  // Handle image file selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    try {
      const preview = await fileToDataUrl(file);
      setImagePreview(preview);
    } catch (error) {
      console.error("Error generating image preview:", error);
    }
  };

  // Add a new attribute to the list
  const handleAddAttribute = () => {
    if (!newAttributeName || !newAttributeValue) return;

    const updatedAttributes = upsertProfileAttribute(
      attributes,
      newAttributeName,
      newAttributeValue
    );

    setAttributes(updatedAttributes);
    setNewAttributeName("");
    setNewAttributeValue("");
  };

  // Remove an attribute from the list
  const handleRemoveAttribute = (index) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!publicKey) {
      setError("Wallet not connected");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare profile data
      let profileData = {
        name,
        bio,
        image,
        attributes,
      };

      // Upload image if a new one was selected
      if (imageFile && client) {
        const imageUrl = await uploadProfileImage(imageFile, client);
        profileData.image = imageUrl;
      }

      // Create or update profile
      if (isCreate) {
        await createProfile(profileData);
        setSuccess("Profile created successfully!");
      } else {
        await updateProfile(profileData);
        setSuccess("Profile updated successfully!");
      }

      // Call the success callback
      onSuccess();

      // Navigate away after a delay if this is a create operation
      if (isCreate) {
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.message || "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form
  return (
    <div className="profile-editor">
      <div className="profile-editor__header">
        <h2 className="profile-editor__title">
          {isCreate ? "Create Profile" : "Edit Profile"}
        </h2>
      </div>

      {error && <div className="profile-editor__error">{error}</div>}

      {success && <div className="profile-editor__success">{success}</div>}

      <form onSubmit={handleSubmit} className="profile-editor__form">
        <div className="profile-editor__form-group">
          <label htmlFor="profile-name" className="profile-editor__label">
            Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="profile-editor__input"
            placeholder="Enter your name"
          />
        </div>

        <div className="profile-editor__form-group">
          <label htmlFor="profile-bio" className="profile-editor__label">
            Bio
          </label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="profile-editor__textarea"
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>

        <div className="profile-editor__form-group">
          <label htmlFor="profile-image" className="profile-editor__label">
            Profile Image
          </label>

          {imagePreview && (
            <div className="profile-editor__image-preview">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="profile-editor__preview-img"
              />
            </div>
          )}

          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="profile-editor__file-input"
          />
        </div>

        <div className="profile-editor__form-group">
          <label className="profile-editor__label">Attributes</label>

          <div className="profile-editor__attributes">
            {attributes.map((attr, index) => (
              <div key={index} className="profile-editor__attribute">
                <span className="profile-editor__attribute-name">
                  {attr.trait_type}:
                </span>
                <span className="profile-editor__attribute-value">
                  {attr.value}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(index)}
                  className="profile-editor__attribute-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="profile-editor__add-attribute">
            <input
              type="text"
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
              placeholder="Attribute name"
              className="profile-editor__attribute-input"
            />
            <input
              type="text"
              value={newAttributeValue}
              onChange={(e) => setNewAttributeValue(e.target.value)}
              placeholder="Attribute value"
              className="profile-editor__attribute-input"
            />
            <button
              type="button"
              onClick={handleAddAttribute}
              className="profile-editor__attribute-add"
            >
              Add
            </button>
          </div>
        </div>

        <div className="profile-editor__actions">
          <button
            type="button"
            onClick={onCancel}
            className="profile-editor__cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="profile-editor__submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isCreate
              ? "Create Profile"
              : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

ProfileEditor.propTypes = {
  isCreate: PropTypes.bool,
  client: PropTypes.object,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ProfileEditor;
