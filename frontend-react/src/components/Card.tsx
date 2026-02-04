import React from 'react';
import { Card as CardType } from '../types';
import './Card.css';

interface CardProps {
  card: CardType;
  isPreMade?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ card, isPreMade = false, onClick }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(card));
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger click if not dragging
    if (onClick && !isPreMade) {
      onClick();
    }
  };

  return (
    <div
      className={`card ${isPreMade ? 'pre-made' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <div className="card-title">{card.couple_name}</div>
      <div className="card-dish">{card.dish_name}</div>
      {card.dietary_restrictions && card.dietary_restrictions !== 'None' && card.dietary_restrictions !== '' && (
        <div className="card-dietary">⚠️ {card.dietary_restrictions}</div>
      )}
      {isPreMade && (
        <div className="pre-made-badge">Drag to assign</div>
      )}
    </div>
  );
};

export default Card;