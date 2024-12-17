import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Globe, Heart, Share2 } from 'lucide-react';
import './start.css';

const Start = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login');
  };



  return (
    <div className="start-container">
      <div className="content-wrapper">
        <motion.h1 
          className="title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Dream Vacations
        </motion.h1>
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Curate, plan, and share your perfect getaways
        </motion.p>
        <motion.button 
          onClick={handleStart} 
          className="start-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Your Journey <ChevronRight size={20} />
        </motion.button>
      </div>

      <motion.div 
        className="features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="feature">
          <Globe size={32} />
          <h3>Explore</h3>
          <p>Discover hidden gems and popular destinations</p>
        </div>
        <div className="feature">
          <Heart size={32} />
          <h3>Curate</h3>
          <p>Save and organize your dream vacations</p>
        </div>
        <div className="feature">
          <Share2 size={32} />
          <h3>Share</h3>
          <p>Inspire others with your travel plans</p>
        </div>
      </motion.div>

     
    </div>
  );
};

export default Start;
