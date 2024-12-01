// Modal.jsx
import React from 'react';
import './email-verified.css';

const email_verified = ({ show, onClose, onResend, message }) => {
  if (!show) {
    return null;
  }


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Email Verification Required</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="email-icon">📧</div>
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="resend-button" onClick={onResend}>
            Resend Email
            <span className="button-icon">↺</span>
          </button>
          <button className="close-button-text" onClick={onClose}>
            I'll do it later
          </button>
        </div>
      </div>
    </div>
  );
};

export default email_verified;