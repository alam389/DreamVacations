import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../navbar/NavBar.css';

const UserNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token from local storage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">DreamVacations</Link>
        <div className="navbar-buttons">
          <Link to="/update-password" className="navbar-button">Update Password</Link>
          <button onClick={handleLogout} className="navbar-button navbar-button-primary">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;