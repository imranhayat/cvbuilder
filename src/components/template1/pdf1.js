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

    console.log('CV preview element found, generating canvas...');

    // Show loading message
    const originalButton = document.querySelector('.download-pdf-button');
    if (originalButton) {
      originalButton.textContent = 'Generating PDF...';
      originalButton.disabled = true;
    }

    // Configure html2canvas options
    const canvas = await html2canvas(cvPreview, {
      scale: 2, // Reduced scale for better performance
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width: cvPreview.scrollWidth,
      height: cvPreview.scrollHeight
    });

    console.log('Canvas generated, creating PDF...');

    // Create PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions - no margins, edge-to-edge
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 0; // No margins - edge-to-edge
    const contentWidth = pageWidth; // Full page width
    const contentHeight = pageHeight; // Full page height

    // Calculate image dimensions
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    // If content fits in one page
    if (imgHeight <= contentHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
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
        
        // Add to PDF - no margins, edge-to-edge
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.8);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageImgHeight);
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

    // Reset button
    if (originalButton) {
      originalButton.textContent = '📄 Download PDF';
      originalButton.disabled = false;
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert(`Error generating PDF: ${error.message}. Please try again.`);
    
    // Reset button on error
    const originalButton = document.querySelector('.download-pdf-button');
    if (originalButton) {
      originalButton.textContent = '📄 Download PDF';
      originalButton.disabled = false;
    }
  }
};

export default generatePDF;
