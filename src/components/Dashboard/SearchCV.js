import React, { useState, useEffect } from 'react';
import './SearchCV.css';
import { useCVs } from '../Supabase';

const SearchCV = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { cvs, searchCVs, loading, error } = useCVs();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchCVs(searchTerm);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Load all CVs on component mount
  useEffect(() => {
    if (cvs.length > 0) {
      setSearchResults(cvs);
    }
  }, [cvs]);

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
            <button type="submit" className="search-button" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          <div className="results-list">
            {searchResults.map((cv) => (
              <div key={cv.id} className="cv-result-card">
                <div className="cv-info">
                  <h4>{cv.name}</h4>
                  <p>{cv.title}</p>
                  <span className="cv-date">
                    Created: {new Date(cv.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="cv-actions">
                  <button className="edit-button">Edit</button>
                  <button className="download-button">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchTerm && searchResults.length === 0 && !isSearching && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No CVs found</h3>
          <p>Try searching with different keywords</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading CVs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      )}

    </div>
  );
};

export default SearchCV;
