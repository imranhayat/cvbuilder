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
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    phone: '',
    email: '',
    address: '',
    professionalSummary: '',
    education: [],
    experience: [],
    skills: ['Communication Skills', 'Time Management', 'Problem Solving', 'Hardworking'],
    certifications: [],
    languages: [],
    hobbies: [],
    references: []
  });
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save functionality - Updated for deployment
  const autoSave = async () => {
    if (!hasUnsavedChanges || !formData.name?.trim()) return;

    try {
      setAutoSaveStatus('Saving...');
      
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
  // Removed localStorage loading - form data will reset on page reload

  // Removed localStorage saving on page unload - form data will reset on page reload

  // Auto-save happens automatically every 10 seconds

  // Clear draft function
  const clearDraft = () => {
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

  // Handle "Make a new CV" button
  const handleMakeNewCV = () => {
    setFormData({
      name: '',
      position: '',
      phone: '',
      email: '',
      address: '',
      professionalSummary: '',
      education: [],
      experience: [],
      skills: ['Communication Skills', 'Time Management', 'Problem Solving', 'Hardworking'],
      certifications: [],
      languages: [],
      hobbies: [],
      references: []
    });
    setHasUnsavedChanges(false);
    setAutoSaveStatus('');
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
    // Reset form data for new CV
    handleMakeNewCV();
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
              {!autoSaveStatus && !hasUnsavedChanges && (
                <span className="status-indicator success">
                  All changes saved
                </span>
              )}
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