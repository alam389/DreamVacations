import React, { useState } from 'react';
import './start.css'; // Add your styles here

const Start = () => {
    const [showModal, setShowModal] = useState(false);

    const handleStart = () => {
        setShowModal(true); // Show the modal when Start is clicked
    };

    const handleCloseModal = () => {
        setShowModal(false); // Hide the modal
    };

    return (
        <div className="start-container">
            <h1>Welcome to My Website</h1>
            <p>This is an app to save and share your go-to dream vacations!</p>
            <button onClick={handleStart} className="start-button">
                Start
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-btn" onClick={handleCloseModal}>
                            ✖
                        </button>
                        <h2>Choose an Option</h2>
                        <div className="modal-actions">
                            <button className="modal-btn">Sign In</button>
                            <button className="modal-btn">Sign Up</button>
                            <button className="modal-btn" onClick={handleCloseModal}>
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Start;