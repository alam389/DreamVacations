import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    navigate('/guest_access');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login:', { username, password });
      try {
        const response = await fetch('http://localhost:3000/api/public/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('Signup:', { email, username, password });
      try {
        const response = await fetch('http://localhost:3000/api/public/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          alert('Check your email to verify your account.');
          window.location.reload();
        } else {
          alert(data.error || 'Registration failed.');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const toggleTermsModal = () => {
    setShowTerms(!showTerms);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
        <p>
          <button className="guest-link" onClick={handleGuestLogin}>
            Continue as Guest
          </button>
        </p>
        {!isLogin && (
          <p className="terms-link">
            By signing up, you agree to our{' '}
            <a href="#!" onClick={toggleTermsModal}>
              Terms and Conditions
            </a>
          </p>
        )}
      </div>

      {showTerms && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Terms and Conditions</h3>
            <div className="modal-content">
              {/* Terms content goes here */}
            </div>
            <button className="close-button" onClick={toggleTermsModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
