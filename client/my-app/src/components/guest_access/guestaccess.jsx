import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import './guest_access.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const GuestAccess = () => {
  const [searchType, setSearchType] = useState('Destination');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsCount, setResultsCount] = useState('5');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
    console.log('Search submitted:', { searchType, searchQuery, resultsCount });
  };

  return (
    <div className="guest-access">
      <NavBar />
      <div className="content-wrapper">
        <h1>Explore Dream Destinations</h1>
        <form id="searchForm" onSubmit={handleSubmit}>
          <div className="search-type">
            <label>Search by:</label>
            <div className="radio-group">
              {['destination', 'region', 'country'].map((type) => (
                <label key={type} className="radio-label">
                  <input
                    type="radio"
                    name="searchType"
                    value={type}
                    checked={searchType === type}
                    onChange={(e) => setSearchType(e.target.value)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="search-input">
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Enter ${searchType.toLowerCase()}`}
            />
            <button type="submit">
              <i className="fas fa-search"></i> Search
            </button>
          </div>
          <div className="results-count">
            <label htmlFor="selectNum">Show results:</label>
            <select
              name="selectNum"
              id="selectNum"
              value={resultsCount}
              onChange={(e) => setResultsCount(e.target.value)}
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num.toString()}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
      <div id="map" className="map-container">
        <MapContainer
          center={[48.8566, 2.3522]} // Coordinates for Paris
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={[48.8566, 2.3522]}>
            <Popup>
              Paris, France
            </Popup>
          </Marker>
          {/* Add more markers or layers as needed */}
        </MapContainer>
      </div>
    </div>
  );
};

export default GuestAccess;
