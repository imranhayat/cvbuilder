import React, { useEffect } from 'react';
import useFormHandler from './FormHandler1';
import './Form1.css';

function Form({ formData, updateFormData, markAsChanged }) {
    const { toggleSection, initializeForm, addSkillInput, addCertificationInput, addCustomInformation, addLanguageInput, addHobbyInput, addCustomSectionDetail, addReferenceInput } = useFormHandler();
    

    // Handle input changes and trigger auto-save
    const handleInputChange = (field, value) => {
        console.log('Form1 - handleInputChange called:', field, value);
        const newFormData = { ...formData, [field]: value };
        console.log('Form1 - newFormData:', newFormData);
        console.log('Form1 - References in newFormData:', newFormData.references);
        updateFormData(newFormData);
        markAsChanged();
    };

    // Initialize form on component mount
    useEffect(() => {
        initializeForm();
    }, [initializeForm]);
    return (
        <div className="left-container">
            <div id="contact-info" className="contact-info-section">
                <h3 className="section-title" onClick={() => toggleSection('contact-info')}>Contact Information</h3>

                <div className="file-input-container">
                    <label htmlFor="file-input" className="file-label">
                        Upload Image
                    </label>
                    <input
                        id="file-input"
                        className="file-input"
                        type="file"
                        accept="image/*"
                    />
                </div>

                <div className="name-input-container input-group">
                    <label htmlFor="name-input" className="name-label input-label">
                        Name
                    </label>
                    <input
                        id="name-input"
                        className="name-input styled-input"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                </div>

                <div className="position-input-container input-group">
                    <label htmlFor="position-input" className="position-label input-label">
                        Position/Title
                    </label>
                    <input
                        id="position-input"
                        className="position-input styled-input"
                        type="text"
                        name="position"
                        placeholder="Enter your position or title"
                        value={formData.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                </div>

                <div className="phone-input-container input-group">
                    <label htmlFor="phone-input" className="phone-label input-label">
                        Phone
                    </label>
                    <input
                        id="phone-input"
                        className="phone-input styled-input"
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                </div>

                <div className="email-input-container input-group">
                    <label htmlFor="email-input" className="email-label input-label">
                        Email
                    </label>
                    <input
                        id="email-input"
                        className="email-input styled-input"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                </div>

                <div className="address-input-container input-group">
                    <label htmlFor="address-input" className="address-label input-label">
                        Address
                    </label>
                    <input
                        id="address-input"
                        className="address-input styled-input"
                        type="text"
                        name="address"
                        placeholder="Enter your address"
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                </div>
            </div>

            <div id="professional-summary" className="professional-summary-section">
                <h3 className="section-title" onClick={() => toggleSection('professional-summary')} >Professional Summary</h3>

                <div className="professional-summary-textarea-container input-group">
                    <textarea
                        id="professional-summary-textarea"
                        className="professional-summary-textarea styled-input"
                        name="professionalSummary"
                        rows={4}
                        value={formData.professionalSummary || "To work with a organization that offers a creative, dynamic and professional environment, where my education, knowledge, skills and proven abilities can be fully utilized and which also offers learning opportunities for my career development in the long run."}
                        onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
                    />
                </div>
            </div>

            <div id="education" className="education-section">
                <h3 className="section-title" onClick={() => toggleSection('education')} >Education</h3>

                {/* Render all education entries dynamically */}
                {(formData.education || []).map((edu, index) => (
                    <div key={index} className="education-group">
                        <div className="degree-input-container input-group">
                            <label htmlFor={`degree-input-${index}`} className="degree-label input-label">
                                Degree
                            </label>
                            <input
                                id={`degree-input-${index}`}
                                className="degree-input styled-input"
                                type="text"
                                name="degree"
                                placeholder="Enter your degree"
                                value={edu.degree || ''}
                                onChange={(e) => {
                                    const newEducation = [...(formData.education || [])];
                                    newEducation[index].degree = e.target.value;
                                    handleInputChange('education', newEducation);
                                }}
                            />
                        </div>

                        <div className="board-input-container input-group">
                            <label htmlFor={`board-input-${index}`} className="board-label input-label">
                                Board/University
                            </label>
                            <input
                                id={`board-input-${index}`}
                                className="board-input styled-input"
                                type="text"
                                name="board"
                                placeholder="Enter your board or university"
                                value={edu.board || ''}
                                onChange={(e) => {
                                    const newEducation = [...(formData.education || [])];
                                    newEducation[index].board = e.target.value;
                                    handleInputChange('education', newEducation);
                                }}
                            />
                        </div>

                        <div className="year-input-container input-group">
                            <label htmlFor={`year-input-${index}`} className="year-label input-label">
                                Year
                            </label>
                            <input
                                id={`year-input-${index}`}
                                className="year-input styled-input"
                                type="text"
                                name="year"
                                placeholder="Enter the year"
                                value={edu.year || ''}
                                onChange={(e) => {
                                    const newEducation = [...(formData.education || [])];
                                    newEducation[index].year = e.target.value;
                                    handleInputChange('education', newEducation);
                                }}
                            />
                        </div>

                        <div className="marks-input-container input-group">
                            <label htmlFor={`marks-input-${index}`} className="marks-label input-label">
                                Marks/CGPA
                            </label>
                            <input
                                id={`marks-input-${index}`}
                                className="marks-input styled-input"
                                type="text"
                                name="marks"
                                placeholder="Enter your marks or CGPA"
                                value={edu.marks || ''}
                                onChange={(e) => {
                                    const newEducation = [...(formData.education || [])];
                                    newEducation[index].marks = e.target.value;
                                    handleInputChange('education', newEducation);
                                }}
                            />
                        </div>

                        {/* Remove button for each education entry */}
                        {index > 0 && (
                            <div className="remove-education-container">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        const newEducation = [...(formData.education || [])];
                                        newEducation.splice(index, 1);
                                        handleInputChange('education', newEducation);
                                    }} 
                                    className="remove-education-button"
                                >
                                    Remove Education
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <div className="add-education-container">
                    <button type="button" onClick={() => {
                        const newEducation = [...(formData.education || [])];
                        newEducation.push({ degree: '', board: '', year: '', marks: '' });
                        handleInputChange('education', newEducation);
                    }} className="add-education-button">
                        Add Education
                    </button>
                </div>
            </div>

            <div id="experience" className="experience-section">
                <h3 className="section-title" onClick={() => toggleSection('experience')} >Experience</h3>

                {/* Render all experience entries dynamically */}
                {(formData.experience || []).map((exp, index) => (
                    <div key={index} className="experience-group">
                        <div className="job-title-input-container input-group">
                            <label htmlFor={`job-title-input-${index}`} className="job-title-label input-label">
                                Job Title
                            </label>
                            <input
                                id={`job-title-input-${index}`}
                                className="job-title-input styled-input"
                                type="text"
                                name="jobTitle"
                                placeholder="Enter your job title"
                                value={exp.jobTitle || ''}
                                onChange={(e) => {
                                    const newExperience = [...(formData.experience || [])];
                                    newExperience[index].jobTitle = e.target.value;
                                    handleInputChange('experience', newExperience);
                                }}
                            />
                        </div>

                        <div className="company-input-container input-group">
                            <label htmlFor={`company-input-${index}`} className="company-label input-label">
                                Company
                            </label>
                            <input
                                id={`company-input-${index}`}
                                className="company-input styled-input"
                                type="text"
                                name="company"
                                placeholder="Enter your company"
                                value={exp.company || ''}
                                onChange={(e) => {
                                    const newExperience = [...(formData.experience || [])];
                                    newExperience[index].company = e.target.value;
                                    handleInputChange('experience', newExperience);
                                }}
                            />
                        </div>

                        <div className="duration-input-container input-group">
                            <label htmlFor={`duration-input-${index}`} className="duration-label input-label">
                                Duration
                            </label>
                            <input
                                id={`duration-input-${index}`}
                                className="duration-input styled-input"
                                type="text"
                                name="duration"
                                placeholder="Enter the duration"
                                value={exp.duration || ''}
                                onChange={(e) => {
                                    const newExperience = [...(formData.experience || [])];
                                    newExperience[index].duration = e.target.value;
                                    handleInputChange('experience', newExperience);
                                }}
                            />
                        </div>

                        <div className="job-details-input-container input-group">
                            <label htmlFor={`job-details-textarea-${index}`} className="job-details-label input-label">
                                Job Details
                            </label>
                            <textarea
                                id={`job-details-textarea-${index}`}
                                className="job-details-textarea styled-input"
                                name="jobDetails"
                                placeholder="Enter details about your job"
                                rows={2}
                                value={exp.jobDetails || ''}
                                onChange={(e) => {
                                    const newExperience = [...(formData.experience || [])];
                                    newExperience[index].jobDetails = e.target.value;
                                    handleInputChange('experience', newExperience);
                                }}
                            />
                        </div>

                        {/* Remove button for each experience entry */}
                        {index > 0 && (
                            <div className="remove-experience-container">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        const newExperience = [...(formData.experience || [])];
                                        newExperience.splice(index, 1);
                                        handleInputChange('experience', newExperience);
                                    }} 
                                    className="remove-experience-button"
                                >
                                    Remove Experience
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <div className="add-experience-container">
                    <button type="button" onClick={() => {
                        const newExperience = [...(formData.experience || [])];
                        newExperience.push({ jobTitle: '', company: '', duration: '', jobDetails: '' });
                        handleInputChange('experience', newExperience);
                    }} className="add-experience-button">
                        Add Experience
                    </button>
                </div>
            </div>

            <div id="certifications" className="certifications-section">
                <h3 className="section-title" onClick={() => toggleSection('certifications')} >Certifications</h3>

                <div className="certification-input-container input-group">
                    <input
                        id="certification-input"
                        className="certification-input styled-input"
                        type="text"
                        name="certification"
                        placeholder="Enter a certification"
                    />
                </div>

                <div className="add-certification-container">
                    <button type="button" onClick={addCertificationInput} className="add-certification-button">
                        Add Certification
                    </button>
                </div>
            </div>

            <div id="skills" className="skills-section">
                <h3 className="section-title" onClick={() => toggleSection('skills')} >Skills</h3>

                <div className="communication-skills-container input-group">

                    <input
                        id="communication-skills-input"
                        className="communication-skills-input styled-input"
                        type="text"
                        name="communicationSkills"
                        value={formData.skills?.[0] || "Communication Skills"}
                        onChange={(e) => {
                            const newSkills = [...(formData.skills || [])];
                            if (newSkills.length === 0) {
                                newSkills.push("Communication Skills");
                            }
                            newSkills[0] = e.target.value;
                            handleInputChange('skills', newSkills);
                        }}
                    />
                </div>

                <div className="time-management-container input-group">

                    <input
                        id="time-management-input"
                        className="time-management-input styled-input"
                        type="text"
                        name="timeManagement"
                        value={formData.skills?.[1] || "Time Management"}
                        onChange={(e) => {
                            const newSkills = [...(formData.skills || [])];
                            if (newSkills.length < 2) {
                                newSkills.push("Time Management");
                            }
                            newSkills[1] = e.target.value;
                            handleInputChange('skills', newSkills);
                        }}
                    />
                </div>

                <div className="problem-solving-container input-group">

                    <input
                        id="problem-solving-input"
                        className="problem-solving-input styled-input"
                        type="text"
                        name="problemSolving"
                        value={formData.skills?.[2] || "Problem Solving"}
                        onChange={(e) => {
                            const newSkills = [...(formData.skills || [])];
                            if (newSkills.length < 3) {
                                newSkills.push("Problem Solving");
                            }
                            newSkills[2] = e.target.value;
                            handleInputChange('skills', newSkills);
                        }}
                    />
                </div>

                <div className="hardworking-container input-group">

                    <input
                        id="hardworking-input"
                        className="hardworking-input styled-input"
                        type="text"
                        name="hardworking"
                        value={formData.skills?.[3] || "Hardworking"}
                        onChange={(e) => {
                            const newSkills = [...(formData.skills || [])];
                            if (newSkills.length < 4) {
                                newSkills.push("Hardworking");
                            }
                            newSkills[3] = e.target.value;
                            handleInputChange('skills', newSkills);
                        }}
                    />
                </div>

                <div className="add-skill-container">
                    <button type="button" onClick={addSkillInput} className="add-skill-button">
                        Add Skill
                    </button>
                </div>

            </div>

            <div id="other-information" className="other-information-section">
                <h3 className="section-title" onClick={() => toggleSection('other-information')} >Other Information</h3>

                <div className="father-name-input-container input-group">
                    <label htmlFor="father-name-input" className="father-name-label input-label">
                        Father's Name
                    </label>
                    <input
                        id="father-name-input"
                        className="father-name-input styled-input"
                        type="text"
                        name="fatherName"
                        placeholder="Enter father's name"
                    />
                </div>

                <div className="husband-name-input-container input-group">
                    <label htmlFor="husband-name-input" className="husband-name-label input-label">
                        Husband's Name
                    </label>
                    <input
                        id="husband-name-input"
                        className="husband-name-input styled-input"
                        type="text"
                        name="husbandName"
                        placeholder="Enter husband's name"
                    />
                </div>

                <div className="cnic-input-container input-group">
                    <label htmlFor="cnic-input" className="cnic-label input-label">
                        CNIC
                    </label>
                    <input
                        id="cnic-input"
                        className="cnic-input styled-input"
                        type="text"
                        name="cnic"
                        placeholder="Enter CNIC number"
                    />
                </div>

                <div className="dob-input-container input-group">
                    <label htmlFor="dob-input" className="dob-label input-label">
                        Date of Birth
                    </label>
                    <input
                        id="dob-input"
                        className="dob-input styled-input"
                        type="text"
                        name="dateOfBirth"
                        placeholder="Enter date of birth"
                    />
                </div>

                <div className="marital-status-input-container input-group">
                    <label htmlFor="marital-status-input" className="marital-status-label input-label">
                        Marital Status
                    </label>
                    <input
                        id="marital-status-input"
                        className="marital-status-input styled-input"
                        type="text"
                        name="maritalStatus"
                        placeholder="Enter marital status"
                    />
                </div>

                <div className="religion-input-container input-group">
                    <label htmlFor="religion-input" className="religion-label input-label">
                        Religion
                    </label>
                    <input
                        id="religion-input"
                        className="religion-input styled-input"
                        type="text"
                        name="religion"
                        placeholder="Enter religion"
                    />
                </div>

                <div className="add-information-container">
                    <button type="button" onClick={addCustomInformation} className="add-information-button">
                        Add Information
                    </button>
                </div>
            </div>

            <div id="languages" className="languages-section">
                <h3 className="section-title" onClick={() => toggleSection('languages')} >Languages</h3>

                <div className="english-language-container input-group">
                    <input
                        id="english-language-input"
                        className="english-language-input styled-input"
                        type="text"
                        name="englishLanguage"
                        value={formData.languages?.[0] || "English"}
                        onChange={(e) => {
                            const newLanguages = [...(formData.languages || [])];
                            if (newLanguages.length === 0) {
                                newLanguages.push("English");
                            }
                            newLanguages[0] = e.target.value;
                            handleInputChange('languages', newLanguages);
                        }}
                    />
                </div>

                <div className="urdu-language-container input-group">
                    <input
                        id="urdu-language-input"
                        className="urdu-language-input styled-input"
                        type="text"
                        name="urduLanguage"
                        value={formData.languages?.[1] || "Urdu"}
                        onChange={(e) => {
                            const newLanguages = [...(formData.languages || [])];
                            if (newLanguages.length < 2) {
                                newLanguages.push("Urdu");
                            }
                            newLanguages[1] = e.target.value;
                            handleInputChange('languages', newLanguages);
                        }}
                    />
                </div>

                <div className="punjabi-language-container input-group">
                    <input
                        id="punjabi-language-input"
                        className="punjabi-language-input styled-input"
                        type="text"
                        name="punjabiLanguage"
                        value={formData.languages?.[2] || "Punjabi"}
                        onChange={(e) => {
                            const newLanguages = [...(formData.languages || [])];
                            if (newLanguages.length < 3) {
                                newLanguages.push("Punjabi");
                            }
                            newLanguages[2] = e.target.value;
                            handleInputChange('languages', newLanguages);
                        }}
                    />
                </div>

                <div className="add-language-container">
                    <button type="button" onClick={addLanguageInput} className="add-language-button">
                        Add Language
                    </button>
                </div>
            </div>

            <div id="hobbies" className="hobbies-section">
                <h3 className="section-title" onClick={() => toggleSection('hobbies')} >Hobbies</h3>

                <div className="hobby-input-container input-group">
                    <input
                        id="hobby-input"
                        className="hobby-input styled-input"
                        type="text"
                        name="hobby"
                        placeholder="Enter a hobby"
                    />
                </div>

                <div className="add-hobby-container">
                    <button type="button" onClick={addHobbyInput} className="add-hobby-button">
                        Add Hobby
                    </button>
                </div>
            </div>

            <div id="custom-section" className="custom-section">
                <h3 className="section-title" onClick={() => toggleSection('custom-section')} >Custom Section</h3>

                <div className="custom-section-heading-input-container input-group">
                    <label htmlFor="custom-section-heading-input" className="custom-section-heading-label input-label">
                        Custom Section Heading
                    </label>
                    <input
                        id="custom-section-heading-input"
                        className="custom-section-heading-input styled-input"
                        type="text"
                        name="customSectionHeading"
                        placeholder="Enter custom section heading"
                    />
                </div>

                <div className="custom-section-detail-input-container input-group">
                    <label htmlFor="custom-section-detail-input" className="custom-section-detail-label input-label">
                        Custom Section Detail
                    </label>
                    <input
                        id="custom-section-detail-input"
                        className="custom-section-detail-input styled-input"
                        type="text"
                        name="customSectionDetail"
                        placeholder="Enter custom section detail"
                    />
                </div>

                <div className="add-detail-container">
                    <button type="button" onClick={addCustomSectionDetail} className="add-detail-button">
                        Add Detail
                    </button>
                </div>
            </div>

            <div id="references" className="references-section">
                <h3 className="section-title" onClick={() => toggleSection('references')}>References</h3>

                <div className="reference-input-container input-group">
                    <input
                        id="reference-input"
                        className="reference-input styled-input"
                        type="text"
                        name="reference"
                        placeholder="References would be furnished on demand."
                        defaultValue="References would be furnished on demand."
                        onChange={(e) => {
                            const value = e.target.value;
                            const newFormData = { ...formData, references: value.trim() ? [value] : [] };
                            updateFormData(newFormData);
                            markAsChanged();
                        }}
                    />
                </div>

                <div className="add-reference-container">
                    <button type="button" onClick={addReferenceInput} className="add-reference-button">
                        Add Reference
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Form;
