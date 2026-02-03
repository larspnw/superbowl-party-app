import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>🏈 Super Bowl Party Dish Organizer</h1>
      <p className="subtitle">Drag & Drop Your Dishes to the Right Category</p>
    </header>
  );
};

export default Header;