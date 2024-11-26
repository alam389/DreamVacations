import React, { useState, useEffect } from 'react';

const DisplayUserList = () => {
  const [userLists, setUserLists] = useState([]); // State to manage user's lists

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
    <div className="user-lists-container">
      <h1>Display User List</h1>
      <div className="user-lists">
        {userLists.map((list, index) => (
          <div key={index} className="list-item">
            <h3>{list.listname}</h3>
            <p>{list.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayUserList;