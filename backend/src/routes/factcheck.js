const express = require('express');
const multer = require('multer');
const pdfExtractor = require('../services/pdfExtractor');
const claimExtractor = require('../services/claimExtractor');
const webSearcher = require('../services/webSearcher');
const verifier = require('../services/verifier');
const Report = require('../models/Report');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are accepted.'));
    }
  },
});

router.post('/factcheck', upload.single('file'), async (req, res) => {
  // Validate file
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Extract text from PDF
  const text = await pdfExtractor(req.file.buffer);

  // Validate extracted text
  if (!text || text.length < 50) {
    return res.status(400).json({
      error:
        'PDF has no extractable text. Please use a text-based PDF, not a scanned image.',
    });
  }

  // Extract claims
  const claims = await claimExtractor(text);

  // If no claims found, return early
  if (claims.length === 0) {
    return res.json({
      filename: req.file.originalname,
      total_claims: 0,
      verified: 0,
      inaccurate: 0,
      false_count: 0,
      processed_at: new Date().toISOString(),
      claims: [],
      message: 'No specific factual claims found in this document.',
    });
  }

  // Verify all claims in parallel
  const results = await Promise.all(
    claims.map(async (claim) => {
      const searchResults = await webSearcher(claim);
      const verification = await verifier(claim, searchResults);
      return {
        claim,
        ...verification,
      };
    })
  );

  // Count verdicts
  const verified = results.filter((r) => r.status === 'Verified').length;
  const inaccurate = results.filter((r) => r.status === 'Inaccurate').length;
  const false_count = results.filter((r) => r.status === 'False').length;

  const reportData = {
    filename: req.file.originalname,
    total_claims: results.length,
    verified,
    inaccurate,
    false_count,
    processed_at: new Date(),
    claims: results,
  };

  // Save to MongoDB (non-blocking)
  if (process.env.MONGODB_URI) {
    Report.create(reportData).catch((err) => {
      console.warn('[WARNING] Failed to save report to database:', err.message);
    });
  }

  res.json({
    ...reportData,
    processed_at: reportData.processed_at.toISOString(),
  });
});

module.exports = router;
