import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import Modal from './email-verified.jsx';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    navigate('/guest_access');
  };

  const handleResendEmail = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/public/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Verification email resent successfully.');
      } else {
        alert(data.error || 'Failed to resend verification email.');
      }
    } catch (err) {
      console.log(err);
      alert('An error occurred while resending the verification email.');
    }
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

        if (response.ok) {
          if (!data.email_verified) {
            setModalMessage('Please verify your email to continue.');
            setShowModal(true);
            return;
          }
          localStorage.setItem('token', data.token); // Store the JWT token
          navigate('/useraccess'); // Redirect to useraccess site
        } else {
          alert(data.error || 'Login failed.');
        }
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
          body: JSON.stringify({ email, username, password }),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          alert('Registration successful! Please check your email to verify your account.');
          setIsLogin(true); // Switch to login view after successful registration
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
          {isLogin ? "Don't have an account? " : "Already have an account? "}
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
              <p><strong>Security and Privacy Policy</strong></p>
              <p>Effective Date: [2022-01-01]</p>
              <p>Last Updated: [2024-11-23]</p>
              <p>We are committed to protecting your personal information and maintaining your privacy. Our Security and Privacy Policy outlines how we collect, use, and safeguard your data:</p>
              <p><strong>Data Collection and Usage</strong></p>
              <p>We collect only necessary information, such as your name, email address, and usage data, for account creation and improving our services.</p>
              <p>Your data is never sold to third parties.</p>
              <p><strong>Data Protection</strong></p>
              <p>All sensitive data is encrypted during transmission using TLS/SSL protocols.</p>
              <p>We implement industry-standard security measures, including firewalls, access control, and regular security audits, to prevent unauthorized access.</p>
              <p><strong>User Rights</strong></p>
              <p>You can request to view, modify, or delete your personal data by contacting us at [alam389@uwo.ca].</p>
              <p><strong>Cookies</strong></p>
              <p>We use cookies for authentication and analytics to improve your user experience.</p>
              <p><strong>Acceptable Use Policy (AUP)</strong></p>
              <p>Effective Date: [2022-01-01]</p>
              <p>Last Updated: [2024-11-23]</p>
              <p>This Acceptable Use Policy governs your use of our platform. By accessing our services, you agree to adhere to the following guidelines:</p>
              <p><strong>Prohibited Activities</strong></p>
              <p>You may not use our services to upload, share, or distribute content that is illegal, harmful, or abusive.</p>
              <p>Unauthorized access to accounts, systems, or data is strictly prohibited.</p>
              <p><strong>Resource Usage</strong></p>
              <p>Activities that excessively consume bandwidth, storage, or computing resources are not allowed.</p>
              <p><strong>Compliance</strong></p>
              <p>Users must comply with all local, national, and international laws when using our platform.</p>
              <p>Failure to adhere to this policy may result in account suspension or termination.</p>
              <p><strong>DMCA Notice & Takedown Policy</strong></p>
              <p>Effective Date: [2022-01-01]</p>
              <p>Last Updated: [2024-11-23]</p>
              <p>We respect the intellectual property rights of others. If you believe your copyrighted work has been infringed on our platform, please follow the steps below:</p>
              <p><strong>Filing a DMCA Notice</strong></p>
              <p>Submit your claim in writing to [jacketforsales@gmail.com] with the following details:</p>
              <ul>
                <li>Your contact information.</li>
                <li>A description of the copyrighted work being infringed.</li>
                <li>The URL of the infringing material.</li>
                <li>A statement of good faith belief that the use is unauthorized.</li>
                <li>A statement under penalty of perjury that your claim is accurate.</li>
              </ul>
              <p><strong>Counter-Notice</strong></p>
              <p>If you believe a takedown was in error, submit a counter-notice to the same email address with:</p>
              <ul>
                <li>Your contact information.</li>
                <li>A statement under penalty of perjury that the content was removed in error.</li>
              </ul>
              <p>We will act on all valid takedown notices promptly. Repeated copyright violations may result in account termination.</p>
            </div>
            <button className="close-button" onClick={toggleTermsModal}>
              Close
            </button>
          </div>
        </div>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onResend={handleResendEmail}
        message={modalMessage}
      />
    </div>
  );
};

export default Login;
