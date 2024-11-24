import React from 'react';
import './guest_access.css';

const GuestAccess = () => {
  return (
    <div className="guest-access">
      <h1>Search</h1>
      <div>
        <form id="searchForm">
          <label htmlFor="searchType">Search by:</label>
          <input
            type="radio"
            id="searchCity"
            name="searchType"
            value="Destination"
            defaultChecked
          />
          <label htmlFor="searchCity">City</label>
          <input
            type="radio"
            id="searchRegion"
            name="searchType"
            value="Region"
          />
          <label htmlFor="searchRegion">Region</label>
          <input
            type="radio"
            id="searchCountry"
            name="searchType"
            value="Country"
          />
          <label htmlFor="searchCountry">Country</label>

          <input
            type="text"
            id="searchQuery"
            name="searchQuery"
            placeholder="Enter your search query"
          />
          <button type="submit" id="submitForm">
            Search
          </button>
          <select name="selectNum" id="selectNum">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </form>
      </div>

      <div id="map"></div>
        
     
    </div>
  );
};

export default GuestAccess;
