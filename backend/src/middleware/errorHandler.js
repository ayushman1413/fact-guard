function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);
  console.error(err.stack);

  if (err.message && err.message.includes('Only PDF')) {
    return res.status(400).json({ error: 'Only PDF files are accepted.' });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(400)
      .json({ error: 'File too large. Max size is 10MB.' });
  }

  if (err.message === 'Unexpected field') {
    return res.status(400).json({ error: 'Invalid form field. Expected "file".' });
  }

  res.status(500).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
