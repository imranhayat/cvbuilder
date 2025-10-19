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
import { authService, cvService, supabase } from './components/Supabase/supabase';
import { dbHelpers } from './components/Supabase/database';

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
  // Local state for UI (will be overridden by hook)
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formResetKey, setFormResetKey] = useState(0);

  // Use the useAutoSave hook for Supabase integration
  const { 
    autoSaveStatus: hookAutoSaveStatus, 
    hasUnsavedChanges: hookHasUnsavedChanges, 
    currentCVId,
    manualSave,
    loadCV,
    createNewCV 
  } = useAutoSave(formData);

  // Direct test save function for debugging
  const testSaveDirect = async () => {
    console.log('=== DIRECT TEST SAVE STARTED ===');
    console.log('Form data:', formData);
    
    try {
      // Check authentication
      console.log('Checking authentication...');
      const user = await authService.getCurrentUser();
      console.log('Current user:', user);
      
      if (!user) {
        console.log('❌ No authenticated user found');
        alert('Please log in first to save CV data');
        return;
      }
      
      console.log('✅ User authenticated:', user.email);
      
      // Format CV data
      console.log('Formatting CV data...');
      const cvData = dbHelpers.formatCVData(formData);
      cvData.user_id = user.id;
      cvData.template_id = 'template1';
      
      console.log('Formatted CV data:', cvData);
      
      // Test database connection
      console.log('Testing database connection...');
      const { data: testData, error: testError } = await supabase
        .from('cvs')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Database connection failed:', testError);
        alert('Database connection failed: ' + testError.message);
        return;
      }
      
      console.log('✅ Database connection successful');
      
      // Save CV
      console.log('Saving CV to database...');
      const result = await cvService.createCV(cvData);
      console.log('✅ CV saved successfully:', result);
      
      alert('CV saved successfully! Check your Supabase dashboard.');
      
    } catch (error) {
      console.error('❌ Test save failed:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      alert('Save failed: ' + error.message);
    }
  };

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
    setFormResetKey(prev => prev + 1); // Force form re-render
    createNewCV(); // Reset the hook state
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
              {hookAutoSaveStatus && (
                <span className={`status-indicator ${hookAutoSaveStatus.includes('failed') ? 'error' : 'success'}`}>
                  {hookAutoSaveStatus}
                </span>
              )}
              {hookHasUnsavedChanges && !hookAutoSaveStatus && (
                <span className="status-indicator warning">
                  Unsaved changes
                </span>
              )}
              {!hookAutoSaveStatus && !hookHasUnsavedChanges && (
                <span className="status-indicator success">
                  All changes saved
                </span>
              )}
            </div>
            <button onClick={handleBackToDashboard} className="back-to-dashboard-button">
              Back to Dashboard
            </button>
            <button onClick={testSaveDirect} className="test-save-button" style={{backgroundColor: '#007bff', color: 'white', margin: '0 5px'}}>
              Test Save
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
              key={formResetKey}
              formData={formData}
              updateFormData={updateFormData}
              markAsChanged={markAsChanged}
            /> : 
            <Form2 
              key={formResetKey}
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