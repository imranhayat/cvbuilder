import React from 'react';
import usePreviewHandler from './PreviewHandler1';
import generatePDF from './pdf1';
import './Preview1.css';

function Preview1({ formData: propFormData, autoSaveStatus, hasUnsavedChanges }) {
  const { formData: hookFormData, getProfileImageUrl, formatContactInfo } = usePreviewHandler(propFormData);
  const formData = propFormData || hookFormData;
  const profileImageUrl = getProfileImageUrl;
  const contactInfo = formatContactInfo();
  
  // Debug: Log experience data
  console.log('Preview1 - Experience data:', formData.experience);
  console.log('Preview1 - Experience length:', formData.experience?.length);

  return (
    <div className="right-container">
      <div className="cv-preview">
        {/* CV Header */}
        <div className="cv-header">
          {/* Profile Image Container - Top Left */}
          <div className="profile-image-container">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                No Image
              </div>
            )}
          </div>

          {/* Header Content */}
          <div className="header-content">
            {/* Name */}
            <h1 className="header-name">
              {formData.name}
            </h1>

            {/* Position/Title */}
            <h2 className="header-title">
              {formData.position}
            </h2>

            {/* Contact Information */}
            <div className="header-contact">
              {contactInfo.map((contact, index) => (
                <div key={index} className="contact-item">
                  <span className="contact-icon">{contact.icon}</span>
                  <span>{contact.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Professional Summary Section */}
        {formData.professionalSummary && (
          <div className="cv-section">
            <h3 className="section-heading">Professional Summary</h3>
            <div className="section-content">
              <p className="professional-summary-text">
                {formData.professionalSummary}
              </p>
            </div>
          </div>
        )}

        {/* Education Section */}
        {formData.education && formData.education.length > 0 && (
          <div className="cv-section">
            <h3 className="section-heading">Education</h3>
            <div className="section-content">
              {formData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="education-single-line">
                    <span className="education-degree">{edu.degree}</span>
                    {edu.board && <span className="education-board"> • {edu.board}</span>}
                    {edu.year && <span className="education-year"> • {edu.year}</span>}
                    {edu.marks && <span className="education-marks"> • {edu.marks}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {(formData.experience && formData.experience.length > 0) && (
          <div className="cv-section">
            <h3 className="section-heading">Experience</h3>
            <div className="section-content">
              {formData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <span className="experience-job-title">{exp.jobTitle}</span>
                    {exp.duration && <span className="experience-duration">{exp.duration}</span>}
                  </div>
                  {exp.company && (
                    <div className="experience-company-line">
                      <span className="experience-company">{exp.company}</span>
                    </div>
                  )}
                  {exp.jobDetails && (
                    <div className="experience-details">
                      <ul className="experience-details-list">
                        {exp.jobDetails.split('\n').map((detail, detailIndex) => (
                          detail.trim() && (
                            <li key={detailIndex} className="experience-detail-item">
                              {detail.trim()}
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {formData.certifications && formData.certifications.length > 0 && (
          <div className="cv-section">
            <h3 className="section-heading">Certifications</h3>
            <div className="section-content">
              <div className="certifications-content">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="certification-item">
                    <p className="certification-text">{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {formData.skills && formData.skills.length > 0 && (
          <div className="cv-section">
            <h3 className="section-heading">Skills</h3>
            <div className="section-content">
              <div className="skills-container">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="skill-pill">
                    <span className="skill-name">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Information Section */}
        {formData.otherInfo && formData.otherInfo.length > 0 && (
          <div className="cv-section">
            <h3 className="section-heading">Other Information</h3>
            <div className="section-content">
              <div className="other-info-grid">
                {formData.otherInfo.map((info, index) => (
                  <div key={index} className="info-item">
                    <span className="info-label">{info.label}:</span>
                    <span className="info-value">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Languages Section */}
        {formData.languages && formData.languages.length > 0 && (
          <div className="cv-section">
            <h3 className="section-heading">Languages</h3>
            <div className="section-content">
              <div className="languages-container">
                {formData.languages.map((language, index) => (
                  <div key={index} className="language-pill">
                    <span className="language-name">{language}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hobbies Section */}
        {formData.hobbies && formData.hobbies.length > 0 && (
          <div className="cv-section">
            <h3 className="section-heading">Hobbies</h3>
            <div className="section-content">
              <div className="hobbies-container">
                {formData.hobbies.map((hobby, index) => (
                  <div key={index} className="hobby-pill">
                    <span className="hobby-name">{hobby}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Custom Section */}
        {formData.customSection && formData.customSection.length > 0 && (
          <div className="cv-section">
            <h3 className="section-heading">
              {formData.customSection[0]?.heading || 'Custom Section'}
            </h3>
            <div className="section-content">
              <div className="custom-section-content">
                {formData.customSection.map((custom, index) => (
                  <div key={index} className="custom-section-item">
                    {custom.detail && (
                      <p className="custom-section-detail">{custom.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* References Section */}
        {formData.references && formData.references.length > 0 && (
          <div className="cv-section">
            <h3 className="section-heading">References</h3>
            <div className="section-content">
              <div className="references-content">
                {formData.references.map((reference, index) => (
                  <div key={index} className="reference-item">
                    <p className="reference-text">{reference}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Download PDF Button */}
        <div className="download-pdf-container">
          <button 
            className="download-pdf-button" 
            onClick={generatePDF}
            title="Download CV as PDF"
          >
            📄 Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Preview1;
