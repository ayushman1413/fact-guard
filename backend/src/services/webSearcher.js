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
    if (!process.env.TAVILY_API_KEY) {
      console.error('[webSearcher] TAVILY_API_KEY is not set');
      return [];
    }

    const response = await retryWithBackoff(() =>
      axios.post(
        'https://api.tavily.com/search',
        {
          api_key: process.env.TAVILY_API_KEY,
          query: claim,
          search_depth: 'basic',
          max_results: 3,
          include_answer: true,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000, // 10 second timeout
        }
      )
    );

    if (!response.data || !response.data.results) {
      console.warn('[webSearcher] No results in response for:', claim.substring(0, 50));
      return [];
    }

    const results = response.data.results.map((r) => ({
      title: r.title || '',
      url: r.url || '',
      content: (r.content || '').slice(0, 500),
    }));

    console.log(`[webSearcher] Found ${results.length} results for: "${claim.substring(0, 50)}..."`);
    return results;
  } catch (error) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    
    if (status === 401 || status === 403) {
      console.error(`[webSearcher] Authentication error (${status}): Invalid TAVILY_API_KEY`);
    } else if (status === 429) {
      console.error('[webSearcher] Rate limited by Tavily API');
    } else {
      console.error(`[webSearcher] Error searching for "${claim.substring(0, 40)}...": ${msg}`);
    }
    
    return [];
  }
}

module.exports = webSearcher;
