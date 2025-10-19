import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './SearchCV.css';
import { useCVs } from '../Supabase';
import { cvService } from '../Supabase/supabase';

const SearchCV = ({ onBack, onEditCV }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [useClientSearch, setUseClientSearch] = useState(true);
  const [loadingCV, setLoadingCV] = useState(null);
  const { cvs, searchCVs, fetchCompleteCV, loading, error } = useCVs();
  const searchTimeoutRef = useRef(null);
  const searchCacheRef = useRef(new Map());

  // Client-side search function (much faster for small datasets)
  const performClientSearch = useCallback((term, allCVs) => {
    if (!term.trim()) {
      return allCVs;
    }

    const lowerTerm = term.toLowerCase();
    return allCVs.filter(cv => {
      const name = cv.name?.toLowerCase() || '';
      const title = cv.title?.toLowerCase() || '';
      const company = cv.company?.toLowerCase() || '';
      const phone = cv.cv_data?.personal_info?.phone?.toLowerCase() || '';
      const email = cv.cv_data?.personal_info?.email?.toLowerCase() || '';
      
      return name.includes(lowerTerm) || 
             title.includes(lowerTerm) || 
             company.includes(lowerTerm) ||
             phone.includes(lowerTerm) ||
             email.includes(lowerTerm);
    });
  }, []);

  // Server-side search function (for large datasets or complex queries)
  const performServerSearch = useCallback(async (term) => {
    // Check cache first
    if (searchCacheRef.current.has(term)) {
      return searchCacheRef.current.get(term);
    }

    try {
      setIsSearching(true);
      const results = await searchCVs(term);
      
      // Cache the results
      searchCacheRef.current.set(term, results);
      
      // Limit cache size to prevent memory issues
      if (searchCacheRef.current.size > 50) {
        const firstKey = searchCacheRef.current.keys().next().value;
        searchCacheRef.current.delete(firstKey);
      }
      
      return results;
    } catch (err) {
      console.error('Search error:', err);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [searchCVs]);

  // Optimized search function that chooses between client and server search
  const performSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults(cvs);
      return;
    }

    // Use client-side search for small datasets (< 100 CVs) or short search terms
    if (useClientSearch && cvs.length < 100) {
      const results = performClientSearch(term, cvs);
      setSearchResults(results);
      return;
    }

    // Use server-side search for larger datasets or complex queries
    const results = await performServerSearch(term);
    setSearchResults(results);
  }, [cvs, useClientSearch, performClientSearch, performServerSearch]);

  // Handle search input change with optimized debouncing
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Use shorter debounce for client search, longer for server search
    const debounceDelay = useClientSearch ? 150 : 300;
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, debounceDelay);
  }, [performSearch, useClientSearch]);

  // Memoized search results to prevent unnecessary re-renders
  const memoizedSearchResults = useMemo(() => {
    return searchResults.map((cv) => {
      const phoneNumber = cv.cv_data?.personal_info?.phone || 'No phone number';
      return {
        ...cv,
        phoneNumber
      };
    });
  }, [searchResults]);

  const handleCVClick = async (cv) => {
    if (onEditCV) {
      try {
        setLoadingCV(cv.id);
        // Load complete CV data when user clicks to edit
        const completeCV = await fetchCompleteCV(cv.id);
        if (completeCV) {
          onEditCV(completeCV);
        } else {
          console.error('Failed to load complete CV data');
          // Fallback to lightweight data
          onEditCV(cv);
        }
      } catch (error) {
        console.error('Error loading complete CV:', error);
        // Fallback to lightweight data
        onEditCV(cv);
      } finally {
        setLoadingCV(null);
      }
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
      {memoizedSearchResults.length > 0 && (
        <div className="search-results">
          <div className="search-results-header">
            <h3>Search Results ({memoizedSearchResults.length})</h3>
            <div className="search-performance-info">
              <span className={`search-mode ${useClientSearch ? 'client-mode' : 'server-mode'}`}>
                {useClientSearch ? '⚡ Client Search' : '🌐 Server Search'}
              </span>
              <span className="optimization-indicator">
                🚀 Lightweight Loading
              </span>
              {cvs.length >= 100 && (
                <button 
                  className="toggle-search-mode"
                  onClick={() => setUseClientSearch(!useClientSearch)}
                  title="Toggle between client and server search"
                >
                  {useClientSearch ? 'Switch to Server Search' : 'Switch to Client Search'}
                </button>
              )}
            </div>
          </div>
          <div className="results-list">
            {memoizedSearchResults.map((cv) => (
              <div key={cv.id} className={`cv-result-card ${loadingCV === cv.id ? 'loading' : ''}`} onClick={() => handleCVClick(cv)}>
                <div className="cv-info">
                  <h4>{cv.name}</h4>
                  <p className="cv-phone">{cv.phoneNumber}</p>
                </div>
                <div className="cv-actions">
                  {loadingCV === cv.id ? (
                    <div className="loading-spinner-small"></div>
                  ) : (
                    <button 
                      className="delete-icon" 
                      onClick={(e) => handleDeleteCV(cv.id, e)}
                      title="Delete CV"
                    >
                      🗑️
                    </button>
                  )}
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
