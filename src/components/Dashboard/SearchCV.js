import React, { useState } from 'react';
import './SearchCV.css';

const SearchCV = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Placeholder for search functionality
    console.log('Searching for:', searchTerm);
    // For now, just show a placeholder message
    setSearchResults([]);
  };

  return (
    <div className="search-cv-container">
      <div className="search-cv-header">
        <button onClick={onBack} className="back-button">
          ← Back to Dashboard
        </button>
        <h2>Search for Existing CV</h2>
        <p className="search-description">Find and edit your previously created CVs</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by name, title, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SearchCV;
