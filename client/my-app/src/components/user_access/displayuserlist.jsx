import React, { useState, useEffect } from 'react';

const DisplayUserList = () => {
  const [userLists, setUserLists] = useState([]); // State to manage user's lists
  const [selectedList, setSelectedList] = useState(null); // State to manage selected list
  const [destinationDetails, setDestinationDetails] = useState([]); // State to manage destination details

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

  const handleListClick = async (list_id) => {
    setSelectedList(list_id);
    try {
      const response = await fetch(`http://localhost:3000/api/user/list/getlistdestinations?list_id=${list_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const destinationIds = await response.json();

      const destinationResponse = await fetch('http://localhost:3000/api/public/getdestinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(destinationIds),
      });

      if (!destinationResponse.ok) {
        throw new Error(`${destinationResponse.status} ${destinationResponse.statusText}`);
      }

      const destinationData = await destinationResponse.json();
      setDestinationDetails(destinationData);
    } catch (error) {
      console.error('Failed to fetch destination details:', error);
    }
  };

  return (
    <div className="public-lists">
      <h1>Display User List</h1>
      <div className="user-lists">
        {userLists.map((list, index) => (
          <div key={index} className="list-item" onClick={() => handleListClick(list.id)}>
            <h3>{list.listname}</h3>
            <p>{list.description}</p>
            {selectedList === list.id && (
              <div className="destination-details">
                {destinationDetails.map((destination, index) => (
                  <div key={index} className="destination-item">
                    <h4>{destination.destination}</h4>
                    <p>{destination.country}</p>
                    <p>{destination.description}</p>
                    {/* Add more fields as needed */}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayUserList;