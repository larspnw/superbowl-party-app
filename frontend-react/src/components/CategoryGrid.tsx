import React from 'react';
import { Category } from '../types';
import Card from './Card';
import './CategoryGrid.css';

interface CategoryGridProps {
  categories: Category[];
  onDragEnd: (cardId: string, categoryId: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onDragEnd }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      onDragEnd(cardId, categoryId);
    }
  };

  return (
    <div className="categories-grid">
      {categories.map((category) => (
        <div key={category.id} className="category">
          <div className="category-header">
            <h3 className="category-title">{category.name}</h3>
            <span className="category-count">
              {category.cards.length}/{category.max_items}
            </span>
          </div>
          
          <div
            className="cards-container"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category.id)}
          >
            {category.cards.length === 0 ? (
              <div className="empty-category">
                <p>Drop dishes here</p>
              </div>
            ) : (
              category.cards.map((card) => (
                <Card key={card.id} card={card} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;