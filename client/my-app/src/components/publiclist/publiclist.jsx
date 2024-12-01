import React, { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, ChevronRight, Star } from 'lucide-react';
import './publiclist.css';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const PublicLists = () => {
  const [publicLists, setPublicLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [ratings, setRatings] = useState({});
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [currentReviewListId, setCurrentReviewListId] = useState(null);

  useEffect(() => {
    const fetchPublicLists = async () => {
      try {
        const response = await fetch(`${apiUrl}/public/list/getalllists`);
        const data = await response.json();
        setPublicLists(data);
      } catch (error) {
        console.error('Failed to fetch public lists:', error);
      }
    };

    fetchPublicLists();
  }, []);
  const handleWriteReview = (listId) => {
    console.log('Write Review clicked for list ID:', listId);
    if (currentReviewListId === listId) {
      // If the review form is already open for this list, close it
      setCurrentReviewListId(null);
      setShowReviewModal(false);
      setReviewText('');
      setStarRating(0);
    } else {
      setCurrentReviewListId(listId);
      setShowReviewModal(true);
      setReviewText('');
      setStarRating(0);
    }
  };
  const handleViewList = async (list_id) => {
    if (selectedList === list_id) {
      setSelectedList(null);
      setDestinations([]);
      return;
    }

    setSelectedList(list_id);
    try {
      const response = await fetch(`${apiUrl}/public/list/getlistdestinations?list_id=${list_id}`);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const destinationIds = await response.json();

      const destinationResponse = await fetch(`${apiUrl}/public/getdestinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destinationIds),
      });
      if (!destinationResponse.ok) throw new Error(`${destinationResponse.status} ${destinationResponse.statusText}`);

      const destinationsData = await destinationResponse.json();
      setDestinations(destinationsData);

      // Fetch ratings and comments for the selected list
      const ratingsResponse = await fetch(`${apiUrl}/public/ratings?list_id=${list_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!ratingsResponse.ok) throw new Error(`${ratingsResponse.status} ${ratingsResponse.statusText}`);
      const ratingsData = await ratingsResponse.json();
      setRatings((prevRatings) => ({ ...prevRatings, [list_id]: ratingsData }));
    } catch (error) {
      console.error('Failed to fetch destinations or ratings:', error);
    }
  };

  const sanitizeInput = (input) => {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const limitWords = (input, maxWords) => {
    const words = input.split(/\s+/);
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ');
    }
    return input;
  };

  const containsHarmfulSymbols = (input) => {
    const harmfulSymbolsPattern = /<script|<\/script|<|>|&|"/i;
    return harmfulSymbolsPattern.test(input);
  };

  const handleSubmitReview = async (listId) => {
    console.log('Submitting review for list ID:', listId);

    // Check for harmful symbols or script tags
    if (containsHarmfulSymbols(reviewText)) {
      alert('Your review contains harmful symbols or script tags. Please remove them and try again.');
      return;
    }

    // Sanitize and limit the review text
    const sanitizedReviewText = sanitizeInput(reviewText);
    const limitedReviewText = limitWords(sanitizedReviewText, 50); // Limit to 50 words

    try {
      const response = await fetch(`${apiUrl}/user/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          list_id: listId,
          rating: starRating,
          comment: limitedReviewText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review.');
      }

      console.log('Review submitted successfully!');
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

  const renderStarRating = () => (
    <div className="star-rating">
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
  );

  const renderRating = (rating) => (
    <div className="rating">
      <span className="rating-value">{rating.toFixed(1)}</span>
    </div>
  );

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
                <ChevronRight
                  className={`h-4 w-4 ml-1 transition-transform ${
                    selectedList === list.id ? 'rotate-90' : ''
                  }`}
                />
              </button>
            </div>
            <div className="list-details">
              <div className="list-info">
                <Users className="h-4 w-4 mr-2" />
                <span>Curator: {list.username}</span>
              </div>
              <div className="list-info">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Places: {list.destination_count || 0}</span>
              </div>
              <div className="list-info">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Updated: {new Date(list.date_modified).toLocaleDateString()}</span>
              </div>
              <div className="list-info">
                <Star className="h-4 w-4 mr-2" />
                <span>Rating: {renderRating(ratings[list.id]?.averageRating || 0)}</span>
              </div>
              <div className="list-info">
                <span>Comment: {ratings[list.id]?.comment || 'No comments available'}</span>
              </div>
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
                {destinations.map((destination) => (
                  <div key={destination.id} className="destination-item">
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
            {renderStarRating()}
            <textarea
              placeholder="Describe your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="review-textarea"
            />
            <div className="modal-actions">
              <button
                className="submit-button"
                onClick={() => handleSubmitReview(currentReviewListId)}
                disabled={starRating === 0 || reviewText.trim() === ''}
              >
                Submit Review
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setShowReviewModal(false);
                  setCurrentReviewListId(null);
                  setReviewText('');
                  setStarRating(0);
                }}
              >
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
