import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const DestinationMap = ({ results, userLists, selectedList, setSelectedList }) => {
  const handleDDGSearch = (destination) => {
    const query = encodeURIComponent(destination);
    const url = `https://duckduckgo.com/?q=${query}`;
    window.open(url, '_blank');
  };

  const handleAddToList = async (destinationId) => {
    if (!selectedList) {
      alert('Please select a list');
      return;
    }
    console.log(`Adding destination to list destinationid:${destinationId} list:${selectedList}`);
    try {
      const response = await fetch(`${apiUrl}/user/list/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token
        },
        body: JSON.stringify({list_id:selectedList, destination_id:destinationId}),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Destination added to list:', data);
      alert('Destination added to list successfully');
    } catch (error) {
      console.error('Failed to add destination to list:', error);
    }
  };

  return (
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
            <div>
              <select onChange={(e) => setSelectedList(e.target.value)} value={selectedList}>
                <option value="">Select a list</option>
                {userLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.listname}
                  </option>
                ))}
              </select>
              <button onClick={() => handleAddToList(destination.destination_id)}>Add to List</button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DestinationMap;