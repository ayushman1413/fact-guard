const axios = require('axios');

async function webSearcher(claim) {
  try {
    const response = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: process.env.TAVILY_API_KEY,
        query: claim,
        search_depth: 'basic',
        max_results: 5,
        include_answer: true,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.data.results) {
      return [];
    }

    return response.data.results.map((r) => ({
      title: r.title || '',
      url: r.url || '',
      content: r.content || '',
    }));
  } catch (error) {
    console.error('[webSearcher] Error searching web for claim:', error.message);
    return [];
  }
}

module.exports = webSearcher;
