import { useState, useEffect, useRef } from 'react';
import { cvService, authService } from '../Supabase/supabase';
import { dbHelpers } from '../Supabase/database';

const useAutoSave = (formData, saveInterval = 10000) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentCVId, setCurrentCVId] = useState(null);
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);

  // Auto-save functionality
  const autoSave = async () => {
    if (!hasUnsavedChanges || !formData.name?.trim()) return;

    try {
      setAutoSaveStatus('Saving...');
      
      // Get current user
      const user = await authService.getCurrentUser();
      if (!user) {
        setAutoSaveStatus('Please log in to save');
        setTimeout(() => setAutoSaveStatus(''), 3000);
        return;
      }

      // Format CV data for database
      const cvData = dbHelpers.formatCVData(formData);
      cvData.user_id = user.id;
      cvData.template_id = 'template1'; // Default template

      let savedCV;
      if (currentCVId) {
        // Update existing CV
        savedCV = await cvService.updateCV(currentCVId, cvData);
      } else {
        // Create new CV
        savedCV = await cvService.createCV(cvData);
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
      setAutoSaveStatus('Auto-save failed');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  };

  // Set up auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges && formData.name?.trim()) {
        autoSave();
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
