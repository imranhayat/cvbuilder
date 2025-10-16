import React, { useState, useEffect } from 'react';
import './App.css';
import { SupabaseProvider, AdminPanel } from './components/Supabase';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Form1 from './components/template1/Form1';
import Preview1 from './components/template1/Preview1';
import Form2 from './components/template2/Form2';
import Preview2 from './components/template2/Preview2';
import useAutoSave from './components/template1/useAutoSave';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [currentView, setCurrentView] = useState('dashboard');
  const [formData, setFormData] = useState({});
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save functionality
  const autoSave = async () => {
    if (!hasUnsavedChanges || !formData.name?.trim()) return;

    try {
      setAutoSaveStatus('Saving...');
      
      // Save to localStorage as backup
      localStorage.setItem('cvBuilderDraft', JSON.stringify(formData));
      
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
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, formData]);

  // Load saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('cvBuilderDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft.name?.trim()) {
          setFormData(parsedDraft);
          setAutoSaveStatus('Draft loaded');
          setTimeout(() => setAutoSaveStatus(''), 2000);
        }
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    }
  }, []);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasUnsavedChanges && formData.name?.trim()) {
        localStorage.setItem('cvBuilderDraft', JSON.stringify(formData));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, formData]);

  // Manual save function
  const manualSave = async () => {
    if (hasUnsavedChanges && formData.name?.trim()) {
      await autoSave();
    }
  };

  // Clear draft function
  const clearDraft = () => {
    localStorage.removeItem('cvBuilderDraft');
    setHasUnsavedChanges(false);
    setAutoSaveStatus('');
    setFormData({});
  };

  // Mark as changed
  const markAsChanged = () => {
    setHasUnsavedChanges(true);
  };

  // Update form data
  const updateFormData = (newData) => {
    setFormData(newData);
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('cvBuilderAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // Listen for authentication events
    const handleAuth = () => {
      setIsAuthenticated(true);
    };

    window.addEventListener('userAuthenticated', handleAuth);
    
    return () => {
      window.removeEventListener('userAuthenticated', handleAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cvBuilderAuth');
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setCurrentView('cv-builder');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  if (currentView === 'dashboard') {
    return (
      <Dashboard 
        onTemplateSelect={handleTemplateSelect}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'admin') {
    return <AdminPanel />;
  }

  if (currentView === 'cv-builder') {
    return (
      <div className="App">
        <div className="app-header">
          <h1>CV Builder</h1>
          
          <div className="template-selector">
            <button 
              className={`template-button ${selectedTemplate === 'template1' ? 'active' : ''}`}
              onClick={() => setSelectedTemplate('template1')}
            >
              Template 1
            </button>
            <button 
              className={`template-button ${selectedTemplate === 'template2' ? 'active' : ''}`}
              onClick={() => setSelectedTemplate('template2')}
            >
              Template 2
            </button>
          </div>
          
          <div className="header-actions">
            <div className="auto-save-status">
              {autoSaveStatus && (
                <span className={`status-indicator ${autoSaveStatus.includes('failed') ? 'error' : 'success'}`}>
                  {autoSaveStatus}
                </span>
              )}
              {hasUnsavedChanges && !autoSaveStatus && (
                <span className="status-indicator warning">
                  Unsaved changes
                </span>
              )}
              <button 
                onClick={manualSave}
                disabled={!hasUnsavedChanges || !formData.name?.trim()}
                className="save-draft-button"
              >
                Save Draft
              </button>
            </div>
            <button onClick={handleBackToDashboard} className="back-to-dashboard-button">
              Back to Dashboard
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
        <div className="container">
          {/* Form Side */}
          {selectedTemplate === 'template1' ? 
            <Form1 
              formData={formData}
              updateFormData={updateFormData}
              markAsChanged={markAsChanged}
            /> : 
            <Form2 
              formData={formData}
              updateFormData={updateFormData}
              markAsChanged={markAsChanged}
            />
          }

          {/* Preview Side */}
          {selectedTemplate === 'template1' ? 
            <Preview1 
              formData={formData}
              autoSaveStatus={autoSaveStatus}
              hasUnsavedChanges={hasUnsavedChanges}
            /> : 
            <Preview2 
              formData={formData}
              autoSaveStatus={autoSaveStatus}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          }
        </div>
      </div>
    );
  }

  return null;
}

// Wrap the entire app with SupabaseProvider
function AppWithSupabase() {
  return (
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  );
}

export default AppWithSupabase;