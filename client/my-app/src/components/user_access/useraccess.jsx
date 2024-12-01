import React, { useState, useEffect } from 'react';
import NavBar from './usernavbar.jsx';
import PublicLists from '../publiclist/publiclist.jsx';
import CreateListForm from './createlist.jsx'; // Import the new CreateListForm component\
import UserList from './displayuserlist.jsx'; // Import the new UserList component
import DestinationMap from './destinationmap.jsx';
import DOMPurify from 'dompurify';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

import './user_access.css';

const UserAccess = () => {
  const [searchType, setSearchType] = useState('destination');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsCount, setResultsCount] = useState('5');
  const [results, setResults] = useState([]);
  const [userLists, setUserLists] = useState([]); // State to manage user's lists
  const [selectedList, setSelectedList] = useState(''); // State to manage selected list

  // Define a comprehensive list of invalid characters
  const invalidChars = /[<>\/\\'";{}()=&%!@#$^*|~`]/;

  // Validation function
  const isValidInput = (input) => {
    return !invalidChars.test(input);
  };

  // Sanitize input function
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(invalidChars, '');
    setSearchQuery(DOMPurify.sanitize(sanitizedInput));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedSearchQuery = sanitizeInput(searchQuery);

    // Validate search query
    if (!isValidInput(sanitizedSearchQuery)) {
      alert('Search query contains invalid characters. Please remove them and try again.');
      return; // Prevent submission
    }

    try {
      const response = await fetch(
        `${apiUrl}/search/${searchType}/${encodeURIComponent(sanitizedSearchQuery)}/${resultsCount}`,
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
    const sanitizedListName = sanitizeInput(listname);

    // Validate list name
    if (!isValidInput(sanitizedListName)) {
      alert('List name contains invalid characters. Please remove them and try again.');
      return; // Prevent submission
    }

    try {
      const response = await fetch(`${apiUrl}/user/list/create_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token
        },
        body: JSON.stringify({ listname: sanitizedListName, description, visibility: isPublic }),
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
        const response = await fetch(`${apiUrl}/user/list/getalllists`, {
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
              onChange={handleSearchChange}
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