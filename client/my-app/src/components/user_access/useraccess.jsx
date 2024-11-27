import React, { useState, useEffect } from 'react';
import NavBar from './usernavbar.jsx';
import PublicLists from '../publiclist/publiclist.jsx';
import CreateListForm from './createlist.jsx'; // Import the new CreateListForm component\
import UserList from './displayuserlist.jsx'; // Import the new UserList component
import DestinationMap from './destinationmap.jsx';

import './user_access.css';

const UserAccess = () => {
  const [searchType, setSearchType] = useState('destination');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsCount, setResultsCount] = useState('5');
  const [results, setResults] = useState([]);
  const [userLists, setUserLists] = useState([]); // State to manage user's lists
  const [selectedList, setSelectedList] = useState(''); // State to manage selected list

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

  const handleCreateList = async (listname, description, isPublic) => {
    try {
      const response = await fetch('http://localhost:3000/api/user/list/create_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token
        },
        body: JSON.stringify({ listname, description, visibility: isPublic }),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('List created:', data);
      setUserLists([...userLists, data]); // Add the new list to the user lists
    } catch (error) {
      console.error('Failed to create list:', error);
    }
  };

  // Fetch user lists when the component mounts
  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/list/getalllists', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token
          },
        });

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUserLists(data);
      } catch (error) {
        console.error('Failed to fetch user lists:', error);
      }
    };

    fetchUserLists();
  }, []);

  return (
    <div className="user-access">
      <NavBar />
      <div className="content-wrapper">
        <h1>Welcome</h1>
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
        <DestinationMap
          results={results}
          userLists={userLists}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />

        {/* Create a new list */}
        <CreateListForm handleCreateList={handleCreateList} />
        <UserList/>
        {/* Display public lists */}
        <PublicLists />
      </div>
    </div>
  );
};

export default UserAccess;