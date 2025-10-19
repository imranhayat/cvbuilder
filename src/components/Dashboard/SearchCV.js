import React, { useState, useEffect, useRef } from 'react';
import './SearchCV.css';
import { useCVs } from '../Supabase';
import { cvService } from '../Supabase/supabase';

const SearchCV = ({ onBack, onEditCV }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { cvs, searchCVs, loading, error } = useCVs();
  const searchTimeoutRef = useRef(null);

  // Live search function
  const performSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults(cvs);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchCVs(term);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300); // 300ms delay
  };

  const handleCVClick = (cv) => {
    if (onEditCV) {
      onEditCV(cv);
    }
  };

  const handleDeleteCV = async (cvId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      try {
        await cvService.deleteCV(cvId);
        // Remove from search results
        setSearchResults(prev => prev.filter(cv => cv.id !== cvId));
      } catch (error) {
        console.error('Error deleting CV:', error);
        alert('Failed to delete CV. Please try again.');
      }
    }
  };

  // Load all CVs on component mount
  useEffect(() => {
    if (cvs.length > 0) {
      setSearchResults(cvs);
    }
  }, [cvs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
        <div className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Search by name, title, or keywords..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {isSearching && (
              <div className="search-loading">
                <div className="search-spinner"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          <div className="results-list">
            {searchResults.map((cv) => {
              // Extract phone number from CV data
              const phoneNumber = cv.cv_data?.personal_info?.phone || 'No phone number';
              
              return (
                <div key={cv.id} className="cv-result-card" onClick={() => handleCVClick(cv)}>
                  <div className="cv-info">
                    <h4>{cv.name}</h4>
                    <p className="cv-phone">{phoneNumber}</p>
                  </div>
                  <div className="cv-actions">
                    <button 
                      className="delete-icon" 
                      onClick={(e) => handleDeleteCV(cv.id, e)}
                      title="Delete CV"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
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
