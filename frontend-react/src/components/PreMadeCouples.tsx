import React from 'react';
import { Card } from '../types';
import CardComponent from './Card';
import './PreMadeCouples.css';

interface PreMadeCouplesProps {
  onAssignCouple: (card: Card) => void;
}

const PreMadeCouples: React.FC<PreMadeCouplesProps> = ({ onAssignCouple }) => {
  const preMadeCouples: Card[] = [
    {
      id: 'pre-steinberg',
      couple_name: 'Steinberg',
      dish_name: 'Click to edit dish',
      dietary_restrictions: 'None',
      category_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'pre-krass',
      couple_name: 'Krass',
      dish_name: 'Click to edit dish',
      dietary_restrictions: 'None',
      category_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'pre-jj',
      couple_name: 'JJ',
      dish_name: 'Click to edit dish',
      dietary_restrictions: 'None',
      category_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'pre-baker',
      couple_name: 'Baker',
      dish_name: 'Click to edit dish',
      dietary_restrictions: 'None',
      category_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'pre-emsky',
      couple_name: 'Emsky',
      dish_name: 'Click to edit dish',
      dietary_restrictions: 'None',
      category_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'pre-eod',
      couple_name: 'EOD',
      dish_name: 'Click to edit dish',
      dietary_restrictions: 'None',
      category_id: '',
      created_at: new Date().toISOString()
    },
    {
      id: 'pre-merckis',
      couple_name: 'Merckis',
      dish_name: 'Click to edit dish',
      dietary_restrictions: 'None',
      category_id: '',
      created_at: new Date().toISOString()
    }
  ];

  const handleCardClick = (card: Card) => {
    // Allow editing the dish name before assigning
    const newDishName = prompt(`What dish is ${card.couple_name} bringing?`, card.dish_name);
    if (newDishName && newDishName.trim()) {
      const updatedCard = { ...card, dish_name: newDishName.trim() };
      onAssignCouple(updatedCard);
    }
  };

  return (
    <div className="pre-made-couples">
      <h3>👥 Pre-Made Couples</h3>
      <p className="pre-made-description">
        Drag these to a category, or click to edit what they're bringing first
      </p>
      <div className="pre-made-grid">
        {preMadeCouples.map((couple) => (
          <div key={couple.id} onClick={() => handleCardClick(couple)}>
            <CardComponent card={couple} isPreMade={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreMadeCouples;