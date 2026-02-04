import React, { useState } from 'react';
import './CategoryPicker.css';

interface CategoryPickerProps {
  coupleName: string;
  currentDish?: string;
  onSelect: (categoryId: string, dishName: string) => void;
  onCancel: () => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ coupleName, currentDish, onSelect, onCancel }) => {
  const [dishName, setDishName] = useState(currentDish && currentDish !== 'Click to edit dish' ? currentDish : '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'appetizers', name: '🍤 Appetizers' },
    { id: 'sides', name: '🥗 Sides' },
    { id: 'main', name: '🍖 Main Dishes' },
    { id: 'desserts', name: '🍰 Desserts' }
  ];

  const handleSubmit = () => {
    if (selectedCategory && dishName.trim()) {
      onSelect(selectedCategory, dishName.trim());
    }
  };

  return (
    <div className="category-picker-overlay" onClick={onCancel}>
      <div className="category-picker-modal" onClick={(e) => e.stopPropagation()}>
        <h3>What's {coupleName} bringing?</h3>
        
        <div className="dish-input-section">
          <label>Dish Name:</label>
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="Enter dish name..."
            autoFocus
          />
        </div>

        <div className="category-label">Category:</div>
        <div className="category-picker-options">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-picker-btn ${selectedCategory === cat.id ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="picker-actions">
          <button 
            className="category-picker-submit" 
            onClick={handleSubmit}
            disabled={!selectedCategory || !dishName.trim()}
          >
            Add Dish
          </button>
          <button className="category-picker-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPicker;