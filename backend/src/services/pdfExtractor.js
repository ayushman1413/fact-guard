const pdfParse = require('pdf-parse');

async function pdfExtractor(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (error) {
    console.error('[pdfExtractor] Error parsing PDF:', error.message, error.stack);
    // Include the original error message in the thrown error so the frontend can display it for troubleshooting
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

module.exports = pdfExtractor;
