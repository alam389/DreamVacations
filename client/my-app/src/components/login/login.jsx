import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './login.css';
import Modal from './email-verified.jsx';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

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
      const response = await fetch(`${apiUrl}/public/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: DOMPurify.sanitize(username) }),
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

  const isValidUsername = (username) => {
    // Disallow a comprehensive list of symbols
    const invalidChars = /[<>\/\\'";{}()=&%!@#$^*|~`]/;
    return !invalidChars.test(username);
  };

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const handleUsernameChange = (e) => {
    const input = e.target.value;
    // Remove disallowed characters
    const sanitizedInput = input.replace(/[<>\/\\'";{}()=&%!@#$^*|~`]/g, '');
    setUsername(DOMPurify.sanitize(sanitizedInput));
  };

  const handleEmailChange = (e) => {
    const input = e.target.value;
    const sanitizedInput = DOMPurify.sanitize(input);
    setEmail(sanitizedInput);
  };

  const handlePasswordChange = (e) => {
    const input = e.target.value;
    const sanitizedInput = DOMPurify.sanitize(input);
    setPassword(sanitizedInput);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedEmail = sanitizeInput(email);

    // Validate username
    if (!isValidUsername(sanitizedUsername)) {
      alert('Username contains invalid characters. Please remove them and try again.');
      return; // Prevent submission
    }

    if (isLogin) {
      console.log('Login:', { sanitizedUsername, sanitizedPassword });
      try {
        const response = await fetch(`${apiUrl}/public/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: sanitizedUsername, password: sanitizedPassword }),
        });
        const data = await response.json();

        if (response.ok) {
          if (data.is_disabled) {
            alert('Please contact admin to enable your account.');
            return; // Prevent further actions
          }
          if (!data.email_verified) {
            setModalMessage('Please verify your email to continue.');
            setShowModal(true);
            return;
          }
          localStorage.setItem('token', data.token); // Store the JWT token
          localStorage.setItem('is_admin', data.is_admin); // Store the admin status

          if (data.is_admin) {
            navigate('/admindashboard'); // Redirect to AdminDashboard if user is admin
          } else {
            navigate('/useraccess'); // Redirect to useraccess site if user is not admin
          }
        } else {
          alert(data.error || 'Login failed.');
        }
      } catch (err) {
        console.log(err);
        alert('An error occurred during login.');
      }
    } else {
      console.log('Signup:', { sanitizedEmail, sanitizedUsername, sanitizedPassword });
      try {
        const response = await fetch(`${apiUrl}/public/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: sanitizedEmail, username: sanitizedUsername, password: sanitizedPassword }),
        });
        const data = await response.json();

        if (response.ok) {
          alert('Registration successful! Please check your email to verify your account.');
          setIsLogin(true); // Switch to login view after successful registration
        } else {
          alert(data.error || 'Registration failed.');
        }
      } catch (err) {
        console.log(err);
        alert('An error occurred during registration.');
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
                onChange={handleEmailChange}
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
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
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
