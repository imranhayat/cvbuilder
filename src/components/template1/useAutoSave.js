import { useState, useEffect, useRef } from 'react';
import { cvService, authService, supabase } from '../Supabase/supabase';
import { dbHelpers } from '../Supabase/database';

const useAutoSave = (formData, saveInterval = 10000) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentCVId, setCurrentCVId] = useState(null);
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);

  // Auto-save functionality
  const autoSave = async () => {
    console.log('Auto-save triggered:', { hasUnsavedChanges, name: formData.name?.trim() });
    
    if (!hasUnsavedChanges || !formData.name?.trim()) {
      console.log('Auto-save skipped:', { hasUnsavedChanges, name: formData.name?.trim() });
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
      const cvData = dbHelpers.formatCVData(formData);
      cvData.user_id = user.id;
      cvData.template_id = 'template1'; // Default template
      
      console.log('Formatted CV data:', cvData);

      let savedCV;
      if (currentCVId) {
        console.log('Updating existing CV:', currentCVId);
        // Update existing CV
        savedCV = await cvService.updateCV(currentCVId, cvData);
      } else {
        console.log('Creating new CV...');
        // Create new CV
        savedCV = await cvService.createCV(cvData);
        console.log('New CV created:', savedCV);
        setCurrentCVId(savedCV.id);
      }
      
      // Update last saved data reference
      lastSavedDataRef.current = JSON.stringify(formData);
      setHasUnsavedChanges(false);
      setAutoSaveStatus('Auto-saved to Supabase');
      
      // Clear status after 2 seconds
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (err) {
      console.error('Auto-save error:', err);
      console.error('Error details:', err.message, err.details, err.hint);
      setAutoSaveStatus('Auto-save failed: ' + err.message);
      setTimeout(() => setAutoSaveStatus(''), 5000);
    }
  };

  // Set up auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-save interval check:', { 
        hasUnsavedChanges, 
        name: formData.name?.trim(),
        formDataKeys: Object.keys(formData)
      });
      
      if (hasUnsavedChanges && formData.name?.trim()) {
        console.log('Auto-save conditions met - triggering save');
        autoSave();
      } else {
        console.log('Auto-save skipped - conditions not met');
      }
    }, saveInterval);

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, formData, saveInterval]);

  // Removed localStorage loading - form data will reset on page reload

  // Removed localStorage saving on page unload - form data will reset on page reload

  // Manual save function
  const manualSave = async () => {
    if (hasUnsavedChanges && formData.name?.trim()) {
      await autoSave();
    }
  };

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
      const cvData = await cvService.getCV(cvId);
      setCurrentCVId(cvId);
      return dbHelpers.extractFormData(cvData);
    } catch (err) {
      console.error('Error loading CV:', err);
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
    manualSave,
    clearDraft,
    markAsChanged,
    loadCV,
    createNewCV
  };
};

export default useAutoSave;
