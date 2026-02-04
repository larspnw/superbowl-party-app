import React from 'react';
import './CategoryPicker.css';

interface CategoryPickerProps {
  coupleName: string;
  onSelect: (categoryId: string) => void;
  onCancel: () => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ coupleName, onSelect, onCancel }) => {
  const categories = [
    { id: 'appetizers', name: '🍤 Appetizers', emoji: '🍤' },
    { id: 'sides', name: '🥗 Sides', emoji: '🥗' },
    { id: 'main', name: '🍖 Main Dishes', emoji: '🍖' },
    { id: 'desserts', name: '🍰 Desserts', emoji: '🍰' }
  ];

  return (
    <div className="category-picker-overlay" onClick={onCancel}>
      <div className="category-picker-modal" onClick={(e) => e.stopPropagation()}>
        <h3>What's {coupleName} bringing?</h3>
        <div className="category-picker-options">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="category-picker-btn"
              onClick={() => onSelect(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button className="category-picker-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategoryPicker;