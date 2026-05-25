const pdfParse = require('pdf-parse');

async function pdfExtractor(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (error) {
    console.error('[pdfExtractor] Error parsing PDF:', error.message);
    throw new Error('Failed to extract text from PDF. Please ensure the PDF contains text.');
  }
}

module.exports = pdfExtractor;
