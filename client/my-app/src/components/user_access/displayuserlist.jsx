import React, { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
import { Edit2, Eye, Trash2, Check, X } from 'lucide-react';
import './DisplayUserList.css';

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
   
      <div className="user-lists-container">
        <h1 className="user-lists-title">Your Travel Lists</h1>
        
        <div className="user-lists-grid">
          {userLists.map((list) => (
            <div key={list.id} className="list-card">
              <div className="list-card-header">
                {isEditing.listname && selectedList === list.id ? (
                  <input
                    type="text"
                    name="listname"
                    value={editListDetails.listname}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="list-card-input"
                    autoFocus
                  />
                ) : (
                  <h3 className="list-card-title">{list.listname}</h3>
                )}
                <div className="list-card-actions">
                  <button className="action-button" onClick={() => handleEditList(list)} aria-label="Edit list">
                    <Edit2 size={18} />
                  </button>
                  <button className="action-button" onClick={() => handleListClick(list.id)} aria-label="View list">
                    <Eye size={18} />
                  </button>
                  {selectedList === list.id && (
                    <button className="action-button" onClick={handleDeleteSelectedList} aria-label="Delete list">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              {isEditing.description && selectedList === list.id ? (
                <textarea
                  name="description"
                  value={editListDetails.description}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="list-card-textarea"
                  autoFocus
                />
              ) : (
                <p className="list-card-description">{list.description}</p>
              )}
              {isEditing.listname || isEditing.description ? (
                <div className="edit-actions">
                  <button className="confirm-button" onClick={handleUpdateList} aria-label="Confirm changes">
                    <Check size={18} />
                  </button>
                  <button className="cancel-button" onClick={() => setIsEditing({ listname: false, description: false })} aria-label="Cancel changes">
                    <X size={18} />
                  </button>
                </div>
              ) : null}
              {selectedList === list.id && (
                <div className="destination-list">
                  {destinationDetails.map((destination) => (
                    <div key={destination.destination_id} className="destination-item">
                      <div className="destination-info">
                        <h4 className="destination-name">{destination.destination}</h4>
                        <p className="destination-country">{destination.country}</p>
                        <p className="destination-description">{destination.description}</p>
                      </div>
                      <button 
                        className="delete-destination-button"
                        onClick={() => handleDeleteDestination(list.id, destination.destination_id)}
                        aria-label="Delete destination"
                      >
                        <Trash2 size={16} />
                      </button>
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