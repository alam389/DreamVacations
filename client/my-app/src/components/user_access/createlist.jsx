import React, { useState } from 'react';

const CreateListForm = ({ handleCreateList }) => {
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true); // State to manage list visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateList(newListName, newListDescription, isPublic);
    setNewListName('');
    setNewListDescription('');
    setIsPublic(true);
  };

  return (
    <div className="create-list">
      <h2>Create a New List</h2>
      <form className="create-list-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="List Name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="list-input"
        />
        <textarea
          placeholder="Description (optional)"
          value={newListDescription}
          onChange={(e) => setNewListDescription(e.target.value)}
          className="list-textarea"
        />
        <div className="visibility-toggle">
          <label>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={isPublic === true}
              onChange={() => setIsPublic(true)}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={isPublic === false}
              onChange={() => setIsPublic(false)}
            />
            Private
          </label>
        </div>
        <button type="submit" className="create-button">
          Create List
        </button>
      </form>
    </div>
  );
};

export default CreateListForm;

