import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHome = () => {
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-gradient-to-r from-brown-accent to-brown-medium text-parchment-light py-6 px-4 shadow-parchment-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="font-title text-3xl md:text-4xl font-bold text-gold m-0">
          DC20 Level 0
        </h1>
        {!isHomePage && (
          <button
            className="bg-parchment-light text-brown-accent px-4 py-2 rounded-ornate font-body font-semibold hover:bg-gold hover:text-brown-text transition-all duration-200 hover:-translate-y-0.5 shadow-parchment text-sm md:text-base"
            onClick={handleHome}
          >
            Home
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
