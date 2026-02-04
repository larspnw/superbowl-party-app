import React, { useState } from 'react';
import { Card } from '../types';
import './EditCardModal.css';

interface EditCardModalProps {
  card: Card;
  onSave: (dishName: string, allergies: string) => void;
  onCancel: () => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ card, onSave, onCancel }) => {
  const [dishName, setDishName] = useState(card.dish_name);
  const [allergies, setAllergies] = useState(card.dietary_restrictions || '');

  const handleSubmit = () => {
    if (dishName.trim()) {
      onSave(dishName.trim(), allergies.trim());
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onCancel}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit {card.couple_name}'s Dish</h3>
        
        <div className="edit-input-section">
          <label>Dish Name:</label>
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="edit-input-section">
          <label>Food Allergies: <span className="optional">(optional)</span></label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. nuts, dairy, gluten..."
          />
        </div>

        <div className="edit-actions">
          <button 
            className="edit-save-btn" 
            onClick={handleSubmit}
            disabled={!dishName.trim()}
          >
            Save
          </button>
          <button className="edit-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;