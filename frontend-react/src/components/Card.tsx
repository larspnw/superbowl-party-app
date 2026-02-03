import React from 'react';
import { Card as CardType } from '../types';
import './Card.css';

interface CardProps {
  card: CardType;
  isPreMade?: boolean;
}

const Card: React.FC<CardProps> = ({ card, isPreMade = false }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(card));
  };

  return (
    <div
      className={`card ${isPreMade ? 'pre-made' : ''}`}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="card-title">{card.couple_name}</div>
      <div className="card-dish">{card.dish_name}</div>
      {card.dietary_restrictions && card.dietary_restrictions !== 'None' && (
        <div className="card-dietary">{card.dietary_restrictions}</div>
      )}
      {isPreMade && (
        <div className="pre-made-badge">Drag to assign</div>
      )}
    </div>
  );
};

export default Card;