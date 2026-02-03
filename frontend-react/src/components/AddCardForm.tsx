import React, { useState } from 'react';
import { Category } from '../types';
import './AddCardForm.css';

interface AddCardFormProps {
  categories: Category[];
  onAddCard: (cardData: any) => void;
  onClose: () => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ categories, onAddCard, onClose }) => {
  const [formData, setFormData] = useState({
    couple_name: '',
    dish_name: '',
    dietary_restrictions: 'None',
    category_id: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.couple_name || !formData.dish_name || !formData.category_id) {
      alert('Please fill in all fields');
      return;
    }

    onAddCard(formData);
    setFormData({
      couple_name: '',
      dish_name: '',
      dietary_restrictions: 'None',
      category_id: ''
    });
  };

  return (
    <div className="add-card-overlay">
      <div className="add-card-form">
        <div className="form-header">
          <h3>Add New Dish</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="couple_name">Couple Name *</label>
            <input
              type="text"
              id="couple_name"
              value={formData.couple_name}
              onChange={(e) => setFormData({...formData, couple_name: e.target.value})}
              required
              placeholder="e.g., John & Jane"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dish_name">Dish Name *</label>
            <input
              type="text"
              id="dish_name"
              value={formData.dish_name}
              onChange={(e) => setFormData({...formData, dish_name: e.target.value})}
              required
              placeholder="e.g., Buffalo Wings"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dietary_restrictions">Dietary Restrictions</label>
            <input
              type="text"
              id="dietary_restrictions"
              value={formData.dietary_restrictions}
              onChange={(e) => setFormData({...formData, dietary_restrictions: e.target.value})}
              placeholder="e.g., Vegetarian, Gluten-Free, None"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Category *</label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.cards.length}/{category.max_items})
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Dish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardForm;