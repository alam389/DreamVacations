import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { ListPlus, Eye, EyeOff } from 'lucide-react';
import './CreateFormList.css';

const CreateListForm = ({ handleCreateList }) => {
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true); // State to manage list visibility

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

  // Handle list name change
  const handleListNameChange = (e) => {
    const input = e.target.value;
    // Remove disallowed characters
    const sanitizedInput = input.replace(invalidChars, '');
    setNewListName(DOMPurify.sanitize(sanitizedInput));
  };

  // Handle list description change
  const handleListDescriptionChange = (e) => {
    const input = e.target.value;
    // Optionally remove disallowed characters from description
    const sanitizedInput = input.replace(invalidChars, '');
    setNewListDescription(DOMPurify.sanitize(sanitizedInput));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitizedListName = sanitizeInput(newListName);
    const sanitizedListDescription = sanitizeInput(newListDescription);

    // Validate list name
    if (!isValidInput(sanitizedListName)) {
      alert('List name contains invalid characters. Please remove them and try again.');
      return; // Prevent submission
    }

    // Validate list description if necessary
    if (newListDescription && !isValidInput(sanitizedListDescription)) {
      alert('List description contains invalid characters. Please remove them and try again.');
      return; // Prevent submission
    }

    // Proceed to create the list
    handleCreateList(sanitizedListName, sanitizedListDescription, isPublic);

    // Reset form fields
    setNewListName('');
    setNewListDescription('');
    setIsPublic(true);
  };

 return (
    <div className="list-creator">
      <h2 className="list-creator__title">Create a New List</h2>
      <form className="list-creator__form" onSubmit={handleSubmit}>
        <div className="list-creator__input-group">
          <input
            type="text"
            placeholder="List Name"
            value={newListName}
            onChange={handleListNameChange}
            className="list-creator__input"
            required
          />
        </div>
        <div className="list-creator__input-group">
          <textarea
            placeholder="Description (optional)"
            value={newListDescription}
            onChange={handleListDescriptionChange}
            className="list-creator__textarea"
          />
        </div>
        <div className="list-creator__visibility">
          <label className="list-creator__visibility-option">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={isPublic === true}
              onChange={() => setIsPublic(true)}
              className="list-creator__radio"
            />
            <Eye size={18} />
            Public
          </label>
          <label className="list-creator__visibility-option">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={isPublic === false}
              onChange={() => setIsPublic(false)}
              className="list-creator__radio"
            />
            <EyeOff size={18} />
            Private
          </label>
        </div>
        <button type="submit" className="list-creator__submit">
          <ListPlus size={18} />
          Create List
        </button>
      </form>
    </div>
  );
};


export default CreateListForm;
