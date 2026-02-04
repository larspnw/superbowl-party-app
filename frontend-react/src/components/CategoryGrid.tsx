import React from 'react';
import { Category, Card as CardType } from '../types';
import Card from './Card';
import './CategoryGrid.css';

interface CategoryGridProps {
  categories: Category[];
  onDragEnd: (cardId: string, categoryId: string, cardData?: any) => void;
  onCardClick?: (card: CardType) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onDragEnd, onCardClick }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    const cardJson = e.dataTransfer.getData('application/json');
    
    if (cardId) {
      // Pass the full card data for pre-made cards
      const cardData = cardJson ? JSON.parse(cardJson) : null;
      onDragEnd(cardId, categoryId, cardData);
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
                <Card key={card.id} card={card} onClick={() => onCardClick?.(card)} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;