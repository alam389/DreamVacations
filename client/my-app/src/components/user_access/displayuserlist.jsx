import React, { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const DisplayUserList = () => {
  const [userLists, setUserLists] = useState([]); // State to manage user's lists
  const [selectedList, setSelectedList] = useState(null); // State to manage selected list
  const [destinationDetails, setDestinationDetails] = useState([]); // State to manage destination details
  const [editListDetails, setEditListDetails] = useState({ listname: '', description: '' }); // State to manage list details for editing
  const [isEditing, setIsEditing] = useState({ listname: false, description: false }); // State to manage editing mode

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

  const handleListClick = async (list_id) => {
    setSelectedList(list_id);
    try {
      const response = await fetch(`${apiUrl}/user/list/getlistdestinations?list_id=${list_id}`, {
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

      const destinationResponse = await fetch(`${apiUrl}/public/getdestinations`, {
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

  const handleDeleteDestination = async (list_id, destination_id) => {
    if (!list_id || !destination_id) {
      console.error('Invalid list_id or destination_id:', list_id, destination_id);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user/list/deletedestination?list_id=${list_id}&destination_id=${destination_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Correct the Content-Type header
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token
        }
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      console.log('Destination deleted successfully');
      // Optionally, you can update the state to remove the deleted destination from the list
      setDestinationDetails(destinationDetails.filter(destination => destination.destination_id !== destination_id));
    } catch (error) {
      console.error('Failed to delete destination:', error);
    }
  };

  const handleEditList = (list) => {
    setEditListDetails({ listname: list.listname, description: list.description });
    setSelectedList(list.id);
    setIsEditing({ listname: true, description: true });
  };

  const handleUpdateList = async () => {
    try {
      const response = await fetch(`${apiUrl}/user/list/updatelist`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token
        },
        body: JSON.stringify({ list_id: selectedList, ...editListDetails }),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      console.log('List updated successfully');
      // Optionally, you can update the state to reflect the updated list details
      setUserLists(userLists.map(list => list.id === selectedList ? { ...list, ...editListDetails } : list));
      setIsEditing({ listname: false, description: false });
    } catch (error) {
      console.error('Failed to update list:', error);
    }
  };
  const handleDeleteSelectedList = async () => {
    if (!selectedList) {
      console.error('No list selected for deletion');
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/user/list/deletelist?list_id=${selectedList}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
  
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
  
      console.log('List deleted successfully');
  
      // Update userLists state to remove the deleted list
      setUserLists(userLists.filter(list => list.id !== selectedList));
  
      // Reset selectedList and destinationDetails
      setSelectedList(null);
      setDestinationDetails([]);
  
    } catch (error) {
      console.error('Failed to delete list:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditListDetails({ ...editListDetails, [name]: value });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdateList();
    }
  };

  return (
    <div className="public-lists">
      <h1>Display User List</h1>
      
      <div className="user-lists">
        {userLists.map((list, index) => (
          <div key={index} className="list-item">
            {isEditing.listname && selectedList === list.id ? (
              <input
                type="text"
                name="listname"
                value={editListDetails.listname}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            ) : (
              <h3>{list.listname}</h3>
            )}
            {isEditing.description && selectedList === list.id ? (
              <textarea
                name="description"
                value={editListDetails.description}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            ) : (
              <p>{list.description}</p>
            )}
            <button onClick={() => handleEditList(list)}>Edit</button>
            <button onClick={() => handleListClick(list.id)}>View</button>
            {selectedList && (
  <button onClick={handleDeleteSelectedList}>Delete Selected List</button>
)}
            {isEditing.listname || isEditing.description ? (
              <button onClick={handleUpdateList}>Confirm</button>
            ) : null}
            {selectedList === list.id && (
              <div className="destination-details">
                {destinationDetails.map((destination, index) => (
                  <div key={index} className="destination-item">
                    <h4>{destination.destination}</h4>
                    <p>{destination.country}</p>
                    <p>{destination.description}</p>
                    {/* Add more fields as needed */}
                    <button onClick={() => handleDeleteDestination(list.id, destination.destination_id)}>Delete</button>
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