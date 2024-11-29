import React, { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, ChevronRight, Star } from 'lucide-react';
import './publiclist.css';

const PublicLists = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentDestinationId, setCurrentDestinationId] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(0);

  useEffect(() => {
    const fetchPublicLists = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/public/list/getalllists');
        const data = await response.json();
        setPublicLists(data);
      } catch (error) {
        console.error('Failed to fetch public lists:', error);
      }
    };

    fetchPublicLists();
  }, []);

  const handleViewList = async (list_id) => {
    if (selectedList === list_id) {
      setSelectedList(null);
      setDestinations([]);
      return;
    }

    setSelectedList(list_id);
    try {
      const response = await fetch(`http://localhost:3000/api/public/list/getlistdestinations?list_id=${list_id}`);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const destinationIds = await response.json();

      const destinationResponse = await fetch('http://localhost:3000/api/public/getdestinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destinationIds),
      });
      if (!destinationResponse.ok) throw new Error(`${destinationResponse.status} ${destinationResponse.statusText}`);

      const destinations = await destinationResponse.json();
      setDestinations(destinations);
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    }
  };

  const handleWriteReview = (destination_id) => {
    setCurrentDestinationId(destination_id);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (listId) => {
    console.log('Submitting review for list ID:', listId);
  
    try {
      const response = await fetch('http://localhost:3000/api/user/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          list_id: listId,          // Use the correct list ID
          rating: starRating,
          comment: reviewText,      // Use 'comment' as expected by the backend
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review.');
      }
  
      const data = await response.json();
      console.log('Review submitted:', data);
      alert('Review submitted successfully!');
  
      // Reset the review form
      setShowReviewModal(false);
      setReviewText('');
      setStarRating(0);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(`Failed to submit review: ${error.message}`);
    }
  };
  
  const renderRating = (rating) => {
    return (
      <div className="rating">
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              fill={star <= rating ? "#FFD700" : "none"}
              stroke={star <= rating ? "#FFD700" : "#CBD5E0"}
            />
          ))}
        </div>
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="public-lists">
      <h2 className="text-3xl font-bold mb-6">Explore Curated Destination Lists</h2>
      <div className="lists-container">
        {publicLists.map((list, index) => (
          <div key={index} className="list-card">
            <div className="list-header">
              <h3 className="list-title">{list.listname}</h3>
              <button
                className="view-list-button"
                onClick={() => handleViewList(list.id)}
              >
                {selectedList === list.id ? 'Hide' : 'View'}
                <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${selectedList === list.id ? 'rotate-90' : ''}`} />
              </button>
            </div>
            <div className="list-details">
              <p className="list-info">
                <Users className="h-4 w-4 mr-2" />
                <span>Curator: {list.username}</span>
              </p>
              <p className="list-info">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Places: {list.destinations ? list.destinations.length : 0}</span>
              </p>
              <p className="list-info">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Updated: {new Date(list.date_modified).toLocaleDateString()}</span>
              </p>
              {renderRating(list.rating || 0)}
              <button
                className="write-review-button mt-2"
                onClick={() => handleWriteReview(list.id)}
              >
                Write a Review
              </button>
            </div>
            {selectedList === list.id && (
              <div className="destination-details">
                <h4 className="text-xl font-semibold mb-4">Featured Destinations</h4>
                {destinations.map((destination, index) => (
                  <div key={index} className="destination-item">
                    <h5 className="text-lg font-medium mb-2">{destination.destination}</h5>
                    <p className="destination-info"><strong>Location:</strong> {destination.country}</p>
                    <p className="destination-info">{destination.description}</p>
                    
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showReviewModal && (
        <div className="review-modal">
          <div className="modal-content">
            <h3>Share Your Experience</h3>
            <div className="mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  onClick={() => setStarRating(star)}
                  fill={star <= starRating ? "#FFD700" : "none"}
                  stroke={star <= starRating ? "#FFD700" : "#CBD5E0"}
                  style={{ cursor: 'pointer', marginRight: '4px' }}
                />
              ))}
            </div>
            <textarea
              placeholder="Describe your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="modal-actions">
              <button
                className="submit-button"
                onClick={() => handleSubmitReview(list.id)}  // Pass the correct list ID
                disabled={starRating === 0 || reviewText.trim() === ''}
              >
                Submit Review
              </button>
              <button className="cancel-button" onClick={() => setShowReviewModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicLists;
