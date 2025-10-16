
const useFormHandler = () => {
    // Function to toggle section visibility with beautiful list style
    const toggleSection = (sectionId) => {
        // Get all sections
        const allSections = document.querySelectorAll('.contact-info-section, .professional-summary-section, .education-section, .experience-section, .certifications-section, .skills-section, .other-information-section, .languages-section, .hobbies-section, .custom-section, .references-section');
        
        // Remove active class from all sections
        allSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Add active class to clicked section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    };

    // Function to initialize the form - show only Contact Information on page load
    const initializeForm = () => {
        // Get all sections
        const allSections = document.querySelectorAll('.contact-info-section, .professional-summary-section, .education-section, .experience-section, .certifications-section, .skills-section, .other-information-section, .languages-section, .hobbies-section, .custom-section, .references-section');
        
        // Remove active class from all sections
        allSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show only Contact Information section
        const contactSection = document.getElementById('contact-info');
        if (contactSection) {
            contactSection.classList.add('active');
        }
    };

    // Function to add new education group
    const addEducationGroup = () => {
        const educationSection = document.getElementById('education');
        if (educationSection) {
            const timestamp = Date.now();
            const newEducationGroup = document.createElement('div');
            newEducationGroup.className = 'education-group';
            
            newEducationGroup.innerHTML = `
                <div class="degree-input-container input-group">
                    <label for="degree-input-${timestamp}" class="degree-label input-label">Degree</label>
                    <input id="degree-input-${timestamp}" class="degree-input styled-input" type="text" name="degree" placeholder="Enter your degree" />
                </div>
                <div class="board-input-container input-group">
                    <label for="board-input-${timestamp}" class="board-label input-label">Board/University</label>
                    <input id="board-input-${timestamp}" class="board-input styled-input" type="text" name="board" placeholder="Enter your board or university" />
                </div>
                <div class="year-input-container input-group">
                    <label for="year-input-${timestamp}" class="year-label input-label">Year</label>
                    <input id="year-input-${timestamp}" class="year-input styled-input" type="text" name="year" placeholder="Enter the year" />
                </div>
                <div class="marks-input-container input-group">
                    <label for="marks-input-${timestamp}" class="marks-label input-label">Marks/CGPA</label>
                    <input id="marks-input-${timestamp}" class="marks-input styled-input" type="text" name="marks" placeholder="Enter your marks or CGPA" />
                </div>
                <div class="remove-education-container">
                    <button type="button" class="remove-education-button" onclick="this.parentElement.parentElement.remove()">Remove Education</button>
                </div>
            `;
            
            educationSection.appendChild(newEducationGroup);
        }
    };

    // Function to add new experience group
    const addExperienceGroup = () => {
        const experienceSection = document.getElementById('experience');
        if (experienceSection) {
            const timestamp = Date.now();
            const newExperienceGroup = document.createElement('div');
            newExperienceGroup.className = 'experience-group';
            
            newExperienceGroup.innerHTML = `
                <div class="job-title-input-container input-group">
                    <label for="job-title-input-${timestamp}" class="job-title-label input-label">Job Title</label>
                    <input id="job-title-input-${timestamp}" class="job-title-input styled-input" type="text" name="jobTitle" placeholder="Enter your job title" />
                </div>
                <div class="company-input-container input-group">
                    <label for="company-input-${timestamp}" class="company-label input-label">Company</label>
                    <input id="company-input-${timestamp}" class="company-input styled-input" type="text" name="company" placeholder="Enter your company" />
                </div>
                <div class="duration-input-container input-group">
                    <label for="duration-input-${timestamp}" class="duration-label input-label">Duration</label>
                    <input id="duration-input-${timestamp}" class="duration-input styled-input" type="text" name="duration" placeholder="Enter the duration" />
                </div>
                <div class="job-details-input-container input-group">
                    <label for="job-details-textarea-${timestamp}" class="job-details-label input-label">Job Details</label>
                    <textarea id="job-details-textarea-${timestamp}" class="job-details-textarea styled-input" name="jobDetails" placeholder="Enter details about your job" rows="2"></textarea>
                </div>
                <div class="remove-experience-container">
                    <button type="button" class="remove-experience-button" onclick="this.parentElement.parentElement.remove()">Remove Experience</button>
                </div>
            `;
            
            experienceSection.appendChild(newExperienceGroup);
        }
    };

    // Function to add new skill input
    const addSkillInput = () => {
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const timestamp = Date.now();
            const newSkillContainer = document.createElement('div');
            newSkillContainer.className = 'skill-input-container input-group';
            
            newSkillContainer.innerHTML = `
                <div class="skill-input-wrapper">
                    <input id="skill-input-${timestamp}" class="skill-input styled-input" type="text" name="skill" placeholder="Enter a skill" />
                    <button type="button" class="remove-skill-button" onclick="this.parentElement.parentElement.remove()">Remove</button>
                </div>
            `;
            
            const addSkillContainer = skillsSection.querySelector('.add-skill-container');
            if (addSkillContainer) {
                skillsSection.insertBefore(newSkillContainer, addSkillContainer);
            } else {
                skillsSection.appendChild(newSkillContainer);
            }
        }
    };

    // Function to add new certification input
    const addCertificationInput = () => {
        const certificationsSection = document.getElementById('certifications');
        if (certificationsSection) {
            const timestamp = Date.now();
            const newCertificationContainer = document.createElement('div');
            newCertificationContainer.className = 'certification-input-container input-group';
            
            newCertificationContainer.innerHTML = `
                <div class="certification-input-wrapper">
                    <input id="certification-input-${timestamp}" class="certification-input styled-input" type="text" name="certification" placeholder="Enter a certification" />
                    <button type="button" class="remove-certification-button" onclick="this.parentElement.parentElement.remove()">Remove</button>
                </div>
            `;
            
            const addCertificationContainer = certificationsSection.querySelector('.add-certification-container');
            if (addCertificationContainer) {
                certificationsSection.insertBefore(newCertificationContainer, addCertificationContainer);
            } else {
                certificationsSection.appendChild(newCertificationContainer);
            }
        }
    };

    // Function to add new custom information field
    const addCustomInformation = () => {
        const otherInfoSection = document.getElementById('other-information');
        if (otherInfoSection) {
            const timestamp = Date.now();
            const newCustomField = document.createElement('div');
            newCustomField.className = 'custom-info-container input-group';
            
            newCustomField.innerHTML = `
                <div class="custom-info-wrapper">
                    <div class="custom-label-input">
                        <label for="custom-label-${timestamp}" class="custom-label">Label:</label>
                        <input id="custom-label-${timestamp}" class="custom-label-input-field styled-input" type="text" name="customLabel" placeholder="Enter label" />
                    </div>
                    <div class="custom-value-input">
                        <label for="custom-value-${timestamp}" class="custom-label">Value:</label>
                        <input id="custom-value-${timestamp}" class="custom-value-input-field styled-input" type="text" name="customValue" placeholder="Enter value" />
                    </div>
                    <button type="button" class="remove-custom-button" onclick="this.parentElement.parentElement.remove()">Remove</button>
                </div>
            `;
            
            const addInfoContainer = otherInfoSection.querySelector('.add-information-container');
            if (addInfoContainer) {
                otherInfoSection.insertBefore(newCustomField, addInfoContainer);
            } else {
                otherInfoSection.appendChild(newCustomField);
            }
        }
    };

    // Function to add new language input
    const addLanguageInput = () => {
        const languagesSection = document.getElementById('languages');
        if (languagesSection) {
            const timestamp = Date.now();
            const newLanguageContainer = document.createElement('div');
            newLanguageContainer.className = 'language-input-container input-group';
            
            newLanguageContainer.innerHTML = `
                <div class="language-input-wrapper">
                    <input id="language-input-${timestamp}" class="language-input styled-input" type="text" name="language" placeholder="Enter a language" />
                    <button type="button" class="remove-language-button" onclick="this.parentElement.parentElement.remove()">Remove</button>
                </div>
            `;
            
            const addLanguageContainer = languagesSection.querySelector('.add-language-container');
            if (addLanguageContainer) {
                languagesSection.insertBefore(newLanguageContainer, addLanguageContainer);
            } else {
                languagesSection.appendChild(newLanguageContainer);
            }
        }
    };

    // Function to add new hobby input
    const addHobbyInput = () => {
        const hobbiesSection = document.getElementById('hobbies');
        if (hobbiesSection) {
            const timestamp = Date.now();
            const newHobbyContainer = document.createElement('div');
            newHobbyContainer.className = 'hobby-input-container input-group';
            
            newHobbyContainer.innerHTML = `
                <div class="hobby-input-wrapper">
                    <input id="hobby-input-${timestamp}" class="hobby-input styled-input" type="text" name="hobby" placeholder="Enter a hobby" />
                    <button type="button" class="remove-hobby-button" onclick="this.parentElement.parentElement.remove()">Remove</button>
                </div>
            `;
            
            const addHobbyContainer = hobbiesSection.querySelector('.add-hobby-container');
            if (addHobbyContainer) {
                hobbiesSection.insertBefore(newHobbyContainer, addHobbyContainer);
            } else {
                hobbiesSection.appendChild(newHobbyContainer);
            }
        }
    };

    // Function to add new custom section detail
    const addCustomSectionDetail = () => {
        const customSection = document.getElementById('custom-section');
        if (customSection) {
            const timestamp = Date.now();
            const newDetailContainer = document.createElement('div');
            newDetailContainer.className = 'custom-detail-container input-group';
            
            newDetailContainer.innerHTML = `
                <div class="custom-detail-wrapper">
                    <input id="custom-detail-input-${timestamp}" class="custom-detail-input styled-input" type="text" name="customDetail" placeholder="Enter custom section detail" />
                    <button type="button" class="remove-detail-button" onclick="this.parentElement.parentElement.remove()">Remove</button>
                </div>
            `;
            
            const addDetailContainer = customSection.querySelector('.add-detail-container');
            if (addDetailContainer) {
                customSection.insertBefore(newDetailContainer, addDetailContainer);
            } else {
                customSection.appendChild(newDetailContainer);
            }
        }
    };

    // Function to add new reference input
    const addReferenceInput = () => {
        const referencesSection = document.getElementById('references');
        if (referencesSection) {
            const timestamp = Date.now();
            const newReferenceContainer = document.createElement('div');
            newReferenceContainer.className = 'reference-input-container input-group';
            
            newReferenceContainer.innerHTML = `
                <div class="reference-input-wrapper">
                    <input id="reference-input-${timestamp}" class="reference-input styled-input" type="text" name="reference" placeholder="Enter a reference" />
                    <button type="button" class="remove-reference-button" onclick="this.parentElement.parentElement.remove()">Remove</button>
                </div>
            `;
            
            const addReferenceContainer = referencesSection.querySelector('.add-reference-container');
            if (addReferenceContainer) {
                referencesSection.insertBefore(newReferenceContainer, addReferenceContainer);
            } else {
                referencesSection.appendChild(newReferenceContainer);
            }
        }
    };

    return {
        toggleSection,
        initializeForm,
        addEducationGroup,
        addExperienceGroup,
        addSkillInput,
        addCertificationInput,
        addCustomInformation,
        addLanguageInput,
        addHobbyInput,
        addCustomSectionDetail,
        addReferenceInput
    };
};

export default useFormHandler;
