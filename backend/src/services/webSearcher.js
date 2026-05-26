const axios = require('axios');

// Retry logic for network failures
async function retryWithBackoff(fn, maxRetries = 2, initialDelayMs = 500) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < maxRetries - 1) {
        const delayMs = initialDelayMs * Math.pow(2, i);
        console.log(`[webSearcher] Retry ${i + 1}/${maxRetries} after ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
}

async function webSearcher(claim) {
  try {
    const response = await retryWithBackoff(() =>
      axios.post(
        'https://api.tavily.com/search',
        {
          api_key: process.env.TAVILY_API_KEY,
          query: claim,
          search_depth: 'basic',
          max_results: 3, // Reduced from 5 to 3 for speed
          include_answer: true,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 8000, // 8 second timeout per request
        }
      )
    );

    if (!response.data.results) {
      return [];
    }

    return response.data.results.map((r) => ({
      title: r.title || '',
      url: r.url || '',
      content: (r.content || '').slice(0, 300), // Limit content size for speed
    }));
  } catch (error) {
    console.error('[webSearcher] Error searching web for claim:', error.message);
    return []; // Return empty on error, verifier will mark as Unverifiable
  }
}

module.exports = webSearcher;
