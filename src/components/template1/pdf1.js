import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePDF = async () => {
  try {
    console.log('Starting PDF generation...');
    
    // Get the CV preview element
    const cvPreview = document.querySelector('.cv-preview');
    
    if (!cvPreview) {
      console.error('CV preview element not found');
      alert('CV preview not found. Please make sure the CV is loaded.');
      return;
    }

    // Check if CV preview has content
    const hasContent = cvPreview.textContent && cvPreview.textContent.trim().length > 0;
    if (!hasContent) {
      console.error('CV preview has no content');
      alert('CV preview is empty. Please fill in some information before generating PDF.');
      return;
    }

    console.log('CV preview element found, generating canvas...');
    console.log('CV preview content:', cvPreview.innerHTML.substring(0, 500) + '...');
    console.log('CV preview dimensions:', {
      width: cvPreview.scrollWidth,
      height: cvPreview.scrollHeight,
      offsetWidth: cvPreview.offsetWidth,
      offsetHeight: cvPreview.offsetHeight
    });

    // Show loading message
    const originalButton = document.querySelector('.download-pdf-button');
    if (originalButton) {
      originalButton.textContent = 'Generating PDF...';
      originalButton.disabled = true;
    }

    // Hide the download button and apply compact styling before capturing
    const downloadButton = cvPreview.querySelector('.download-pdf-container');
    const originalDisplay = downloadButton ? downloadButton.style.display : '';
    if (downloadButton) {
      downloadButton.style.display = 'none';
    }

    // Apply compact PDF mode styling
    cvPreview.classList.add('pdf-mode');

    // Configure html2canvas options for compact PDF
    const canvas = await html2canvas(cvPreview, {
      scale: 3, // Reduced scale for better compatibility
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true, // Enable logging to debug
      scrollX: 0,
      scrollY: 0,
      width: cvPreview.offsetWidth || cvPreview.scrollWidth,
      height: cvPreview.offsetHeight || cvPreview.scrollHeight,
      removeContainer: false, // Keep container for better rendering
      foreignObjectRendering: false, // Disable for better compatibility
      imageTimeout: 15000, // Increase timeout for images
      onclone: (clonedDoc) => {
        // Ensure the cloned document has proper styling
        const clonedPreview = clonedDoc.querySelector('.cv-preview');
        if (clonedPreview) {
          clonedPreview.style.visibility = 'visible';
          clonedPreview.style.display = 'block';
          clonedPreview.style.width = 'auto';
          clonedPreview.style.height = 'auto';
        }
      }
    });

    console.log('Canvas generated, creating PDF...');
    console.log('Canvas dimensions:', {
      width: canvas.width,
      height: canvas.height
    });
    console.log('Canvas data URL length:', canvas.toDataURL().length);

    // Create PDF
    const imgData = canvas.toDataURL('image/jpeg', 2);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions - proper margins to prevent content cutoff
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10; // Proper margins to prevent content cutoff
    const contentWidth = pageWidth - (margin * 2); // Content width with proper margins
    const contentHeight = pageHeight - (margin * 2); // Content height with proper margins

    // Calculate image dimensions
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    // If content fits in one page
    if (imgHeight <= contentHeight) {
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
    } else {
      // Multi-page handling
      const totalPages = Math.ceil(imgHeight / contentHeight);
      
      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        if (pageNum > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of the image for this page
        const startY = pageNum * contentHeight;
        const endY = Math.min((pageNum + 1) * contentHeight, imgHeight);
        const pageImgHeight = endY - startY;
        
        // Create a canvas for this page slice
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = canvas.width;
        pageCanvas.height = (pageImgHeight / imgHeight) * canvas.height;
        
        // Draw the slice
        pageCtx.drawImage(
          canvas, 
          0, (startY / imgHeight) * canvas.height, 
          canvas.width, (pageImgHeight / imgHeight) * canvas.height,
          0, 0, 
          canvas.width, (pageImgHeight / imgHeight) * canvas.height
        );
        
        // Add to PDF - proper margins to prevent content cutoff
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 2);
        pdf.addImage(pageImgData, 'JPEG', margin, margin, imgWidth, pageImgHeight);
      }
    }

    console.log('PDF created, downloading...');

    // Generate filename with user's name if available
    const nameInput = document.querySelector('#name-input');
    const userName = nameInput ? nameInput.value.trim() : 'CV';
    const fileName = userName ? `${userName.replace(/\s+/g, '_')}_CV.pdf` : `CV_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Download the PDF
    pdf.save(fileName);

    console.log('PDF download completed');

    // Restore the download button visibility and remove compact styling
    if (downloadButton) {
      downloadButton.style.display = originalDisplay;
    }
    cvPreview.classList.remove('pdf-mode');

    // Reset button
    if (originalButton) {
      originalButton.textContent = '📄 Download PDF';
      originalButton.disabled = false;
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert(`Error generating PDF: ${error.message}. Please try again.`);
    
    // Restore the download button visibility and remove compact styling on error
    const downloadButton = document.querySelector('.download-pdf-container');
    const cvPreview = document.querySelector('.cv-preview');
    if (downloadButton) {
      downloadButton.style.display = '';
    }
    if (cvPreview) {
      cvPreview.classList.remove('pdf-mode');
    }
    
    // Reset button on error
    const originalButton = document.querySelector('.download-pdf-button');
    if (originalButton) {
      originalButton.textContent = '📄 Download PDF';
      originalButton.disabled = false;
    }
  }
};

export default generatePDF;
