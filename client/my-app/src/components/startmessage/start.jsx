import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './start.css'; // Add your styles here

const Start = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/login'); // Navigate to the Login component
    }

    return (
        <div className="start-container">
            <h1>Welcome to My Website</h1>
            <p>This is an app to save and share your go-to dream vacations!</p>
            <button onClick={handleStart} className="start-button">
                Start
            </button>
        </div>
    );
};

export default Start;