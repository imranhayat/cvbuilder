import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generatePDF = async () => {
  try {
    // Get the CV preview element
    const cvPreview = document.querySelector('.cv-preview');
    
    if (!cvPreview) {
      console.error('CV preview element not found');
      return;
    }

    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '794px'; // A4 width in pixels (210mm at 96 DPI)
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '0';
    tempContainer.style.margin = '0';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.boxSizing = 'border-box';
    
    // Clone the CV preview content but exclude the download button
    const clonedContent = cvPreview.cloneNode(true);
    
    // Remove the download button from the cloned content
    const downloadContainer = clonedContent.querySelector('.download-pdf-container');
    if (downloadContainer) {
      downloadContainer.remove();
    }
    
    tempContainer.appendChild(clonedContent);
    document.body.appendChild(tempContainer);

    // Wait for any images to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Configure html2canvas options for optimized quality and smaller file size
    const canvas = await html2canvas(tempContainer, {
      scale: 3, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels (210mm)
      height: tempContainer.scrollHeight,
      logging: false, // Disable logging for better performance
      removeContainer: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: tempContainer.scrollHeight
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    // Create PDF with optimized settings
    const imgData = canvas.toDataURL('image/jpeg', 0.85); // Use JPEG with 85% quality
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true // Enable PDF compression
    });

    // Calculate dimensions with proper margins
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const topMargin = 6.35; // 0.25 inches in mm
    const bottomMargin = 6.35; // 0.25 inches in mm
    const contentHeight = pageHeight - topMargin - bottomMargin; // Available content height
    
    // Calculate image dimensions to fill the entire page width
    const imgWidth = pageWidth; // Full page width
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    
    // Calculate how many pages we need
    const totalPages = Math.ceil(imgHeight / contentHeight);
    
    // Add content to each page with proper margins
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      if (pageNum > 0) {
        pdf.addPage();
      }
      
      // Calculate the Y position for this page
      const startY = pageNum * contentHeight;
      const endY = Math.min((pageNum + 1) * contentHeight, imgHeight);
      const pageContentHeight = endY - startY;
      
      // Calculate the source Y position in the original image
      const sourceY = (startY / imgHeight) * canvas.height;
      const sourceHeight = (pageContentHeight / imgHeight) * canvas.height;
      
      // Create a new canvas for this page slice
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      
      // Draw the slice of the original canvas
      pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
      
      // Convert to image data
      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.85);
      
      // Add to PDF with proper margins
      let pdfY = topMargin; // Start with top margin
      if (pageNum > 0) {
        pdfY = topMargin; // Top margin for subsequent pages
      }
      
      pdf.addImage(pageImgData, 'JPEG', 0, pdfY, imgWidth, pageContentHeight);
    }

    // Download the PDF
    const fileName = `CV_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

export default generatePDF;
