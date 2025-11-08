import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHome = () => {
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">DC20 Character Creator</h1>
        {!isHomePage && (
          <button className="btn btn-outline btn-home" onClick={handleHome}>
            Home
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
