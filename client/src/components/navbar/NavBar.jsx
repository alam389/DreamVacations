import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">DreamVacations</Link>
        <div className="navbar-buttons">
          <Link to="/login" className="navbar-button">Login</Link>
          <Link to="/login" className="navbar-button navbar-button-primary">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
