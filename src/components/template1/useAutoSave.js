import { useState, useEffect, useRef } from 'react';

const useAutoSave = (formData, saveInterval = 10000) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);

  // Auto-save functionality
  const autoSave = async () => {
    if (!hasUnsavedChanges || !formData.name?.trim()) return;

    try {
      setAutoSaveStatus('Saving...');
      
      // Removed localStorage saving - form data will reset on page reload
      
      // Update last saved data reference
      lastSavedDataRef.current = JSON.stringify(formData);
      setHasUnsavedChanges(false);
      setAutoSaveStatus('Auto-saved');
      
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

  return {
    autoSaveStatus,
    hasUnsavedChanges,
    manualSave,
    clearDraft,
    markAsChanged
  };
};

export default useAutoSave;
