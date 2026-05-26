const express = require('express');
const multer = require('multer');
const pdfExtractor = require('../services/pdfExtractor');
const claimExtractor = require('../services/claimExtractor');
const webSearcher = require('../services/webSearcher');
const verifier = require('../services/verifier');
const mockVerifier = require('../services/mockVerifier');
const Report = require('../models/Report');

const router = express.Router();
const VERIFICATION_MODE = process.env.VERIFICATION_MODE || 'demo';
const MAX_CLAIMS_PER_PDF = parseInt(process.env.MAX_CLAIMS_PER_PDF || '10');
const RATE_LIMIT_DELAY = parseInt(process.env.RATE_LIMIT_DELAY || '300');

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
  try {
    // Validate file
    if (!req.file) {
      console.error('[factcheck] No file uploaded');
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    console.log(`[factcheck] Processing file: ${req.file.originalname}`);

    // Extract text from PDF
    let text;
    try {
      text = await pdfExtractor(req.file.buffer);
      console.log(`[factcheck] Extracted ${text.length} characters from PDF`);
    } catch (error) {
      console.error('[factcheck] PDF extraction failed:', error.message);
      return res.status(400).json({
        error: 'Failed to extract text from PDF. Please ensure it contains readable text.',
      });
    }

    // Validate extracted text
    if (!text || text.length < 50) {
      console.warn('[factcheck] Extracted text too short:', text?.length || 0);
      return res.status(400).json({
        error:
          'PDF has no extractable text. Please use a text-based PDF, not a scanned image.',
      });
    }

    // Extract claims
    let claims;
    try {
      claims = await claimExtractor(text);
      console.log(`[factcheck] Extracted ${claims.length} claims from document`);
    } catch (error) {
      console.error('[factcheck] Claim extraction failed:', error.message);
      return res.status(400).json({
        error: 'Failed to extract claims from document. Try a document with more factual content.',
      });
    }

    // If no claims found, return early
    if (claims.length === 0) {
      console.warn('[factcheck] No claims found in document');
      return res.json({
        filename: req.file.originalname,
        total_claims: 0,
        verified: 0,
        inaccurate: 0,
        false_count: 0,
        processed_at: new Date().toISOString(),
        claims: [],
        message: 'No specific factual claims found in this document. Try a document with statistics, dates, or concrete facts.',
      });
    }

    // Limit claims to reduce token usage
    if (claims.length > MAX_CLAIMS_PER_PDF) {
      console.log(`[factcheck] Limiting ${claims.length} claims to top ${MAX_CLAIMS_PER_PDF}`);
      claims = claims.slice(0, MAX_CLAIMS_PER_PDF);
    }

    // Verify all claims with rate limiting to avoid hitting API limits
    console.log(`[factcheck] Starting verification of ${claims.length} claims (mode: ${VERIFICATION_MODE})...`);
    const results = [];
    
    // Process sequentially with delays to reduce rate limit issues
    for (let idx = 0; idx < claims.length; idx++) {
      const claim = claims[idx];
      try {
        // Add small delay between requests to avoid rate limits
        if (idx > 0) {
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        }
        
        console.log(`[factcheck] Verifying claim ${idx + 1}/${claims.length}: "${claim.substring(0, 50)}..."`);
        
        // In mock mode, skip web search
        let verification;
        if (VERIFICATION_MODE === 'mock') {
          verification = await mockVerifier(claim);
        } else {
          const searchResults = await webSearcher(claim);
          verification = await verifier(claim, searchResults);
        }
        
        results.push({
          claim,
          ...verification,
        });
      } catch (error) {
        console.error(`[factcheck] Error verifying claim ${idx + 1}:`, error.message);
        results.push({
          claim,
          status: 'Error',
          explanation: 'Verification failed',
          correct_fact: '',
          source: '',
        });
      }
    }

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

    console.log(`[factcheck] Analysis complete: ${verified} verified, ${inaccurate} inaccurate, ${false_count} false`);

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
  } catch (error) {
    console.error('[factcheck] Unexpected error:', error.message);
    res.status(500).json({
      error: 'An unexpected error occurred during analysis. Check server logs.',
    });
  }
});

module.exports = router;
