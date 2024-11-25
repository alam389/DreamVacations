import React, { useState, useEffect } from 'react';
import './publiclist.css';

const PublicLists = () => {
    const [publicLists, setPublicLists] = useState([]);
  
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
  
    return (
      <div className="public-lists">
        <h2>Public Destination Lists</h2>
        <div className="lists-container">
          {publicLists.map((list, index) => (
            <div key={index} className="list-card">
              <h3>{list.listname}</h3>
              <div className="list-details">
                <p><strong>Created by:</strong> {list.username}</p>
                <p><strong>Destinations:</strong> {list.destination_count}</p>
                <p><strong>Last modified:</strong> {new Date(list.date_modified).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default PublicLists;