import React, { useState} from 'react';
import NavBar from '../navbar/NavBar';
import PublicLists from '../publiclist/publiclist.jsx';
import './guest_access.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const GuestAccess = () => {
  const [searchType, setSearchType] = useState('destination');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsCount, setResultsCount] = useState('5');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/search/${searchType}/${searchQuery}/${resultsCount}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Search results:', data);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    }

    console.log('Search submitted:', { searchType, searchQuery, resultsCount });
  };

  const handleDDGSearch = (destination) => {
    const query = encodeURIComponent(destination);
    const url = `https://duckduckgo.com/?q=${query}`;
    window.open(url, '_blank');
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
        </form>

        {/* Map container */}
        <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {results.map((destination, index) => (
            <Marker key={index} position={[destination.latitude, destination.longitude]}>
              <Popup>
                <b>{destination.destination}</b><br />{destination.country}
                <b>Region:</b> {destination.region}<br />
                <b>Cultural Significance:</b> {destination.cultural_significance}<br />
                <b>Safety:</b> {destination.safety}<br />
                <b>Approximate Annual Tourists:</b> {destination.approximate_annual_tourists}<br />
                <b>Best Time to Visit:</b> {destination.best_time_to_visit}<br />
                <b>Category:</b> {destination.category}<br />
                <b>Cost of Living:</b> {destination.cost_of_living}<br />
                <b>Currency:</b> {destination.currency}<br />
                <b>Description:</b> {destination.description}<br />
                <b>Famous Foods:</b> {destination.famous_foods}<br />
                <b>Language:</b> {destination.language}<br />
                <b>Majority Religion:</b> {destination.majority_religion}<br />
                <button onClick={() => handleDDGSearch(destination.destination)}>
                  Search on DDG
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Display search results */}
        <ul>
          {results.map((destination, index) => (
            <li key={index}>
              {destination.destination}, {destination.country}
              <button onClick={() => handleDDGSearch(destination.destination)}>
                Search on DDG
              </button>
            </li>
          ))}
        </ul>

        {/* Display public lists */}
        <PublicLists />
      </div>
    </div>
  );
};

export default GuestAccess;