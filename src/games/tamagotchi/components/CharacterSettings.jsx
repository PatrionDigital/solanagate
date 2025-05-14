import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "@windmill/react-ui";
import { FaTrash } from "react-icons/fa";

const CharacterSettings = ({ currentName, onRename, onReset, onClose }) => {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");

  const handleRename = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    onRename(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-gray-900 border border-gold rounded-lg p-6 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gold text-xl font-bold">&times;</button>
        <h3 className="text-xl text-gold font-bold mb-4">Character Settings</h3>
        <form onSubmit={handleRename}>
          <label className="block text-white mb-2">Change Name</label>
          <Input
            className="mb-3"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter new name"
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <Button type="submit" className="bg-gold text-black font-bold w-full mb-4 focus:ring-2 focus:ring-gold/50">Save Name</Button>
        </form>
        <div className="border-t border-gray-700 pt-4 mt-2">
          <Button onClick={onReset} className="bg-red-700 w-full flex items-center justify-center gap-2">
            <FaTrash /> Reset Pet
          </Button>
        </div>
      </div>
    </div>
  );
};

CharacterSettings.propTypes = {
  currentName: PropTypes.string.isRequired,
  onRename: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CharacterSettings;
