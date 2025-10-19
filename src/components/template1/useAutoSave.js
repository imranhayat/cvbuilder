import { useState, useEffect, useRef } from 'react';
import { cvService, authService, supabase } from '../Supabase/supabase';
import { dbHelpers } from '../Supabase/database';

const useAutoSave = (formData, saveInterval = 10000) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentCVId, setCurrentCVId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);

  // Auto-save functionality
  const autoSave = async () => {
    console.log('Auto-save triggered:', { hasUnsavedChanges, name: formData.name?.trim() });
    
    if (!formData.name?.trim()) {
      console.log('Auto-save skipped - no name provided');
      return;
    }

    // Check if data has changed since last save
    const currentDataString = JSON.stringify(formData);
    if (lastSavedDataRef.current === currentDataString) {
      console.log('Auto-save skipped - no changes since last save');
      return;
    }

    try {
      setAutoSaveStatus('Saving...');
      console.log('Starting auto-save process...');
      
      // Get current user
      const user = await authService.getCurrentUser();
      console.log('Current user:', user);
      
      if (!user) {
        console.log('No authenticated user found');
        setAutoSaveStatus('Please log in to save');
        setTimeout(() => setAutoSaveStatus(''), 3000);
        return;
      }

      // Test Supabase connection
      console.log('Testing Supabase connection...');
      try {
        const { data: testData, error: testError } = await supabase
          .from('cvs')
          .select('count')
          .limit(1);
        
        if (testError) {
          console.error('Supabase connection test failed:', testError);
          setAutoSaveStatus('Database connection failed: ' + testError.message);
          setTimeout(() => setAutoSaveStatus(''), 5000);
          return;
        }
        console.log('Supabase connection test successful');
      } catch (testErr) {
        console.error('Supabase connection test error:', testErr);
        setAutoSaveStatus('Database connection test failed: ' + testErr.message);
        setTimeout(() => setAutoSaveStatus(''), 5000);
        return;
      }

      // Format CV data for database
      const cvData = await dbHelpers.formatCVData(formData);
      cvData.user_id = user.id;
      cvData.template_id = 'template1'; // Default template
      
      console.log('Formatted CV data:', cvData);

      let savedCV;
      if (currentCVId) {
        console.log('🔄 Updating existing CV:', currentCVId);
        // Update existing CV
        savedCV = await cvService.updateCV(currentCVId, cvData);
        console.log('✅ CV updated successfully:', savedCV);
      } else {
        console.log('➕ Creating new CV...');
        // Create new CV
        savedCV = await cvService.createCV(cvData);
        console.log('✅ New CV created:', savedCV);
        setCurrentCVId(savedCV.id);
      }
      
      // Update last saved data reference
      lastSavedDataRef.current = JSON.stringify(formData);
      setHasUnsavedChanges(false);
      setAutoSaveStatus('Auto-saved to database');
      
      // Clear status after 2 seconds
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (err) {
      console.error('Auto-save error:', err);
      console.error('Error details:', err.message, err.details, err.hint);
      setAutoSaveStatus('Auto-save failed: ' + err.message);
      setTimeout(() => setAutoSaveStatus(''), 5000);
    }
  };

  // Monitor authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  // Set up auto-save interval
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Auto-save interval stopped - user not authenticated');
      return;
    }
    
    const interval = setInterval(async () => {
      console.log('Auto-save interval check:', { 
        hasUnsavedChanges, 
        name: formData.name?.trim(),
        formDataKeys: Object.keys(formData)
      });
      
      // Double-check authentication before auto-save
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          console.log('Auto-save skipped - user not authenticated');
          setIsAuthenticated(false);
          return;
        }
      } catch (error) {
        console.log('Auto-save skipped - authentication check failed:', error.message);
        setIsAuthenticated(false);
        return;
      }
      
      if (formData.name?.trim()) {
        console.log('Auto-save conditions met - triggering save');
        autoSave();
      } else {
        console.log('Auto-save skipped - no name provided');
      }
    }, saveInterval);

    return () => clearInterval(interval);
  }, [formData, saveInterval, isAuthenticated]);

  // Removed localStorage loading - form data will reset on page reload

  // Removed localStorage saving on page unload - form data will reset on page reload


  // Clear draft function
  const clearDraft = () => {
    setHasUnsavedChanges(false);
    setAutoSaveStatus('');
  };

  // Mark as changed
  const markAsChanged = () => {
    console.log('markAsChanged called - setting hasUnsavedChanges to true');
    setHasUnsavedChanges(true);
  };

  // Load CV data from Supabase
  const loadCV = async (cvId) => {
    try {
      console.log('📥 Loading CV with ID:', cvId);
      const cvData = await cvService.getCV(cvId);
      setCurrentCVId(cvId);
      console.log('✅ CV loaded, currentCVId set to:', cvId);
      const formData = dbHelpers.extractFormData(cvData);
      console.log('📋 Extracted form data:', formData);
      return formData;
    } catch (err) {
      console.error('❌ Error loading CV:', err);
      return null;
    }
  };

  // Create new CV
  const createNewCV = () => {
    setCurrentCVId(null);
    setHasUnsavedChanges(false);
    setAutoSaveStatus('');
  };

  return {
    autoSaveStatus,
    hasUnsavedChanges,
    currentCVId,
    clearDraft,
    markAsChanged,
    loadCV,
    createNewCV
  };
};

export default useAutoSave;
