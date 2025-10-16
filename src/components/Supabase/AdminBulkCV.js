import React, { useState } from 'react'
import { supabase } from './index'
import './AdminBulkCV.css'

const AdminBulkCV = () => {
  const [cvData, setCvData] = useState({
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    professionalSummary: '',
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    languages: [],
    hobbies: [],
    references: []
  })
  const [isCreating, setIsCreating] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (field, value) => {
    setCvData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayFieldChange = (field, index, value) => {
    setCvData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setCvData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field, index) => {
    setCvData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const createCV = async () => {
    if (!cvData.name.trim()) {
      setErrorMessage('Name is required')
      return
    }

    try {
      setIsCreating(true)
      setErrorMessage('')
      setSuccessMessage('')

      // Get current admin user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError

      // Create CV data structure
      const cvRecord = {
        user_id: user.id, // Admin creates CVs under their account
        name: cvData.name,
        title: cvData.position,
        company: cvData.company,
        template_id: 'template1', // Default template
        cv_data: {
          personal_info: {
            name: cvData.name,
            position: cvData.position,
            phone: cvData.phone,
            email: cvData.email,
            address: cvData.address
          },
          professional_summary: cvData.professionalSummary,
          education: cvData.education.filter(item => item.trim()),
          experience: cvData.experience.filter(item => item.trim()),
          skills: cvData.skills.filter(item => item.trim()),
          certifications: cvData.certifications.filter(item => item.trim()),
          languages: cvData.languages.filter(item => item.trim()),
          hobbies: cvData.hobbies.filter(item => item.trim()),
          references: cvData.references.filter(item => item.trim())
        },
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Insert CV into database
      const { data, error } = await supabase
        .from('cvs')
        .insert([cvRecord])
        .select()
        .single()

      if (error) throw error

      setSuccessMessage(`CV for ${cvData.name} created successfully!`)
      
      // Reset form
      setCvData({
        name: '',
        position: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        professionalSummary: '',
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        languages: [],
        hobbies: [],
        references: []
      })

    } catch (err) {
      console.error('Error creating CV:', err)
      setErrorMessage(`Error creating CV: ${err.message}`)
    } finally {
      setIsCreating(false)
    }
  }

  const renderArrayField = (field, label, placeholder) => (
    <div className="array-field">
      <label>{label}</label>
      {cvData[field].map((item, index) => (
        <div key={index} className="array-item">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayFieldChange(field, index, e.target.value)}
            placeholder={placeholder}
            className="array-input"
          />
          <button
            type="button"
            onClick={() => removeArrayItem(field, index)}
            className="remove-button"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(field)}
        className="add-button"
      >
        Add {label.slice(0, -1)}
      </button>
    </div>
  )

  return (
    <div className="admin-bulk-cv">
      <div className="bulk-cv-header">
        <h2>Create CV for Customer</h2>
        <p>Fill in the details to create a CV for a customer</p>
      </div>

      <div className="bulk-cv-form">
        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={cvData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Position/Title</label>
              <input
                type="text"
                value={cvData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="e.g., Software Developer"
                className="form-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                value={cvData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Company name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={cvData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@example.com"
                className="form-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={cvData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Phone number"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={cvData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Full address"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="form-section">
          <h3>Professional Summary</h3>
          <textarea
            value={cvData.professionalSummary}
            onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
            placeholder="Brief professional summary..."
            className="form-textarea"
            rows={4}
          />
        </div>

        {/* Education */}
        <div className="form-section">
          <h3>Education</h3>
          {renderArrayField('education', 'Education', 'e.g., Bachelor of Computer Science, University Name, 2020')}
        </div>

        {/* Experience */}
        <div className="form-section">
          <h3>Work Experience</h3>
          {renderArrayField('experience', 'Experience', 'e.g., Software Developer at Tech Corp, 2020-2023')}
        </div>

        {/* Skills */}
        <div className="form-section">
          <h3>Skills</h3>
          {renderArrayField('skills', 'Skills', 'e.g., JavaScript, React, Node.js')}
        </div>

        {/* Certifications */}
        <div className="form-section">
          <h3>Certifications</h3>
          {renderArrayField('certifications', 'Certifications', 'e.g., AWS Certified Developer')}
        </div>

        {/* Languages */}
        <div className="form-section">
          <h3>Languages</h3>
          {renderArrayField('languages', 'Languages', 'e.g., English, Spanish')}
        </div>

        {/* Hobbies */}
        <div className="form-section">
          <h3>Hobbies</h3>
          {renderArrayField('hobbies', 'Hobbies', 'e.g., Reading, Photography')}
        </div>

        {/* References */}
        <div className="form-section">
          <h3>References</h3>
          {renderArrayField('references', 'References', 'e.g., References available upon request')}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            onClick={createCV}
            disabled={isCreating || !cvData.name.trim()}
            className="create-cv-button"
          >
            {isCreating ? 'Creating CV...' : `Create CV for ${cvData.name || 'Customer'}`}
          </button>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBulkCV
